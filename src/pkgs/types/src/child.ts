import { z } from "zod";
import { isoDateString, resourceStatusSchema } from "./common";

export const genderSchema = z.enum(["male", "female"]);
export type Gender = z.infer<typeof genderSchema>;

export const childSchema = z.object({
  id: z.string(),
  parentId: z.string().optional(),
  clinicianId: z.string().optional(),
  name: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  gender: genderSchema,
  dateOfBirth: z.string(),
  imageUrl: z.string().optional(),
  status: resourceStatusSchema,
  notes: z.string().optional(),
  progress: z.number().int(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Child = z.infer<typeof childSchema>;
export type Patient = Child;

export const createChildSchema = z.object({
  parentId: z.string().min(1),
  clinicianId: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  gender: genderSchema,
  dateOfBirth: isoDateString,
  imageUrl: z.string().optional(),
  status: resourceStatusSchema.optional(),
  notes: z.string().optional(),
  progress: z.number().int().optional(),
});

export type CreateChildInput = z.infer<typeof createChildSchema>;

export const updateChildSchema = createChildSchema.partial();
export type UpdateChildInput = z.infer<typeof updateChildSchema>;

export const allergySeveritySchema = z.enum(["mild", "moderate", "severe"]);
export type AllergySeverity = z.infer<typeof allergySeveritySchema>;

export const allergySchema = z.object({
  id: z.string(),
  allergen: z.string(),
  severity: allergySeveritySchema,
  notes: z.string().optional(),
  status: resourceStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Allergy = z.infer<typeof allergySchema>;

export const createAllergySchema = z.object({
  allergen: z.string().min(1, "Allergen is required"),
  severity: allergySeveritySchema.optional(),
  notes: z.string().optional(),
});

export type CreateAllergyInput = z.infer<typeof createAllergySchema>;

export const medicalConditionSchema = z.object({
  id: z.string(),
  conditionName: z.string(),
  diagnosisDate: z.string().optional(),
  notes: z.string().optional(),
  status: resourceStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type MedicalCondition = z.infer<typeof medicalConditionSchema>;

export const createMedicalConditionSchema = z.object({
  conditionName: z.string().min(1, "Condition name is required"),
  diagnosisDate: isoDateString.optional(),
  notes: z.string().optional(),
});

export type CreateMedicalConditionInput = z.infer<typeof createMedicalConditionSchema>;
