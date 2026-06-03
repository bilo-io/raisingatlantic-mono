import type { SystemLog } from "@raising-atlantic/types";
import { fixtureAdminId, fixtureClinicianId, fixtureSuperAdminId } from "./users";

export const activityFixture: SystemLog[] = [
  {
    id: "00000000-0000-4000-8000-0000000000e1",
    level: "warn",
    type: "auth_failure",
    message: "Failed sign-in (5 attempts) — account locked for 15m",
    ipAddress: "196.0.0.0",
    createdAt: "2026-01-15T09:42:00.000Z",
  },
  {
    id: "00000000-0000-4000-8000-0000000000e2",
    level: "info",
    type: "verification_state_change",
    message: "Record verification approved",
    actorId: fixtureClinicianId,
    createdAt: "2026-01-15T09:15:00.000Z",
  },
  {
    id: "00000000-0000-4000-8000-0000000000e3",
    level: "info",
    type: "role_change",
    message: "User elevated to admin within tenant",
    actorId: fixtureSuperAdminId,
    createdAt: "2026-01-15T08:50:00.000Z",
  },
  {
    id: "00000000-0000-4000-8000-0000000000e4",
    level: "info",
    type: "tenant_created",
    message: "New tenant provisioned",
    actorId: fixtureSuperAdminId,
    createdAt: "2026-01-14T16:30:00.000Z",
  },
  {
    id: "00000000-0000-4000-8000-0000000000e5",
    level: "info",
    type: "password_reset",
    message: "Password reset email sent",
    createdAt: "2026-01-14T14:05:00.000Z",
  },
  {
    id: "00000000-0000-4000-8000-0000000000e6",
    level: "info",
    type: "verification_state_change",
    message: "Clinician HPCSA verification approved",
    actorId: fixtureAdminId,
    createdAt: "2026-01-14T11:20:00.000Z",
  },
  {
    id: "00000000-0000-4000-8000-0000000000e7",
    level: "warn",
    type: "auth_failure",
    message: "Failed sign-in from new device",
    ipAddress: "41.0.0.0",
    createdAt: "2026-01-13T22:10:00.000Z",
  },
  {
    id: "00000000-0000-4000-8000-0000000000e8",
    level: "info",
    type: "verification_state_change",
    message: "Record verification rejected — insufficient evidence",
    actorId: fixtureClinicianId,
    createdAt: "2026-01-13T15:45:00.000Z",
  },
];
