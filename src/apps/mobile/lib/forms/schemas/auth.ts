import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
export type SignInValues = z.infer<typeof signInSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
});
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  token: z.string().length(64, "Paste the full token from the email"),
  newPassword: z.string().min(8, "Use at least 8 characters"),
});
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export const verifyEmailSchema = z.object({
  token: z.string().length(64, "Paste the full token from the email"),
});
export type VerifyEmailValues = z.infer<typeof verifyEmailSchema>;

export const mfaCodeSchema = z.object({
  code: z.string().regex(/^\d{6}$/, "Enter the 6-digit code"),
});
export type MfaCodeValues = z.infer<typeof mfaCodeSchema>;
