import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessagesService } from './messages.service';
import {
  Conversation,
  ConversationParticipant,
  Message,
} from './messages.model';
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
  Conversation,
  ConversationParticipant,
  Message,
  BlogPost,
  SystemLog,
];

const EMAIL_DOMAIN = 'messages-m1-test.local';
const uniqueEmail = () =>
  `user-${Date.now()}-${Math.floor(Math.random() * 1e6)}@${EMAIL_DOMAIN}`;

describe('MessagesService (integration)', () => {
  let moduleRef: TestingModule;
  let service: MessagesService;
  let users: Repository<User>;
  let conversations: Repository<Conversation>;

  let parent: User;
  let clinician: User;
  let stranger: User;
  let conversationId: string;
  const createdConversationIds: string[] = [];

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
        TypeOrmModule.forFeature([
          Conversation,
          ConversationParticipant,
          Message,
          User,
        ]),
      ],
      providers: [MessagesService],
    }).compile();

    service = moduleRef.get(MessagesService);
    users = moduleRef.get<Repository<User>>(getRepositoryToken(User));
    conversations = moduleRef.get<Repository<Conversation>>(
      getRepositoryToken(Conversation),
    );

    const makeUser = (name: string, role: UserRole) =>
      users.save(
        users.create({
          name,
          email: uniqueEmail(),
          phone: '+27000000000',
          role,
        }),
      );

    parent = await makeUser('Test Parent', UserRole.PARENT);
    clinician = await makeUser('Dr Test Clinician', UserRole.CLINICIAN);
    stranger = await makeUser('Nosy Stranger', UserRole.PARENT);

    const created = await service.createConversation(parent.id, [clinician.id]);
    conversationId = created.id;
    createdConversationIds.push(created.id);
  });

  afterAll(async () => {
    // Deleting the conversation cascades to participants and messages (FKs).
    if (conversations && createdConversationIds.length) {
      await conversations.delete(createdConversationIds);
    }
    if (users) {
      await users
        .createQueryBuilder()
        .delete()
        .where('email LIKE :pattern', { pattern: `%@${EMAIL_DOMAIN}` })
        .execute();
    }
    await moduleRef?.close();
  });

  it('creates a conversation the caller participates in, seen with zero unread', async () => {
    const list = await service.listConversations(parent.id);
    expect(list).toHaveLength(1);
    expect(list[0].id).toBe(conversationId);
    expect(list[0].participantIds).toEqual(
      expect.arrayContaining([parent.id, clinician.id]),
    );
    // Caller-relative: the "other" participant is the clinician.
    expect(list[0].participantName).toBe('Dr Test Clinician');
    expect(list[0].participantRole).toBe('clinician');
    expect(list[0].unreadCount).toBe(0);
  });

  it('stamps the sender from the caller, never from the request', async () => {
    const msg = await service.sendMessage(
      clinician.id,
      conversationId,
      'Hi — reviewed the growth entry, all on track.',
    );
    expect(msg.senderId).toBe(clinician.id);
    expect(msg.conversationId).toBe(conversationId);
    expect(msg.body).toBe('Hi — reviewed the growth entry, all on track.');
  });

  it('counts a message from the other participant as unread', async () => {
    const list = await service.listConversations(parent.id);
    expect(list[0].unreadCount).toBe(1);
  });

  it('marks the thread read when the participant opens it', async () => {
    const msgs = await service.getMessages(parent.id, conversationId);
    expect(msgs.map((m) => m.body)).toContain(
      'Hi — reviewed the growth entry, all on track.',
    );

    const after = await service.listConversations(parent.id);
    expect(after[0].unreadCount).toBe(0);
  });

  it('blocks a non-participant from reading a conversation', async () => {
    await expect(
      service.getMessages(stranger.id, conversationId),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('blocks a non-participant from sending into a conversation', async () => {
    await expect(
      service.sendMessage(stranger.id, conversationId, 'let me in'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('returns no conversations for a user who participates in none', async () => {
    await expect(service.listConversations(stranger.id)).resolves.toEqual([]);
  });

  it('rejects a malformed (non-UUID) conversation id with 404, not a DB error', async () => {
    await expect(
      service.getMessages(parent.id, 'not-a-uuid'),
    ).rejects.toBeInstanceOf(NotFoundException);
    await expect(
      service.sendMessage(parent.id, 'not-a-uuid', 'hi'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
