import type { CompletedMilestone } from "@raising-atlantic/types";
import {
  fixtureChildIdInfant,
  fixtureChildIdSchoolage,
  fixtureChildIdToddler,
} from "./children";
import { fixtureClinicianId, fixtureParentId } from "./users";

const NOW = "2026-01-15T10:00:00.000Z";

export const milestonesFixture: CompletedMilestone[] = [
  {
    id: "milestone-fixture-001",
    childId: fixtureChildIdInfant,
    milestoneId: "locomotor.head-control",
    dateAchieved: "2025-12-01",
    status: "Active",
    recordedById: fixtureClinicianId,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "milestone-fixture-002",
    childId: fixtureChildIdToddler,
    milestoneId: "locomotor.sitting-unsupported",
    dateAchieved: "2025-01-15",
    status: "Active",
    recordedById: fixtureClinicianId,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "milestone-fixture-003",
    childId: fixtureChildIdToddler,
    milestoneId: "locomotor.walking",
    dateAchieved: "2025-09-10",
    status: "Pending Assessment",
    recordedById: fixtureParentId,
    notes: "First independent steps at 14 months.",
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "milestone-fixture-004",
    childId: fixtureChildIdToddler,
    milestoneId: "language.first-words",
    dateAchieved: "2025-08-20",
    status: "Pending Assessment",
    recordedById: fixtureParentId,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "milestone-fixture-005",
    childId: fixtureChildIdSchoolage,
    milestoneId: "language.short-sentences",
    dateAchieved: "2024-04-12",
    status: "Active",
    recordedById: fixtureClinicianId,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "milestone-fixture-006",
    childId: fixtureChildIdSchoolage,
    milestoneId: "social.parallel-play",
    dateAchieved: "2024-08-01",
    status: "Active",
    recordedById: fixtureClinicianId,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "milestone-fixture-007",
    childId: fixtureChildIdSchoolage,
    milestoneId: "fine-motor.crayon-grasp",
    dateAchieved: "2024-10-05",
    status: "Active",
    recordedById: fixtureClinicianId,
    createdAt: NOW,
    updatedAt: NOW,
  },
];
