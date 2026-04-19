import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Child } from '../children/children.model';
import { User } from '../users/users.model';
import { ResourceStatus } from '../common/enums';

export enum ReportType {
  CRECHE_ADMISSION = 'CRECHE_ADMISSION',
  PROGRESS_REPORT = 'PROGRESS_REPORT',
  CLINICAL_SUMMARY = 'CLINICAL_SUMMARY',
}

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Child, { onDelete: 'CASCADE' })
  child: Child;

  @Column({ type: 'enum', enum: ReportType })
  type: ReportType;

  @Column({
    type: 'enum',
    enum: ResourceStatus,
    default: ResourceStatus.ACTIVE,
  })
  status: ResourceStatus;

  @Column({ type: 'jsonb', nullable: true })
  content: any;

  @Column({ type: 'text', nullable: true })
  pdfUrl?: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  generatedBy?: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
