import { z } from "zod";

export const UserRole = {
  Parent: "parent",
  Clinician: "clinician",
  Admin: "admin",
  SuperAdmin: "super_admin",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const userRoleSchema = z.enum([
  "parent",
  "clinician",
  "admin",
  "super_admin",
]);
