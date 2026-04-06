import { UserRole } from "@/lib/constants";
import { User, BaseEntity } from "../types/models";

export interface Clinician extends User {
  specialty: string;
  bio: string;
  practiceIds: string[]; // List of practice IDs
}

export const dummyClinicians: Clinician[] = [
  {
    id: 'clinician-dr-smith',
    title: 'Dr.',
    name: 'John Smith',
    email: 'dr.smith@example.com',
    phone: '(021) 439-1234',
    imageUrl: '',
    role: UserRole.CLINICIAN,
    specialty: 'Pediatrician',
    bio: 'A dedicated pediatrician with over 15 years of experience in general child health and development.',
    practiceIds: ['1', '3'],
    createdAt: '2022-11-20T00:00:00Z',
    updatedAt: '2022-11-20T00:00:00Z'
  },
  {
    id: 'clinician-alice-williams',
    title: 'Dr.',
    name: 'Alice Williams',
    email: 'dr.williams@example.com',
    phone: '(021) 439-1235',
    imageUrl: '',
    role: UserRole.CLINICIAN,
    specialty: 'Pediatric Nutritionist',
    bio: 'Specializing in pediatric nutrition and dietary planning for all ages, from infants to adolescents.',
    practiceIds: ['1', '4'],
    createdAt: '2023-08-10T00:00:00Z',
    updatedAt: '2023-08-10T00:00:00Z'
  },
  {
    id: 'clinician-emily-carter',
    title: 'Dr.',
    name: 'Emily Carter',
    email: 'emily.carter@example.com',
    phone: '(021) 671-2345',
    imageUrl: '',
    role: UserRole.CLINICIAN,
    specialty: 'Pediatric Therapist',
    bio: 'Specializes in early childhood behavioral therapy and developmental milestones.',
    practiceIds: ['1', '4'],
    createdAt: '2023-02-22T00:00:00Z',
    updatedAt: '2023-02-22T00:00:00Z'
  },
  {
    id: 'clinician-olivia-chen',
    title: 'Dr.',
    name: 'Olivia Chen',
    email: 'dr.chen@example.com',
    phone: '(021) 480-5679',
    imageUrl: '',
    role: UserRole.CLINICIAN,
    specialty: 'General Pediatrician',
    bio: 'Dr. Chen provides comprehensive pediatric care with a focus on preventative medicine and family education.',
    practiceIds: ['2'],
    createdAt: '2023-10-01T00:00:00Z',
    updatedAt: '2023-10-01T00:00:00Z'
  },
];
