import type { ClinicianProfile } from "@raising-atlantic/types";

export type Role = "parent" | "clinician" | "admin";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  tenantId?: string;
  practiceIds?: string[];
  // Populated for clinicians once the API `/auth/me` payload carries it; the
  // ProfileScreenClinician prefers this over the mock-only fixture shim.
  clinicianProfile?: ClinicianProfile;
};
