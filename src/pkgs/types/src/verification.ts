import { z } from "zod";
import {
  completedMilestoneSchema,
  completedVaccinationSchema,
  growthRecordSchema,
} from "./records";
import { userSchema } from "./user";

export const verifiableRecordTypeSchema = z.enum(["Growth", "Milestone", "Vaccination"]);
export type VerifiableRecordType = z.infer<typeof verifiableRecordTypeSchema>;

export const verifiableGrowthRecordSchema = growthRecordSchema.extend({
  type: z.literal("Growth"),
});

export const verifiableMilestoneSchema = completedMilestoneSchema.extend({
  type: z.literal("Milestone"),
});

export const verifiableVaccinationSchema = completedVaccinationSchema.extend({
  type: z.literal("Vaccination"),
});

export const verifiableRecordSchema = z.union([
  verifiableGrowthRecordSchema,
  verifiableMilestoneSchema,
  verifiableVaccinationSchema,
]);

export type VerifiableRecord = z.infer<typeof verifiableRecordSchema>;

export const clinicianForVerificationSchema = userSchema;
export type ClinicianForVerification = z.infer<typeof clinicianForVerificationSchema>;
