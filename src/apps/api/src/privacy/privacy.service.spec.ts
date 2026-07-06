import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrivacyService, ERASURE_GRACE_DAYS } from './privacy.service';
import { SystemLogsModule } from '../system-logs/system-logs.module';
import { User } from '../users/users.model';
import { UserRole } from '../users/constants';
import { Child } from '../children/children.model';
import { ResourceStatus } from '../common/enums';
import { ClinicianProfile } from '../users/clinician-profile.model';
import { Tenant } from '../tenants/tenants.model';
import { Practice } from '../practices/practices.model';
import {
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

// Integration test against a REAL local Postgres per CLAUDE.md — DB never mocked.
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

const EMAIL_DOMAIN = 'phase4-privacy-test.local';
const uniqueEmail = () => `user-${Date.now()}-${Math.floor(Math.random() * 1e6)}@${EMAIL_DOMAIN}`;

describe('PrivacyService (integration)', () => {
  let moduleRef: TestingModule;
  let service: PrivacyService;
  let users: Repository<User>;
  let children: Repository<Child>;

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
        TypeOrmModule.forFeature([User, Child, Appointment, Report]),
        SystemLogsModule,
        JwtModule.register({
          global: true,
          secret: 'test-secret',
          signOptions: { expiresIn: '15m' },
        }),
      ],
      providers: [PrivacyService],
    }).compile();

    service = moduleRef.get(PrivacyService);
    users = moduleRef.get<Repository<User>>(getRepositoryToken(User));
    children = moduleRef.get<Repository<Child>>(getRepositoryToken(Child));
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

  const makeParentWithChild = async () => {
    const parent = await users.save(
      users.create({
        name: 'Data Subject',
        email: uniqueEmail(),
        phone: '+27000000000',
        role: UserRole.PARENT,
      }),
    );
    const child = await children.save(
      children.create({
        name: 'Kid One',
        firstName: 'Kid',
        lastName: 'One',
        gender: 'female',
        dateOfBirth: new Date('2020-01-01'),
        parent,
      }),
    );
    return { parent, child };
  };

  it('exports the subject profile + their children and omits passwordHash', async () => {
    const { parent, child } = await makeParentWithChild();

    const dump = await service.exportUserData(parent.id);

    expect(dump.format).toBe('json');
    expect(dump.dataSubject.id).toBe(parent.id);
    expect((dump.dataSubject as Record<string, unknown>).passwordHash).toBeUndefined();
    expect(dump.children).toHaveLength(1);
    expect(dump.children[0].id).toBe(child.id);
    expect(dump.children[0]).toHaveProperty('growthRecords');
    expect(dump.children[0]).toHaveProperty('appointments');
    expect(dump.children[0]).toHaveProperty('reports');
  });

  it('scopes the export to the caller — never another subject\'s children', async () => {
    const a = await makeParentWithChild();
    await makeParentWithChild(); // a second, unrelated subject

    const dump = await service.exportUserData(a.parent.id);
    expect(dump.children).toHaveLength(1);
    expect(dump.children[0].id).toBe(a.child.id);
  });

  it('throws NotFound for an unknown subject', async () => {
    await expect(
      service.exportUserData('00000000-0000-0000-0000-000000000000'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('renders a PDF export whose bytes start with %PDF', async () => {
    const { parent } = await makeParentWithChild();
    const pdf = await service.exportUserDataPdf(parent.id);
    expect(Buffer.isBuffer(pdf)).toBe(true);
    expect(pdf.length).toBeGreaterThan(100);
    expect(pdf.subarray(0, 5).toString('latin1')).toBe('%PDF-');
  });

  it('erasure soft-deletes: sets deletionRequestedAt + archives children + schedules +30d', async () => {
    const { parent, child } = await makeParentWithChild();
    const now = new Date('2026-07-01T00:00:00.000Z');

    const result = await service.requestErasure(parent.id, now);

    expect(result.deletionRequestedAt).toBe(now.toISOString());
    const expectedHardDelete = new Date(
      now.getTime() + ERASURE_GRACE_DAYS * 24 * 60 * 60 * 1000,
    ).toISOString();
    expect(result.scheduledHardDeleteAt).toBe(expectedHardDelete);

    const reloadedUser = await users.findOne({ where: { id: parent.id } });
    expect(reloadedUser?.deletionRequestedAt).toBeTruthy();

    const reloadedChild = await children.findOne({ where: { id: child.id } });
    expect(reloadedChild?.status).toBe(ResourceStatus.ARCHIVED);
  });
});
