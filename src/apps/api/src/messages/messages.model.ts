import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
  Unique,
} from 'typeorm';
import { User } from '../users/users.model';

@Entity('conversations')
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Denormalised for cheap ordering of the conversation list. timestamptz so
  // the absolute instant round-trips correctly (unread comparison + ISO output)
  // regardless of DB/session time zone.
  @Column({ type: 'timestamptz' })
  lastMessageAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('conversation_participants')
@Unique('UQ_conversation_participant', ['conversation', 'user'])
export class ConversationParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Conversation, { onDelete: 'CASCADE' })
  conversation: Conversation;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  // Per-participant read cursor: messages sent after this instant (by another
  // participant) count as unread. Null means the participant has never opened it.
  // timestamptz so it compares correctly against message.sentAt.
  @Column({ type: 'timestamptz', nullable: true })
  lastReadAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @ManyToOne(() => Conversation, { onDelete: 'CASCADE' })
  conversation: Conversation;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  sender: User;

  // Special personal information (care-team message may reference a child's
  // health). Field-level encryption via GCP KMS is deferred to Phase 5.3 —
  // stored plaintext for now; do NOT treat this column as encrypted.
  @Column({ type: 'text' })
  body: string;

  @CreateDateColumn({ type: 'timestamptz' })
  sentAt: Date;
}
