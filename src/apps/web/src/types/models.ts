import { ResourceStatus } from './enums';
import { UserRole } from '@/lib/constants';

export interface BaseEntity {
  id: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Patient extends BaseEntity {
  name: string;
  dateOfBirth: string | Date;
  imageUrl?: string;
  status: ResourceStatus;
  primaryConcern?: string;
}

export interface GrowthRecord {
  date: string | Date;
  notes: string;
  data: {
    height?: string;
    weight?: string;
    headCircumference?: string;
  };
}

export interface ChildDetail extends BaseEntity {
  parentId: string;
  name: string;
  firstName: string;
  lastName: string;
  gender: 'male' | 'female';
  dateOfBirth: string | Date;
  imageUrl?: string;
  status: ResourceStatus;
  clinicianId?: string;
  notes: string;
  progress: number;
  growthRecords: GrowthRecord[];
  completedMilestones: { milestoneId: string; dateAchieved: string; notes?: string }[];
  completedVaccinations: { vaccineId: string; dateAdministered: string }[];
}

export interface User extends BaseEntity {
  title?: string;
  name: string;
  email: string;
  phone: string;
  imageUrl?: string;
  role: UserRole;
}

// Any other specific entities (like Clinician, Practice, Tenant) can be added here
