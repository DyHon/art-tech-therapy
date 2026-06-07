import { prisma } from "../prisma";
import {
  FunctionRatiosSchema,
  type TSnapshotPoint,
  type TArchetypeSummary,
} from "../validations/dashboard";
import { aggregateArchetypes } from "./aggregate";

/**
 * Returns a user's psychological snapshots as a chronological time-series
 * (oldest → newest), shaped for the Constellation dashboard.
 */
export async function getSnapshotSeries(userId: string, limit = 100): Promise<TSnapshotPoint[]> {
  const rows = await prisma.userSnapshot.findMany({
    where: { userId },
    orderBy: { recordedAt: "asc" },
    take: limit,
  });

  return rows.map((r) => ({
    recordedAt: r.recordedAt.toISOString(),
    timezone: r.timezone,
    tensionIndex: Number(r.tensionIndex),
    shadowScore: Number(r.shadowScore),
    // psychologicalFunctions is stored as JSON; validate it back into the 4-function shape.
    functions: FunctionRatiosSchema.parse(r.psychologicalFunctions),
  }));
}

/** Returns per-archetype summaries across all of a user's entries, most frequent first. */
export async function getArchetypeSummary(userId: string): Promise<TArchetypeSummary[]> {
  const tags = await prisma.archetypalTag.findMany({
    where: { entry: { userId } },
    select: { archetypeName: true, intensityScore: true, isIntegrated: true },
  });
  return aggregateArchetypes(tags);
}
