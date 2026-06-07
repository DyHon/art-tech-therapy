import { z } from "zod";

/** The four Jungian functions as a 0–1 distribution (as stored in UserSnapshot). */
export const FunctionRatiosSchema = z.object({
  thinking: z.number(),
  feeling: z.number(),
  sensation: z.number(),
  intuition: z.number(),
});
export type TFunctionRatios = z.infer<typeof FunctionRatiosSchema>;

/** One point in a user's psychological time-series (for the Constellation dashboard). */
export const SnapshotPointSchema = z.object({
  recordedAt: z.string(), // ISO-8601 instant
  timezone: z.string(),
  tensionIndex: z.number(),
  shadowScore: z.number(),
  functions: FunctionRatiosSchema,
});
export type TSnapshotPoint = z.infer<typeof SnapshotPointSchema>;

/** Aggregated archetype presence across a user's entries. */
export const ArchetypeSummarySchema = z.object({
  archetype: z.string(),
  count: z.number().int(),
  avgIntensity: z.number(),
  integratedRatio: z.number().min(0).max(1),
});
export type TArchetypeSummary = z.infer<typeof ArchetypeSummarySchema>;

/** Query params for GET /api/dashboard. */
export const DashboardQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(500).default(100),
});

/** Path + query params for GET /api/journal/[id]/related. */
export const RelatedParamsSchema = z.object({
  id: z.string().uuid(),
});
export const RelatedQuerySchema = z.object({
  k: z.coerce.number().int().min(1).max(20).default(5),
});
