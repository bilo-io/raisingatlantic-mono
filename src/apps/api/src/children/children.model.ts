import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../users/users.model';
import { ResourceStatus } from '../common/enums';

@Entity('children')
export class Child {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  parent: User;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  clinician?: User;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  firstName: string;

  @Column({ type: 'varchar', length: 255 })
  lastName: string;

  @Column({ type: 'enum', enum: ['male', 'female'] })
  gender: 'male' | 'female';

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Column({ type: 'text', nullable: true })
  imageUrl?: string;

  @Column({
    type: 'enum',
    enum: ResourceStatus,
    default: ResourceStatus.ACTIVE,
  })
  status: ResourceStatus;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'int', default: 0 })
  progress: number;

  @OneToMany(() => GrowthRecord, (record) => record.child)
  growthRecords: GrowthRecord[];

  @OneToMany(() => CompletedMilestone, (m) => m.child)
  completedMilestones: CompletedMilestone[];

  @OneToMany(() => CompletedVaccination, (v) => v.child)
  completedVaccinations: CompletedVaccination[];

  @OneToMany(() => Allergy, (a) => a.child)
  allergies: Allergy[];

  @OneToMany(() => MedicalCondition, (c) => c.child)
  medicalConditions: MedicalCondition[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('growth_records')
export class GrowthRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Child, (child) => child.growthRecords, { onDelete: 'CASCADE' })
  child: Child;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  height?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  weight?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  headCircumference?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({
    type: 'enum',
    enum: ResourceStatus,
    default: ResourceStatus.ACTIVE,
  })
  status: ResourceStatus;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  recordedBy?: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('completed_milestones')
export class CompletedMilestone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Child, (child) => child.completedMilestones, { onDelete: 'CASCADE' })
  child: Child;

  @Column({ type: 'varchar', length: 255 })
  milestoneId: string;

  @Column({ type: 'date' })
  dateAchieved: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({
    type: 'enum',
    enum: ResourceStatus,
    default: ResourceStatus.ACTIVE,
  })
  status: ResourceStatus;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  recordedBy?: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('completed_vaccinations')
export class CompletedVaccination {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Child, (child) => child.completedVaccinations, { onDelete: 'CASCADE' })
  child: Child;

  @Column({ type: 'varchar', length: 255 })
  vaccineId: string;

  @Column({ type: 'date' })
  dateAdministered: Date;

  @Column({
    type: 'enum',
    enum: ResourceStatus,
    default: ResourceStatus.ACTIVE,
  })
  status: ResourceStatus;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  recordedBy?: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}


@Entity('allergies')
export class Allergy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Child, (child) => child.allergies, { onDelete: 'CASCADE' })
  child: Child;

  @Column({ type: 'varchar', length: 255 })
  allergen: string;

  @Column({ type: 'enum', enum: ['mild', 'moderate', 'severe'], default: 'mild' })
  severity: 'mild' | 'moderate' | 'severe';

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({
    type: 'enum',
    enum: ResourceStatus,
    default: ResourceStatus.ACTIVE,
  })
  status: ResourceStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('medical_conditions')
export class MedicalCondition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Child, (child) => child.medicalConditions, { onDelete: 'CASCADE' })
  child: Child;

  @Column({ type: 'varchar', length: 255 })
  conditionName: string;

  @Column({ type: 'date', nullable: true })
  diagnosisDate?: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({
    type: 'enum',
    enum: ResourceStatus,
    default: ResourceStatus.ACTIVE,
  })
  status: ResourceStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

