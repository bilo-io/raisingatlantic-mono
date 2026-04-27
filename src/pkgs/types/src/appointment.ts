import { z } from "zod";
import { isoDateString } from "./common";

export const appointmentStatusSchema = z.enum([
  "SCHEDULED",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
]);

export type AppointmentStatus = z.infer<typeof appointmentStatusSchema>;

export const appointmentSchema = z.object({
  id: z.string(),
  childId: z.string().optional(),
  clinicianId: z.string().optional(),
  practiceId: z.string().optional(),
  scheduledAt: z.string(),
  status: appointmentStatusSchema,
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Appointment = z.infer<typeof appointmentSchema>;

export const createAppointmentSchema = z.object({
  childId: z.string().min(1),
  clinicianId: z.string().optional(),
  practiceId: z.string().optional(),
  scheduledAt: isoDateString,
  status: appointmentStatusSchema.optional(),
  notes: z.string().optional(),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;

export const updateAppointmentSchema = z.object({
  scheduledAt: isoDateString.optional(),
  status: appointmentStatusSchema.optional(),
  notes: z.string().optional(),
});

export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>;
