import { UserRole } from "@/lib/constants";
import { ResourceStatus } from '../types/enums';

// Dummy data for clinicians needing verification
export const cliniciansToVerify = [
  { 
    id: 'c1', 
    title: 'Dr.', 
    name: 'Evelyn Reed', 
    specialty: 'Pediatric Neurology', 
    createdAt: '2024-07-28T10:00:00Z', 
    updatedAt: '2024-07-28T10:00:00Z', 
    status: ResourceStatus.PENDING_ASSESSMENT,
    imageUrl: '', 
    role: UserRole.CLINICIAN
  },
  { 
    id: 'c2', 
    title: 'Mr.', 
    name: 'Samuel Green', 
    specialty: 'Child Psychology', 
    createdAt: '2024-07-25T10:00:00Z', 
    updatedAt: '2024-07-25T10:00:00Z', 
    status: ResourceStatus.PENDING_ASSESSMENT, 
    imageUrl: '', 
    role: UserRole.CLINICIAN
  }, 
  { 
    id: 'c3', 
    title: 'Ms.', 
    name: 'Aisha Khan', 
    specialty: 'Occupational Therapy', 
    createdAt: '2024-07-22T10:00:00Z', 
    updatedAt: '2024-07-22T10:00:00Z', 
    status: ResourceStatus.PENDING_ASSESSMENT, 
    imageUrl: '', 
    role: UserRole.CLINICIAN
  },
];

// Dummy data for records needing verification or flagged
export const recordsToVerify = [
  { 
    id: 'r1', 
    childName: 'Alex Doe', 
    recordType: 'Growth', 
    issue: 'Unusual height change', 
    createdAt: '2024-07-29T10:00:00Z', 
    updatedAt: '2024-07-29T10:00:00Z', 
    flaggedBy: 'System', 
    status: ResourceStatus.PENDING_ASSESSMENT
  },
  { 
    id: 'r2', 
    childName: 'Mia Doe', 
    recordType: 'Milestone', 
    issue: 'Delayed speech milestone reported by parent', 
    createdAt: '2024-07-28T10:00:00Z', 
    updatedAt: '2024-07-28T10:00:00Z', 
    flaggedBy: 'Dr. Smith', 
    status: ResourceStatus.PENDING_ASSESSMENT
  },
];
