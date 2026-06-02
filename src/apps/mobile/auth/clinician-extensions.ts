// TODO: these clinician-specific fields (HPCSA / SANC numbers, verification status,
// clinical role) are not yet on the ClinicianProfile entity in pkgs/types or the API.
// Until the API ships fields + endpoints, this mobile-side extension lets ProfileScreenClinician
// render the right information from fixtures. Tracked alongside G-VER-02 in MOBILE_PHASE_M2_TODO.md.

import { fixtureClinicianId } from "../lib/api/fixtures/users";

export type ClinicianRegistry = "HPCSA" | "SANC";

export type ClinicianProfileExtension = {
  userId: string;
  registry: ClinicianRegistry;
  registryNumber: string;
  verificationStatus: "verified" | "pending" | "rejected";
  clinicalRole: string;
};

export const clinicianProfileExtensions: ClinicianProfileExtension[] = [
  {
    userId: fixtureClinicianId,
    registry: "HPCSA",
    registryNumber: "MP0123456",
    verificationStatus: "verified",
    clinicalRole: "Paediatrician",
  },
];

export function findClinicianExtension(
  userId: string | undefined,
): ClinicianProfileExtension | null {
  if (!userId) return null;
  return clinicianProfileExtensions.find((e) => e.userId === userId) ?? null;
}
