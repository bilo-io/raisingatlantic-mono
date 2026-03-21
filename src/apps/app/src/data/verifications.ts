import { UserRole } from "@/lib/constants";

// Dummy data for clinicians needing verification
export const cliniciansToVerify = [
  { id: 'c1', title: 'Dr.', name: 'Evelyn Reed', specialty: 'Pediatric Neurology', submissionDate: '2024-07-28', status: 'Pending Review', avatar: '', aiHint: 'doctor serious', role: UserRole.CLINICIAN },
  { id: 'c2', title: 'Mr.', name: 'Samuel Green', specialty: 'Child Psychology', submissionDate: '2024-07-25', status: 'Pending Review', avatar: '', aiHint: 'therapist friendly', role: UserRole.CLINICIAN },
  { id: 'c3', title: 'Ms.', name: 'Aisha Khan', specialty: 'Occupational Therapy', submissionDate: '2024-07-22', status: 'More Info Required', avatar: '', aiHint: 'professional woman', role: UserRole.CLINICIAN },
];

// Dummy data for records needing verification or flagged
export const recordsToVerify = [
  { id: 'r1', childName: 'Alex Doe', recordType: 'Growth', issue: 'Unusual height change', dateFlagged: '2024-07-29', flaggedBy: 'System', status: 'Needs Review' },
  { id: 'r2', childName: 'Mia Doe', recordType: 'Milestone', issue: 'Delayed speech milestone reported by parent', dateFlagged: '2024-07-28', flaggedBy: 'Dr. Smith', status: 'Needs Review' },
  { id: 'r3', childName: 'Noah Doe', recordType: 'Vaccination', issue: 'Missing DTaP Series Entry', dateFlagged: '2024-07-27', flaggedBy: 'System Audit', status: 'Info Requested' },
];
