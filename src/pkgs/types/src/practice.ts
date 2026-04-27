import { z } from "zod";
import { resourceStatusSchema } from "./common";

export const practiceSchema = z.object({
  id: z.string(),
  tenantId: z.string().optional(),
  name: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  phone: z.string(),
  email: z.string().email().optional(),
  website: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  status: resourceStatusSchema,
  manager: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Practice = z.infer<typeof practiceSchema>;

export const createPracticeSchema = z.object({
  tenantId: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "Zip is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email().optional(),
  website: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  status: resourceStatusSchema.optional(),
  manager: z.string().optional(),
});

export type CreatePracticeInput = z.infer<typeof createPracticeSchema>;

export const updatePracticeSchema = createPracticeSchema.partial();
export type UpdatePracticeInput = z.infer<typeof updatePracticeSchema>;
