import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { User } from './users.model';
import { Practice } from '../practices/practices.model';

@Entity('clinician_profiles')
export class ClinicianProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column({ type: 'varchar', length: 255 })
  specialty: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  // HPCSA (doctors) / SANC (nurses) registration numbers. Sensitive per POPIA —
  // redacted in logs (see common/logging/redact-paths.ts) and flagged for
  // field-level KMS encryption in Phase 5.3 before production.
  @Column({ type: 'varchar', length: 50, nullable: true })
  hpcsaNumber?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  sancNumber?: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending',
  })
  verificationStatus: 'pending' | 'verified' | 'rejected';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Practice, (practice) => practice.clinicians)
  practices: Practice[];
}
