import { Role, User } from "./types";

const FIXTURE_TENANT_ID = "00000000-0000-4000-8000-00000000aaaa";
const FIXTURE_PRACTICE_ID_CPT = "00000000-0000-4000-8000-00000000bbbb";
const FIXTURE_PRACTICE_ID_JHB = "00000000-0000-4000-8000-00000000cccc";

export const fixtureUsers: Record<Role, User> = {
  parent: {
    id: "00000000-0000-4000-8000-000000000001",
    name: "Thandi Mokoena",
    email: "parent.fixture@example.test",
    role: "parent",
    tenantId: FIXTURE_TENANT_ID,
  },
  clinician: {
    id: "00000000-0000-4000-8000-000000000002",
    name: "Dr Sipho Ndlovu",
    email: "clinician.fixture@example.test",
    role: "clinician",
    tenantId: FIXTURE_TENANT_ID,
    practiceIds: [FIXTURE_PRACTICE_ID_CPT, FIXTURE_PRACTICE_ID_JHB],
  },
  admin: {
    id: "00000000-0000-4000-8000-000000000003",
    name: "Lerato Pillay",
    email: "admin.fixture@example.test",
    role: "admin",
    tenantId: FIXTURE_TENANT_ID,
  },
};
