import { z } from "zod";
import { userRoleSchema } from "./role";

export const userSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  imageUrl: z.string().optional(),
  role: userRoleSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type User = z.infer<typeof userSchema>;

export const createUserSchema = z.object({
  title: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  imageUrl: z.string().url().optional(),
  role: userRoleSchema,
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateUserSchema = createUserSchema.partial();

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const clinicianProfileSchema = z.object({
  id: z.string(),
  specialty: z.string(),
  bio: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ClinicianProfile = z.infer<typeof clinicianProfileSchema>;

export const publicClinicianSchema = userSchema.extend({
  clinicianProfile: clinicianProfileSchema.optional(),
});

export type PublicClinician = z.infer<typeof publicClinicianSchema>;
