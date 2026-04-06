import { UserRole } from '@/lib/constants';
import { User } from '../types/models';

export const dummyUsers: User[] = [
  {
    id: "parent-jane-doe",
    name: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "(021) 123-4567",
    imageUrl: "",
    role: UserRole.PARENT,
    createdAt: "2023-05-15T00:00:00Z",
    updatedAt: "2023-05-15T00:00:00Z"
  },
  {
    id: "parent-mila-dasilva",
    name: "Mila Da Silva",
    email: "mila.dasilva@example.com",
    phone: "(021) 123-8899",
    imageUrl: "",
    role: UserRole.PARENT,
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-01-10T00:00:00Z"
  },
  {
    id: "parent-chloe-roux",
    name: "Chloé Roux",
    email: "chloe.roux@example.com",
    phone: "(021) 246-8135",
    imageUrl: "",
    role: UserRole.PARENT,
    createdAt: "2023-09-01T00:00:00Z",
    updatedAt: "2023-09-01T00:00:00Z"
  },
  {
    id: "clinician-dr-smith",
    title: "Dr.",
    name: "John Smith",
    email: "dr.smith@clinician.com",
    phone: "(021) 987-6543",
    imageUrl: "",
    role: UserRole.CLINICIAN,
    createdAt: "2022-11-20T00:00:00Z",
    updatedAt: "2022-11-20T00:00:00Z"
  },
  {
    id: "clinician-alice-williams",
    title: "Dr.",
    name: "Alice Williams",
    email: "dr.williams@clinician.com",
    phone: "(021) 111-2222",
    imageUrl: "",
    role: UserRole.CLINICIAN,
    createdAt: "2023-08-10T00:00:00Z",
    updatedAt: "2023-08-10T00:00:00Z"
  },
  {
    id: "clinician-olivia-chen",
    title: "Dr.",
    name: "Olivia Chen",
    email: "dr.chen@clinician.com",
    phone: "(021) 333-4444",
    imageUrl: "",
    role: UserRole.CLINICIAN,
    createdAt: "2023-10-01T00:00:00Z",
    updatedAt: "2023-10-01T00:00:00Z"
  },
  {
    id: "admin-user",
    name: "Admin User",
    email: "admin@raisingatlantic.com",
    phone: "(021) 555-5555",
    imageUrl: "",
    role: UserRole.ADMIN,
    createdAt: "2021-01-01T00:00:00Z",
    updatedAt: "2021-01-01T00:00:00Z"
  },
  {
    id: "super-admin-user",
    name: "Super Admin",
    email: "super@raisingatlantic.com",
    phone: "(021) 000-0000",
    imageUrl: "",
    role: UserRole.SUPER_ADMIN,
    createdAt: "2020-01-01T00:00:00Z",
    updatedAt: "2020-01-01T00:00:00Z"
  }
];

export const DUMMY_DEFAULT_USER_ID = "parent-jane-doe";
export type { User };
