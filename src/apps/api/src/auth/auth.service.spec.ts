import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { SystemLogsModule } from '../system-logs/system-logs.module';
import { User } from '../users/users.model';
import { UserRole } from '../users/constants';
import { ClinicianProfile } from '../users/clinician-profile.model';
import { Tenant } from '../tenants/tenants.model';
import { Practice } from '../practices/practices.model';
import {
  Child,
  GrowthRecord,
  CompletedMilestone,
  CompletedVaccination,
  Allergy,
  MedicalCondition,
} from '../children/children.model';
import { Report } from '../reports/reports.model';
import { Appointment } from '../appointments/appointments.model';
import { BlogPost } from '../blog/blog.model';
import { Example } from '../examples/examples.model';
import { SystemLog } from '../common/models/system-log.model';

// Integration test against a REAL local Postgres (Docker on 5433) per CLAUDE.md —
// the DB is never mocked. Start it with `moon run api:db-start` before running.
const entities = [
  Example,
  User,
  ClinicianProfile,
  Tenant,
  Practice,
  Child,
  GrowthRecord,
  CompletedMilestone,
  CompletedVaccination,
  Allergy,
  MedicalCondition,
  Report,
  Appointment,
  BlogPost,
  SystemLog,
];

const EMAIL_DOMAIN = 'phase2-auth-test.local';
const uniqueEmail = () =>
  `user-${Date.now()}-${Math.floor(Math.random() * 1e6)}@${EMAIL_DOMAIN}`;

describe('AuthService (integration)', () => {
  let moduleRef: TestingModule;
  let service: AuthService;
  let users: Repository<User>;

  beforeAll(async () => {
    const databaseUrl = process.env.DATABASE_URL;
    const ssl =
      process.env.DB_SSL === 'true' ||
      (!!databaseUrl && /sslmode=require/.test(databaseUrl));

    moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot(
          databaseUrl
            ? {
                type: 'postgres',
                url: databaseUrl,
                entities,
                synchronize: true,
                ssl: ssl ? { rejectUnauthorized: false } : false,
              }
            : {
                type: 'postgres',
                host: process.env.DB_HOST || 'localhost',
                port: parseInt(process.env.DB_PORT ?? '5433', 10),
                username: process.env.DB_USER || 'postgres',
                password: process.env.DB_PASSWORD || 'password123',
                database: process.env.DB_NAME || 'raisingatlantic',
                entities,
                synchronize: true,
              },
        ),
        TypeOrmModule.forFeature([User]),
        SystemLogsModule,
        JwtModule.register({
          global: true,
          secret: 'test-secret',
          signOptions: { expiresIn: '15m' },
        }),
      ],
      providers: [AuthService],
    }).compile();

    service = moduleRef.get(AuthService);
    users = moduleRef.get<Repository<User>>(getRepositoryToken(User));
  });

  afterAll(async () => {
    if (users) {
      await users
        .createQueryBuilder()
        .delete()
        .where('email LIKE :pattern', { pattern: `%@${EMAIL_DOMAIN}` })
        .execute();
    }
    await moduleRef?.close();
  });

  it('registers a user, hashes the password, and never returns the hash', async () => {
    const email = uniqueEmail();
    const result = await service.register({
      name: 'Test Parent',
      email,
      phone: '+27000000000',
      password: 'a-strong-passphrase',
      role: UserRole.PARENT,
    });

    expect(result.user.email).toBe(email);
    expect(result.token).toBeTruthy();
    expect(
      (result.user as Record<string, unknown>).passwordHash,
    ).toBeUndefined();

    const stored = await users
      .createQueryBuilder('u')
      .addSelect('u.passwordHash')
      .where('u.email = :email', { email })
      .getOne();
    expect(stored?.passwordHash).toBeTruthy();
    expect(stored?.passwordHash).not.toBe('a-strong-passphrase');
    await expect(
      bcrypt.compare('a-strong-passphrase', stored!.passwordHash!),
    ).resolves.toBe(true);
  });

  it('rejects a duplicate email registration', async () => {
    const email = uniqueEmail();
    const base = {
      name: 'Dup',
      email,
      phone: '+27000000001',
      password: 'a-strong-passphrase',
      role: UserRole.PARENT,
    };
    await service.register(base);
    await expect(service.register(base)).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it('logs in with correct credentials and rejects a wrong password', async () => {
    const email = uniqueEmail();
    await service.register({
      name: 'Login User',
      email,
      phone: '+27000000002',
      password: 'correct-horse-battery',
      role: UserRole.CLINICIAN,
    });

    const ok = await service.login({
      email,
      password: 'correct-horse-battery',
    });
    expect(ok.user.email).toBe(email);
    expect(ok.user.role).toBe(UserRole.CLINICIAN);

    await expect(
      service.login({ email, password: 'wrong-password' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects login for an unknown email', async () => {
    await expect(
      service.login({ email: uniqueEmail(), password: 'whatever' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('returns the current user for getMe and rejects an unknown id', async () => {
    const email = uniqueEmail();
    const { user } = await service.register({
      name: 'Me User',
      email,
      phone: '+27000000003',
      password: 'a-strong-passphrase',
      role: UserRole.PARENT,
    });

    const me = await service.getMe(user.id);
    expect(me.email).toBe(email);
    await expect(
      service.getMe('00000000-0000-0000-0000-000000000000'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('reports Google sign-in as unavailable when GOOGLE_CLIENT_ID is unset', async () => {
    if (process.env.GOOGLE_CLIENT_ID) {
      return; // Configured in this env — skip the unavailable-path assertion.
    }
    await expect(
      service.loginWithGoogle({ idToken: 'irrelevant' }),
    ).rejects.toBeInstanceOf(ServiceUnavailableException);
  });
});
