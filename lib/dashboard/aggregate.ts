import type { TArchetypeSummary } from "../validations/dashboard";

/** Minimal shape of an ArchetypalTag row needed for aggregation. */
export interface RawArchetypeTag {
  archetypeName: string;
  intensityScore: number;
  isIntegrated: boolean;
}

/**
 * Aggregates raw archetype tags into per-archetype summaries (count, average intensity,
 * and the share that have been integrated). Pure and DB-free so it is unit-testable.
 * Sorted by frequency, descending.
 */
export function aggregateArchetypes(tags: RawArchetypeTag[]): TArchetypeSummary[] {
  const byName = new Map<string, { count: number; sum: number; integrated: number }>();

  for (const tag of tags) {
    const acc = byName.get(tag.archetypeName) ?? { count: 0, sum: 0, integrated: 0 };
    acc.count += 1;
    acc.sum += tag.intensityScore;
    if (tag.isIntegrated) acc.integrated += 1;
    byName.set(tag.archetypeName, acc);
  }

  return [...byName.entries()]
    .map(([archetype, acc]) => ({
      archetype,
      count: acc.count,
      avgIntensity: acc.sum / acc.count,
      integratedRatio: acc.integrated / acc.count,
    }))
    .sort((a, b) => b.count - a.count || a.archetype.localeCompare(b.archetype));
}
