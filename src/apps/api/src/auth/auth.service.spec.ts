import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { generate as generateTotpCode } from 'otplib';
import { AuthService, isMfaChallenge } from './auth.service';
import type { AuthResult, MfaChallengeResult } from './auth.service';
import { SystemLogsModule } from '../system-logs/system-logs.module';
import { NOTIFICATION_TOKENS } from '@core/notifications/interfaces/tokens';
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
  const sentEmails: { to: string; subject: string; text?: string }[] = [];
  const dispatcher = {
    email: jest.fn((msg: { to: string; subject: string; text?: string }) => {
      sentEmails.push(msg);
      return Promise.resolve({ delivered: true, providerId: 'test' });
    }),
    sms: jest.fn(),
    push: jest.fn(),
    notifyUser: jest.fn(),
  };

  beforeAll(async () => {
    // Must match the JwtModule secret below and be set BEFORE ConfigModule
    // snapshots process.env — verifyMfaChallenge reads it via ConfigService.
    process.env.JWT_SECRET = 'test-secret';
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
      providers: [
        AuthService,
        { provide: NOTIFICATION_TOKENS.Dispatcher, useValue: dispatcher },
      ],
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

  function lastTokenSentTo(email: string): string {
    const match = [...sentEmails]
      .reverse()
      .find((m) => m.to === email)
      ?.text?.match(/token=([0-9a-f]{64})/);
    expect(match).toBeTruthy();
    return match![1];
  }

  async function markVerified(email: string): Promise<void> {
    await users.update({ email }, { emailVerified: true });
  }

  function asSession(result: unknown): AuthResult {
    expect(isMfaChallenge(result as AuthResult)).toBe(false);
    return result as AuthResult;
  }

  function asChallenge(result: unknown): MfaChallengeResult {
    expect(isMfaChallenge(result as MfaChallengeResult)).toBe(true);
    return result as MfaChallengeResult;
  }

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
    expect(
      (result.user as Record<string, unknown>).mfaSecret,
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

  it('blocks login until the email is verified, then allows it', async () => {
    const email = uniqueEmail();
    await service.register({
      name: 'Unverified',
      email,
      phone: '+27000000002',
      password: 'correct-horse-battery',
      role: UserRole.PARENT,
    });

    await expect(
      service.login({ email, password: 'correct-horse-battery' }),
    ).rejects.toBeInstanceOf(ForbiddenException);

    await markVerified(email);
    const ok = asSession(
      await service.login({ email, password: 'correct-horse-battery' }),
    );
    expect(ok.user.email).toBe(email);

    await expect(
      service.login({ email, password: 'wrong-password' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('verifies an email via the emailed token (round trip)', async () => {
    const email = uniqueEmail();
    await service.register({
      name: 'Verify Me',
      email,
      phone: '+27000000004',
      password: 'a-strong-passphrase',
      role: UserRole.PARENT,
    });

    await service.requestEmailVerification(email);
    const token = lastTokenSentTo(email);

    await expect(service.verifyEmail('0'.repeat(64))).rejects.toBeInstanceOf(
      BadRequestException,
    );
    await service.verifyEmail(token);

    const ok = asSession(
      await service.login({ email, password: 'a-strong-passphrase' }),
    );
    expect(ok.user.emailVerified).toBe(true);
  });

  it('resets a password via the emailed token (round trip)', async () => {
    const email = uniqueEmail();
    await service.register({
      name: 'Reset Me',
      email,
      phone: '+27000000005',
      password: 'old-password-123',
      role: UserRole.PARENT,
    });
    await markVerified(email);

    // Unknown emails resolve silently — no user enumeration.
    await expect(
      service.requestPasswordReset(uniqueEmail()),
    ).resolves.toBeUndefined();

    await service.requestPasswordReset(email);
    const token = lastTokenSentTo(email);
    await service.resetPassword(token, 'new-password-456');

    await expect(
      service.login({ email, password: 'old-password-123' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    const ok = asSession(
      await service.login({ email, password: 'new-password-456' }),
    );
    expect(ok.user.email).toBe(email);

    // Token is single-use.
    await expect(
      service.resetPassword(token, 'another-password'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('forces MFA setup for privileged roles and completes the enrolment flow', async () => {
    const email = uniqueEmail();
    const { user } = await service.register({
      name: 'Dr Privileged',
      email,
      phone: '+27000000006',
      password: 'clinician-pass-1',
      role: UserRole.CLINICIAN,
    });
    await markVerified(email);

    const challenge = asChallenge(
      await service.login({ email, password: 'clinician-pass-1' }),
    );
    expect(challenge.mfaSetupRequired).toBe(true);
    expect(challenge.mfaToken).toBeTruthy();

    const { secret, otpauthUrl } = await service.setupMfa(user.id);
    expect(otpauthUrl).toContain('otpauth://totp/');

    await expect(
      service.enableMfa(user.id, '000000'),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    const code = await generateTotpCode({ secret });
    const enabled = await service.enableMfa(user.id, code);
    expect(enabled.mfaEnabled).toBe(true);

    // Subsequent logins now require the TOTP challenge.
    const next = asChallenge(
      await service.login({ email, password: 'clinician-pass-1' }),
    );
    expect(next.mfaRequired).toBe(true);

    const code2 = await generateTotpCode({ secret });
    const session = await service.verifyMfaChallenge(next.mfaToken, code2);
    expect(session.user.email).toBe(email);
    expect(session.token).toBeTruthy();

    await expect(
      service.verifyMfaChallenge(next.mfaToken, '000000'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    // A full session token is not a valid MFA challenge token.
    await expect(
      service.verifyMfaChallenge(session.token, code2),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('keeps MFA optional for parents (normal session, opt-in enrolment allowed)', async () => {
    const email = uniqueEmail();
    const { user } = await service.register({
      name: 'Opt-in Parent',
      email,
      phone: '+27000000007',
      password: 'parent-pass-123',
      role: UserRole.PARENT,
    });
    await markVerified(email);

    const ok = asSession(
      await service.login({ email, password: 'parent-pass-123' }),
    );
    expect(ok.user.role).toBe(UserRole.PARENT);

    const { secret } = await service.setupMfa(user.id);
    const code = await generateTotpCode({ secret });
    await service.enableMfa(user.id, code);

    const challenge = asChallenge(
      await service.login({ email, password: 'parent-pass-123' }),
    );
    expect(challenge.mfaRequired).toBe(true);
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
