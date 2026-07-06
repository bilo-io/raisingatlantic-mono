import { z } from "zod";
import { userRoleSchema } from "./role";
import { userSchema } from "./user";

export const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;

export const registerRequestSchema = z.object({
  title: z.string().optional(),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  password: z.string().min(8),
  role: userRoleSchema,
});

export type RegisterRequest = z.infer<typeof registerRequestSchema>;

export const googleLoginRequestSchema = z.object({
  idToken: z.string().min(1),
});

export type GoogleLoginRequest = z.infer<typeof googleLoginRequestSchema>;

// The access token is delivered in an httpOnly cookie, never the body — so the
// auth response carries only the authenticated user.
export const authResponseSchema = z.object({
  user: userSchema,
});

export type AuthResponse = z.infer<typeof authResponseSchema>;

export const authProviderSchema = z.enum(["email", "google"]);

export type AuthProvider = z.infer<typeof authProviderSchema>;
