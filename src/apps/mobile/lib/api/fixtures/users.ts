import type { User } from "@raising-atlantic/types";

const NOW = "2026-01-15T10:00:00.000Z";
const TWO_DAYS_AGO = "2026-01-13T10:00:00.000Z";
const FIVE_DAYS_AGO = "2026-01-10T10:00:00.000Z";
const TEN_DAYS_AGO = "2026-01-05T10:00:00.000Z";

export const fixtureParentId = "00000000-0000-4000-8000-000000000001";
export const fixtureClinicianId = "00000000-0000-4000-8000-000000000002";
export const fixtureAdminId = "00000000-0000-4000-8000-000000000003";
export const fixtureSuperAdminId = "00000000-0000-4000-8000-000000000004";

export const fixtureTenantId = "00000000-0000-4000-8000-00000000aaaa";
export const fixtureTenantIdB = "00000000-0000-4000-8000-00000000aabb";
export const fixturePracticeIdCpt = "00000000-0000-4000-8000-00000000bbbb";
export const fixturePracticeIdJhb = "00000000-0000-4000-8000-00000000cccc";

export const usersFixture: User[] = [
  {
    id: fixtureParentId,
    name: "Thandi Mokoena",
    email: "parent.fixture@example.test",
    phone: "+27 82 000 0001",
    role: "parent",
    createdAt: TEN_DAYS_AGO,
    updatedAt: NOW,
  },
  {
    id: fixtureClinicianId,
    title: "Dr",
    name: "Sipho Ndlovu",
    email: "clinician.fixture@example.test",
    phone: "+27 82 000 0002",
    role: "clinician",
    createdAt: TEN_DAYS_AGO,
    updatedAt: NOW,
  },
  {
    id: fixtureAdminId,
    name: "Lerato Pillay",
    email: "admin.fixture@example.test",
    phone: "+27 82 000 0003",
    role: "admin",
    createdAt: TEN_DAYS_AGO,
    updatedAt: NOW,
  },
  {
    id: fixtureSuperAdminId,
    name: "Kagiso Mthembu",
    email: "super.fixture@example.test",
    phone: "+27 82 000 0004",
    role: "super_admin",
    createdAt: TEN_DAYS_AGO,
    updatedAt: NOW,
  },
  {
    id: "00000000-0000-4000-8000-000000000010",
    name: "Andile Dube",
    email: "parent2.fixture@example.test",
    phone: "+27 82 000 0010",
    role: "parent",
    createdAt: TWO_DAYS_AGO,
    updatedAt: TWO_DAYS_AGO,
  },
  {
    id: "00000000-0000-4000-8000-000000000011",
    name: "Refiloe Botha",
    email: "parent3.fixture@example.test",
    phone: "+27 82 000 0011",
    role: "parent",
    createdAt: FIVE_DAYS_AGO,
    updatedAt: FIVE_DAYS_AGO,
  },
  {
    id: "00000000-0000-4000-8000-000000000012",
    title: "Dr",
    name: "Mosa Khumalo",
    email: "clinician2.fixture@example.test",
    phone: "+27 82 000 0012",
    role: "clinician",
    createdAt: FIVE_DAYS_AGO,
    updatedAt: FIVE_DAYS_AGO,
  },
  {
    id: "00000000-0000-4000-8000-000000000013",
    title: "Sr",
    name: "Nadia van der Merwe",
    email: "clinician3.fixture@example.test",
    phone: "+27 82 000 0013",
    role: "clinician",
    createdAt: TWO_DAYS_AGO,
    updatedAt: TWO_DAYS_AGO,
  },
  {
    id: "00000000-0000-4000-8000-000000000014",
    name: "Sibusiso Naidoo",
    email: "admin2.fixture@example.test",
    phone: "+27 82 000 0014",
    role: "admin",
    createdAt: TEN_DAYS_AGO,
    updatedAt: NOW,
  },
];
