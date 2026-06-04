import type { Appointment } from "@raising-atlantic/types";
import {
  fixtureChildIdInfant,
  fixtureChildIdSchoolage,
  fixtureChildIdToddler,
} from "./children";
import { fixturePracticeIdCpt, fixtureClinicianId } from "./users";

const NOW = "2026-01-15T10:00:00.000Z";

export const appointmentsFixture: Appointment[] = [
  {
    id: "appt-fixture-001",
    childId: fixtureChildIdInfant,
    clinicianId: fixtureClinicianId,
    practiceId: fixturePracticeIdCpt,
    scheduledAt: "2026-02-01T09:30:00.000Z",
    status: "SCHEDULED",
    notes: "4-month well-baby visit",
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "appt-fixture-002",
    childId: fixtureChildIdToddler,
    clinicianId: fixtureClinicianId,
    practiceId: fixturePracticeIdCpt,
    scheduledAt: "2026-02-08T10:00:00.000Z",
    status: "SCHEDULED",
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "appt-fixture-003",
    childId: fixtureChildIdSchoolage,
    clinicianId: fixtureClinicianId,
    practiceId: fixturePracticeIdCpt,
    scheduledAt: "2025-12-12T14:00:00.000Z",
    status: "COMPLETED",
    createdAt: NOW,
    updatedAt: NOW,
  },
];
