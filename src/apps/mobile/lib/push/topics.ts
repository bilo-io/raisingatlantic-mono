import type { Role } from "../../auth/types";

export type PushTopic =
  | "vaccine_reminders"
  | "appointment_reminders"
  | "message_alerts"
  | "verification_queue"
  | "system_alerts";

export const TOPICS_BY_ROLE: Record<Role, PushTopic[]> = {
  parent: ["vaccine_reminders", "appointment_reminders", "message_alerts"],
  clinician: ["verification_queue", "appointment_reminders"],
  admin: ["verification_queue", "system_alerts"],
};

export function topicsForRole(role: Role): PushTopic[] {
  return TOPICS_BY_ROLE[role] ?? [];
}
