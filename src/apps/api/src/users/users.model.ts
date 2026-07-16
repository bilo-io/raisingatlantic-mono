import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { UserRole, AuthProvider } from './constants';
import { ClinicianProfile } from './clinician-profile.model';
// Note: ClinicianProfile and Child will be imported once created or we use strings for relations initially if preferred
// But following example.model.ts exactly:

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title?: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 50 })
  phone: string;

  @Column({ type: 'text', nullable: true })
  imageUrl?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PARENT,
  })
  role: UserRole;

  // Bcrypt hash for email/password auth. `select: false` keeps it out of every
  // default query so it can never leak through user-facing endpoints; auth
  // lookups opt in explicitly via addSelect. Null for SSO-only accounts.
  @Column({ type: 'varchar', length: 255, nullable: true, select: false })
  passwordHash?: string;

  // Google account subject id ("sub") for SSO; null for email accounts.
  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  googleId?: string;

  @Column({ type: 'enum', enum: AuthProvider, default: AuthProvider.EMAIL })
  authProvider: AuthProvider;

  @Column({ type: 'boolean', default: false })
  emailVerified: boolean;

  // Single-use flow tokens (email verification / password reset) are stored as
  // sha256 hashes — the raw token only ever exists in the email link.
  @Column({ type: 'varchar', length: 64, nullable: true, select: false })
  emailVerificationTokenHash?: string | null;

  @Column({ type: 'timestamp', nullable: true, select: false })
  emailVerificationTokenExpiresAt?: Date | null;

  @Column({ type: 'varchar', length: 64, nullable: true, select: false })
  passwordResetTokenHash?: string | null;

  @Column({ type: 'timestamp', nullable: true, select: false })
  passwordResetTokenExpiresAt?: Date | null;

  // TOTP shared secret (base32). Sensitive: select:false, in the log-redaction
  // list, and slated for Phase 5.3 KMS field-level encryption (DEV.md §5.3).
  @Column({ type: 'varchar', length: 64, nullable: true, select: false })
  mfaSecret?: string | null;

  @Column({ type: 'boolean', default: false })
  mfaEnabled: boolean;

  // POPIA right-to-erasure (§4.2): set when the data subject requests deletion.
  // The account is soft-deleted immediately; a scheduled job hard-deletes after
  // the 30-day grace period (deletionRequestedAt + 30d). Null = active account.
  @Column({ type: 'timestamp', nullable: true })
  deletionRequestedAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => ClinicianProfile, (profile) => profile.user, {
    nullable: true,
  })
  clinicianProfile?: ClinicianProfile;
}
