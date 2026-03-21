
import { UserRole } from '@/lib/constants';

export interface User {
  id: string;
  title?: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  role: UserRole;
  joinedDate: string;
  aiHint: string;
}

export const dummyUsers: User[] = [
  {
    id: "parent-jane-doe",
    name: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "(021) 123-4567",
    avatarUrl: "",
    role: UserRole.PARENT,
    joinedDate: "2023-05-15",
    aiHint: "professional woman"
  },
  {
    id: "parent-mila-dasilva",
    name: "Mila Da Silva",
    email: "mila.dasilva@example.com",
    phone: "(021) 123-8899",
    avatarUrl: "",
    role: UserRole.PARENT,
    joinedDate: "2024-01-10",
    aiHint: "woman smiling"
  },
  {
    id: "parent-chloe-roux",
    name: "Chloé Roux",
    email: "chloe.roux@example.com",
    phone: "(021) 246-8135",
    avatarUrl: "",
    role: UserRole.PARENT,
    joinedDate: "2023-09-01",
    aiHint: "woman stylish"
  },
  {
    id: "clinician-dr-smith",
    title: "Dr.",
    name: "John Smith",
    email: "dr.smith@clinician.com",
    phone: "(021) 987-6543",
    avatarUrl: "",
    role: UserRole.CLINICIAN,
    joinedDate: "2022-11-20",
    aiHint: "doctor smiling"
  },
  {
    id: "clinician-alice-williams",
    title: "Dr.",
    name: "Alice Williams",
    email: "dr.williams@clinician.com",
    phone: "(021) 111-2222",
    avatarUrl: "",
    role: UserRole.CLINICIAN,
    joinedDate: "2023-08-10",
    aiHint: "female doctor professional"
  },
  {
    id: "clinician-olivia-chen",
    title: "Dr.",
    name: "Olivia Chen",
    email: "dr.chen@clinician.com",
    phone: "(021) 333-4444",
    avatarUrl: "",
    role: UserRole.CLINICIAN,
    joinedDate: "2023-10-01",
    aiHint: "friendly female doctor"
  },
  {
    id: "admin-user",
    name: "Admin User",
    email: "admin@raisingatlantic.com",
    phone: "(021) 555-5555",
    avatarUrl: "",
    role: UserRole.ADMIN,
    joinedDate: "2021-01-01",
    aiHint: "person business suit"
  },
  {
    id: "super-admin-user",
    name: "Super Admin",
    email: "super@raisingatlantic.com",
    phone: "(021) 000-0000",
    avatarUrl: "",
    role: UserRole.SUPER_ADMIN,
    joinedDate: "2020-01-01",
    aiHint: "ceo portrait"
  }
];

export const DUMMY_DEFAULT_USER_ID = "parent-jane-doe";
