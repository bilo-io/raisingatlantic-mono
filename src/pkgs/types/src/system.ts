import { z } from "zod";

export const systemComponentStatusSchema = z.enum(["ok", "degraded", "down"]);
export type SystemComponentStatus = z.infer<typeof systemComponentStatusSchema>;

export const systemHealthSchema = z.object({
  status: systemComponentStatusSchema,
  lastCheckedAt: z.string(),
  components: z.object({
    api: systemComponentStatusSchema,
    db: systemComponentStatusSchema,
    queue: systemComponentStatusSchema,
  }),
});

export type SystemHealth = z.infer<typeof systemHealthSchema>;

export const featureFlagSchema = z.object({
  key: z.string(),
  label: z.string(),
  enabled: z.boolean(),
  rolloutPercent: z.number().min(0).max(100).optional(),
});

export type FeatureFlag = z.infer<typeof featureFlagSchema>;

export const tenantSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  userCount: z.number().int().nonnegative(),
  practiceCount: z.number().int().nonnegative(),
});

export type TenantSummary = z.infer<typeof tenantSummarySchema>;

export const systemLogLevelSchema = z.enum(["info", "warn", "error", "debug"]);
export type SystemLogLevel = z.infer<typeof systemLogLevelSchema>;

export const systemLogSchema = z.object({
  id: z.string(),
  level: systemLogLevelSchema,
  type: z.string(),
  message: z.string(),
  actorId: z.string().optional(),
  ipAddress: z.string().optional(),
  context: z.record(z.string(), z.unknown()).optional(),
  createdAt: z.string(),
});

export type SystemLog = z.infer<typeof systemLogSchema>;
