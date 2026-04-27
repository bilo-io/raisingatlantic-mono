import { z } from "zod";

const schema = z.object({
  EXPO_PUBLIC_API_URL: z.string().url().default("http://localhost:3000"),
  EXPO_PUBLIC_API_VERSION: z.string().default("v1"),
});

const parsed = schema.safeParse({
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
  EXPO_PUBLIC_API_VERSION: process.env.EXPO_PUBLIC_API_VERSION,
});

if (!parsed.success) {
  console.error("Invalid env:", parsed.error.flatten().fieldErrors);
  throw new Error("Mobile env validation failed. See .env.example.");
}

export const env = parsed.data;

export const apiBaseUrl = `${env.EXPO_PUBLIC_API_URL}/${env.EXPO_PUBLIC_API_VERSION}`;
