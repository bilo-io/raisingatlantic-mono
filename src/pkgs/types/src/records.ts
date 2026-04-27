import { z } from "zod";
import { isoDateString, resourceStatusSchema } from "./common";

export const growthRecordSchema = z.object({
  id: z.string(),
  childId: z.string().optional(),
  date: z.string(),
  height: z.string().optional(),
  weight: z.string().optional(),
  headCircumference: z.string().optional(),
  notes: z.string().optional(),
  status: resourceStatusSchema,
  recordedById: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type GrowthRecord = z.infer<typeof growthRecordSchema>;

export const createGrowthRecordSchema = z.object({
  date: isoDateString,
  height: z.string().optional(),
  weight: z.string().optional(),
  headCircumference: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateGrowthRecordInput = z.infer<typeof createGrowthRecordSchema>;

export const completedMilestoneSchema = z.object({
  id: z.string(),
  childId: z.string().optional(),
  milestoneId: z.string(),
  dateAchieved: z.string(),
  notes: z.string().optional(),
  status: resourceStatusSchema,
  recordedById: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CompletedMilestone = z.infer<typeof completedMilestoneSchema>;

export const createCompletedMilestoneSchema = z.object({
  milestoneId: z.string().min(1),
  dateAchieved: isoDateString,
  notes: z.string().optional(),
});

export type CreateCompletedMilestoneInput = z.infer<typeof createCompletedMilestoneSchema>;

export const completedVaccinationSchema = z.object({
  id: z.string(),
  childId: z.string().optional(),
  vaccineId: z.string(),
  dateAdministered: z.string(),
  status: resourceStatusSchema,
  recordedById: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CompletedVaccination = z.infer<typeof completedVaccinationSchema>;

export const createCompletedVaccinationSchema = z.object({
  vaccineId: z.string().min(1),
  dateAdministered: isoDateString,
});

export type CreateCompletedVaccinationInput = z.infer<typeof createCompletedVaccinationSchema>;

export const milestoneSchema = z.object({
  id: z.string(),
  category: z.string(),
  description: z.string(),
});

export type Milestone = z.infer<typeof milestoneSchema>;

export const milestoneAgeGroupSchema = z.object({
  age: z.string(),
  milestones: z.array(milestoneSchema),
});

export type MilestoneAgeGroup = z.infer<typeof milestoneAgeGroupSchema>;

export const vaccinationSchema = z.object({
  id: z.string(),
  name: z.string(),
  recommendedAge: z.string(),
  doseInfo: z.string(),
});

export type Vaccination = z.infer<typeof vaccinationSchema>;
