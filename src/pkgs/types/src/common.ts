import { z } from "zod";

export const ResourceStatus = {
  Active: "Active",
  Inactive: "Inactive",
  Archived: "Archived",
  Discharged: "Discharged",
  PendingAssessment: "Pending Assessment",
} as const;

export type ResourceStatus = (typeof ResourceStatus)[keyof typeof ResourceStatus];

export const resourceStatusSchema = z.enum([
  "Active",
  "Inactive",
  "Archived",
  "Discharged",
  "Pending Assessment",
]);

export const isoDateString = z.string().refine(
  (v) => !Number.isNaN(Date.parse(v)),
  { message: "Invalid ISO date string" },
);

export const timestampsSchema = z.object({
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Timestamps = z.infer<typeof timestampsSchema>;

export type ApiErrorShape = {
  statusCode: number;
  message: string | string[];
  error?: string;
};
