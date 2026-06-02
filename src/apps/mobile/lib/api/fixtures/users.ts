import type { User } from "@raising-atlantic/types";

const NOW = "2026-01-15T10:00:00.000Z";

export const fixtureParentId = "00000000-0000-4000-8000-000000000001";
export const fixtureClinicianId = "00000000-0000-4000-8000-000000000002";
export const fixtureAdminId = "00000000-0000-4000-8000-000000000003";
export const fixtureSuperAdminId = "00000000-0000-4000-8000-000000000004";

export const fixtureTenantId = "00000000-0000-4000-8000-00000000aaaa";
export const fixturePracticeIdCpt = "00000000-0000-4000-8000-00000000bbbb";
export const fixturePracticeIdJhb = "00000000-0000-4000-8000-00000000cccc";

export const usersFixture: User[] = [
  {
    id: fixtureParentId,
    name: "Thandi Mokoena",
    email: "parent.fixture@example.test",
    phone: "+27 82 000 0001",
    role: "parent",
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: fixtureClinicianId,
    title: "Dr",
    name: "Sipho Ndlovu",
    email: "clinician.fixture@example.test",
    phone: "+27 82 000 0002",
    role: "clinician",
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: fixtureAdminId,
    name: "Lerato Pillay",
    email: "admin.fixture@example.test",
    phone: "+27 82 000 0003",
    role: "admin",
    createdAt: NOW,
    updatedAt: NOW,
  },
];
