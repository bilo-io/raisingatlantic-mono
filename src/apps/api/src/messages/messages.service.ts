import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
  Conversation,
  ConversationParticipant,
  Message,
} from './messages.model';
import { User } from '../users/users.model';
import { isUUID } from '../common/utils/id-validator';

// Caller-relative projection of a conversation (see messages.model.ts). Mirrors
// the shared `Conversation` type in @raising-atlantic/types, mapped here at the
// controller boundary per CLAUDE.md.
export interface ConversationView {
  id: string;
  participantIds: string[];
  participantName: string;
  participantRole: 'parent' | 'clinician' | 'admin';
  lastMessageAt: string;
  unreadCount: number;
}

export interface MessageView {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  sentAt: string;
}

function mapParticipantRole(role?: string): 'parent' | 'clinician' | 'admin' {
  if (role === 'clinician') return 'clinician';
  if (role === 'parent') return 'parent';
  // admin, super_admin, or unknown — the UI renders anything non-clinician as
  // "Practice", so collapsing to admin is safe.
  return 'admin';
}

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversations: Repository<Conversation>,
    @InjectRepository(ConversationParticipant)
    private readonly participants: Repository<ConversationParticipant>,
    @InjectRepository(Message)
    private readonly messages: Repository<Message>,
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  async listConversations(userId: string): Promise<ConversationView[]> {
    const myMemberships = await this.participants.find({
      where: { user: { id: userId } },
      relations: ['conversation'],
    });

    const views = await Promise.all(
      myMemberships.map((membership) => this.buildView(userId, membership)),
    );
    views.sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt));
    return views;
  }

  async getMessages(
    userId: string,
    conversationId: string,
  ): Promise<MessageView[]> {
    const membership = await this.requireMembership(userId, conversationId);

    const rows = await this.messages.find({
      where: { conversation: { id: conversationId } },
      relations: ['sender', 'conversation'],
      order: { sentAt: 'ASC' },
    });

    // Opening the thread marks it read up to now.
    membership.lastReadAt = new Date();
    await this.participants.save(membership);

    return rows.map((m) => this.toMessageView(m));
  }

  async sendMessage(
    userId: string,
    conversationId: string,
    body: string,
  ): Promise<MessageView> {
    await this.requireMembership(userId, conversationId);

    // Sender identity always comes from the authenticated caller — never trust
    // a client-supplied sender id.
    const sender = await this.users.findOne({ where: { id: userId } });
    if (!sender) throw new NotFoundException('User not found');

    const conversation = await this.conversations.findOne({
      where: { id: conversationId },
    });
    if (!conversation) throw new NotFoundException('Conversation not found');

    const saved = await this.messages.save(
      this.messages.create({ conversation, sender, body }),
    );

    conversation.lastMessageAt = saved.sentAt;
    await this.conversations.save(conversation);

    return {
      id: saved.id,
      conversationId,
      senderId: userId,
      body: saved.body,
      sentAt: saved.sentAt.toISOString(),
    };
  }

  async createConversation(
    userId: string,
    participantIds: string[],
  ): Promise<ConversationView> {
    const ids = Array.from(new Set([userId, ...participantIds]));
    // Guard non-UUID ids before they hit a uuid column (Postgres would 500).
    if (ids.some((id) => !isUUID(id))) {
      throw new NotFoundException('One or more participants not found');
    }
    const users = await this.users.find({ where: { id: In(ids) } });
    if (users.length !== ids.length) {
      throw new NotFoundException('One or more participants not found');
    }

    const now = new Date();
    // Conversation + participant rows are written atomically so a partial
    // failure can never leave an orphan conversation with no participants.
    const conversation = await this.conversations.manager.transaction(
      async (em) => {
        const conv = await em.save(
          em.create(Conversation, { lastMessageAt: now }),
        );
        await em.save(
          users.map((user) =>
            em.create(ConversationParticipant, {
              conversation: conv,
              user,
              // The creator has implicitly "read" the empty thread.
              lastReadAt: user.id === userId ? now : null,
            }),
          ),
        );
        return conv;
      },
    );

    const membership = await this.requireMembership(userId, conversation.id);
    return this.buildView(userId, membership);
  }

  private async requireMembership(
    userId: string,
    conversationId: string,
  ): Promise<ConversationParticipant> {
    // Guard non-UUID ids before they hit a uuid column (Postgres would 500).
    if (!isUUID(conversationId)) {
      throw new NotFoundException('Conversation not found');
    }
    const membership = await this.participants.findOne({
      where: { conversation: { id: conversationId }, user: { id: userId } },
      relations: ['conversation', 'user'],
    });
    // 404 (not 403) so a non-participant cannot even confirm a conversation exists.
    if (!membership) throw new NotFoundException('Conversation not found');
    return membership;
  }

  private async buildView(
    userId: string,
    myMembership: ConversationParticipant,
  ): Promise<ConversationView> {
    const conversationId = myMembership.conversation.id;

    const allMemberships = await this.participants.find({
      where: { conversation: { id: conversationId } },
      relations: ['user'],
    });
    const other = allMemberships.find((p) => p.user.id !== userId)?.user;

    const unreadQb = this.messages
      .createQueryBuilder('m')
      .where('m."conversationId" = :cid', { cid: conversationId })
      .andWhere('m."senderId" != :uid', { uid: userId });
    if (myMembership.lastReadAt) {
      unreadQb.andWhere('m.sentAt > :lastReadAt', {
        lastReadAt: myMembership.lastReadAt,
      });
    }
    const unreadCount = await unreadQb.getCount();

    return {
      id: conversationId,
      participantIds: allMemberships.map((p) => p.user.id),
      participantName: other?.name ?? 'Unknown',
      participantRole: mapParticipantRole(other?.role),
      lastMessageAt: myMembership.conversation.lastMessageAt.toISOString(),
      unreadCount,
    };
  }

  private toMessageView(message: Message): MessageView {
    return {
      id: message.id,
      conversationId: message.conversation.id,
      senderId: message.sender.id,
      body: message.body,
      sentAt: message.sentAt.toISOString(),
    };
  }
}
