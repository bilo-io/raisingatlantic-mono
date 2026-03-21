
import { UserRole } from "@/lib/constants";

export type Clinician = {
  id: string;
  title?: string;
  name: string;
  specialty: string;
  avatarUrl: string;
  bio: string;
  aiHint: string;
  practiceIds: string[]; // List of practice IDs
  email: string;
  phone: string;
  role: UserRole;
};

export const dummyClinicians: Clinician[] = [
  {
    id: 'clinician-dr-smith',
    title: 'Dr.',
    name: 'John Smith',
    specialty: 'Pediatrician',
    avatarUrl: '',
    bio: 'A dedicated pediatrician with over 15 years of experience in general child health and development.',
    aiHint: 'doctor smiling',
    practiceIds: ['1', '3'], // Atlantic Child Development & Table Mountain Childrens Clinic
    email: 'dr.smith@example.com',
    phone: '(021) 439-1234',
    role: UserRole.CLINICIAN
  },
  {
    id: 'clinician-alice-williams',
    title: 'Dr.',
    name: 'Alice Williams',
    specialty: 'Pediatric Nutritionist',
    avatarUrl: '',
    bio: 'Specializing in pediatric nutrition and dietary planning for all ages, from infants to adolescents.',
    aiHint: 'female doctor professional',
    practiceIds: ['1', '4'],
    email: 'dr.williams@example.com',
    phone: '(021) 439-1235',
    role: UserRole.CLINICIAN
  },
  {
    id: 'clinician-emily-carter',
    title: 'Dr.',
    name: 'Emily Carter',
    specialty: 'Pediatric Therapist',
    avatarUrl: '',
    bio: 'Specializes in early childhood behavioral therapy and developmental milestones.',
    aiHint: 'friendly woman therapist',
    practiceIds: ['1', '4'], // Atlantic Child Development & Southern Suburbs Kids Care
    email: 'emily.carter@example.com',
    phone: '(021) 671-2345',
    role: UserRole.CLINICIAN
  },
  {
    id: 'clinician-olivia-chen',
    title: 'Dr.',
    name: 'Olivia Chen',
    specialty: 'General Pediatrician',
    avatarUrl: '',
    bio: 'Dr. Chen provides comprehensive pediatric care with a focus on preventative medicine and family education.',
    aiHint: 'friendly female doctor',
    practiceIds: ['2'],
    email: 'dr.chen@example.com',
    phone: '(021) 480-5679',
    role: UserRole.CLINICIAN
  },
  {
    id: 'clinician-evelyn-reed',
    title: 'Dr.',
    name: 'Evelyn Reed',
    specialty: 'Pediatric Neurology',
    avatarUrl: '',
    bio: 'Focuses on neurological disorders in children, providing expert diagnosis and care.',
    aiHint: 'doctor serious',
    practiceIds: ['2'], // Barnard Pediatric Specialists
    email: 'e.reed@example.com',
    phone: '(021) 480-5678',
    role: UserRole.CLINICIAN
  },
  {
    id: 'clinician-samuel-green',
    title: 'Mr.',
    name: 'Samuel Green',
    specialty: 'Child Psychology',
    avatarUrl: '',
    bio: 'A compassionate psychologist helping children and families navigate emotional and psychological challenges.',
    aiHint: 'therapist friendly',
    practiceIds: ['4'], // Southern Suburbs Kids Care
    email: 'sam.green@example.com',
    phone: '(021) 671-2346',
    role: UserRole.CLINICIAN
  },
  {
    id: 'clinician-aisha-khan',
    title: 'Ms.',
    name: 'Aisha Khan',
    specialty: 'Occupational Therapy',
    avatarUrl: '',
    bio: 'Helps children develop the skills needed for daily living through targeted occupational therapy.',
    aiHint: 'professional woman',
    practiceIds: ['5'], // Cape Flats Child Wellness
    email: 'a.khan@example.com',
    phone: '(021) 391-8765',
    role: UserRole.CLINICIAN
  },
  {
    id: 'clinician-ben-peters',
    title: 'Dr.',
    name: 'Ben Peters',
    specialty: 'General Practitioner',
    avatarUrl: '',
    bio: 'Provides primary care for children of all ages, with a focus on preventative health.',
    aiHint: 'male doctor portrait',
    practiceIds: ['7', '8'], // Blouberg Coastal Kids & Helderberg Child Health
    email: 'ben.peters@example.com',
    phone: '(021) 554-6789',
    role: UserRole.CLINICIAN
  },
  {
    id: 'clinician-linda-khumalo',
    title: 'Dr.',
    name: 'Linda Khumalo',
    specialty: 'Developmental Pediatrician',
    avatarUrl: '',
    bio: 'Expert in developmental and behavioral problems in children, working closely with families and schools.',
    aiHint: 'smiling black woman doctor',
    practiceIds: ['3'], // Table Mountain Childrens Clinic
    email: 'l.khumalo@example.com',
    phone: '(021) 461-9876',
    role: UserRole.CLINICIAN
  }
];
