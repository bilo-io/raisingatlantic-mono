import { z } from "zod";

export const childGenderSchema = z.enum(["male", "female"]);
export type ChildGender = z.infer<typeof childGenderSchema>;

export const childFormSchema = z.object({
  firstName: z.string().min(2, "First name is required (min 2 characters)"),
  lastName: z.string().min(2, "Last name is required (min 2 characters)"),
  gender: childGenderSchema,
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  notes: z.string().optional(),
});

export type ChildFormValues = z.infer<typeof childFormSchema>;
