import { z } from "zod";
import {
  completedMilestoneSchema,
  completedVaccinationSchema,
  growthRecordSchema,
} from "./records";
import { userSchema } from "./user";

export const verifiableRecordTypeSchema = z.enum(["Growth", "Milestone", "Vaccination"]);
export type VerifiableRecordType = z.infer<typeof verifiableRecordTypeSchema>;

// The API populates the full `child` relation on verification records
// (verifications.service.ts `relations: ['child']`); this types the summary the UI needs.
export const verificationChildSummarySchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  name: z.string().optional(),
});
export type VerificationChildSummary = z.infer<typeof verificationChildSummarySchema>;

export const verifiableGrowthRecordSchema = growthRecordSchema.extend({
  type: z.literal("Growth"),
  child: verificationChildSummarySchema.optional(),
});

export const verifiableMilestoneSchema = completedMilestoneSchema.extend({
  type: z.literal("Milestone"),
  child: verificationChildSummarySchema.optional(),
});

export const verifiableVaccinationSchema = completedVaccinationSchema.extend({
  type: z.literal("Vaccination"),
  child: verificationChildSummarySchema.optional(),
});

export const verifiableRecordSchema = z.union([
  verifiableGrowthRecordSchema,
  verifiableMilestoneSchema,
  verifiableVaccinationSchema,
]);

export type VerifiableRecord = z.infer<typeof verifiableRecordSchema>;

export const clinicianForVerificationSchema = userSchema;
export type ClinicianForVerification = z.infer<typeof clinicianForVerificationSchema>;

// Canonical approve/reject/more-info contract for verification decisions (API + mobile + web).
export const verificationOutcomeSchema = z.enum(["APPROVED", "REJECTED", "MORE_INFO"]);
export type VerificationOutcome = z.infer<typeof verificationOutcomeSchema>;

export const verificationDecisionSchema = z.object({
  outcome: verificationOutcomeSchema,
  notes: z.string().optional(),
});
export type VerificationDecision = z.infer<typeof verificationDecisionSchema>;
