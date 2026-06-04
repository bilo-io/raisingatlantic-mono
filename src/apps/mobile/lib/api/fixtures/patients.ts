import type { Child } from "@raising-atlantic/types";
import { childrenFixture } from "./children";
import { fixtureClinicianId } from "./users";

const NOW = "2026-01-15T10:00:00.000Z";

export const patientsFixture: Child[] = [
  ...childrenFixture,
  {
    id: "00000000-0000-4000-8000-000000c00010",
    parentId: "00000000-0000-4000-8000-0000000000a1",
    clinicianId: fixtureClinicianId,
    name: "Ofentse R.",
    firstName: "Ofentse",
    lastName: "R.",
    gender: "male",
    dateOfBirth: "2023-05-04",
    status: "Pending Assessment",
    progress: 35,
    notes: "Awaiting first clinician review.",
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "00000000-0000-4000-8000-000000c00011",
    parentId: "00000000-0000-4000-8000-0000000000a2",
    clinicianId: fixtureClinicianId,
    name: "Zinhle K.",
    firstName: "Zinhle",
    lastName: "K.",
    gender: "female",
    dateOfBirth: "2021-11-19",
    status: "Active",
    progress: 80,
    createdAt: NOW,
    updatedAt: NOW,
  },
];
