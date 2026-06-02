import type { Child, CompletedVaccination } from "@raising-atlantic/types";
import { fixtureClinicianId, fixtureParentId } from "./users";

const NOW = "2026-01-15T10:00:00.000Z";

export const fixtureChildIdInfant = "00000000-0000-4000-8000-000000c00001";
export const fixtureChildIdToddler = "00000000-0000-4000-8000-000000c00002";
export const fixtureChildIdSchoolage = "00000000-0000-4000-8000-000000c00003";

export const childrenFixture: Child[] = [
  {
    id: fixtureChildIdInfant,
    parentId: fixtureParentId,
    clinicianId: fixtureClinicianId,
    name: "Amani M.",
    firstName: "Amani",
    lastName: "M.",
    gender: "female",
    dateOfBirth: "2025-09-15",
    status: "Active",
    progress: 15,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: fixtureChildIdToddler,
    parentId: fixtureParentId,
    clinicianId: fixtureClinicianId,
    name: "Kabelo M.",
    firstName: "Kabelo",
    lastName: "M.",
    gender: "male",
    dateOfBirth: "2024-07-02",
    status: "Active",
    progress: 60,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: fixtureChildIdSchoolage,
    parentId: fixtureParentId,
    clinicianId: fixtureClinicianId,
    name: "Nia M.",
    firstName: "Nia",
    lastName: "M.",
    gender: "female",
    dateOfBirth: "2022-01-20",
    status: "Active",
    progress: 92,
    createdAt: NOW,
    updatedAt: NOW,
  },
];

export const completedVaccinationsFixture: CompletedVaccination[] = [
  {
    id: "vax-fixture-001",
    childId: fixtureChildIdInfant,
    vaccineId: "hepB1",
    dateAdministered: "2025-09-15",
    status: "Active",
    recordedById: fixtureClinicianId,
    source: "CLINICIAN",
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "vax-fixture-002",
    childId: fixtureChildIdToddler,
    vaccineId: "hepB1",
    dateAdministered: "2024-07-02",
    status: "Active",
    recordedById: fixtureClinicianId,
    source: "CLINICIAN",
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "vax-fixture-003",
    childId: fixtureChildIdToddler,
    vaccineId: "dtap1",
    dateAdministered: "2024-09-02",
    status: "Active",
    recordedById: fixtureClinicianId,
    source: "CLINICIAN",
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "vax-fixture-004",
    childId: fixtureChildIdToddler,
    vaccineId: "rv1",
    dateAdministered: "2024-09-02",
    status: "Pending Assessment",
    recordedById: fixtureParentId,
    source: "PARENT",
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "vax-fixture-005",
    childId: fixtureChildIdSchoolage,
    vaccineId: "mmr1",
    dateAdministered: "2023-01-20",
    status: "Active",
    recordedById: fixtureClinicianId,
    source: "CLINICIAN",
    createdAt: NOW,
    updatedAt: NOW,
  },
];
