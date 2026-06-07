import { describe, it, expect } from "vitest";
import { aggregateArchetypes, type RawArchetypeTag } from "../lib/dashboard/aggregate";
import {
  DashboardQuerySchema,
  RelatedParamsSchema,
  RelatedQuerySchema,
  SnapshotPointSchema,
  ArchetypeSummarySchema,
} from "../lib/validations/dashboard";

describe("Milestone 5b - Dashboard read layer", () => {
  describe("aggregateArchetypes (pure)", () => {
    it("returns [] for no tags", () => {
      expect(aggregateArchetypes([])).toEqual([]);
    });

    it("groups by archetype with count, average intensity, and integrated ratio", () => {
      const tags: RawArchetypeTag[] = [
        { archetypeName: "Shadow", intensityScore: 8, isIntegrated: false },
        { archetypeName: "Shadow", intensityScore: 6, isIntegrated: true },
        { archetypeName: "Anima", intensityScore: 5, isIntegrated: false },
      ];
      const result = aggregateArchetypes(tags);

      const shadow = result.find((r) => r.archetype === "Shadow")!;
      expect(shadow.count).toBe(2);
      expect(shadow.avgIntensity).toBe(7);
      expect(shadow.integratedRatio).toBe(0.5);

      const anima = result.find((r) => r.archetype === "Anima")!;
      expect(anima.count).toBe(1);
      expect(anima.integratedRatio).toBe(0);
    });

    it("sorts by frequency descending", () => {
      const tags: RawArchetypeTag[] = [
        { archetypeName: "Anima", intensityScore: 5, isIntegrated: false },
        { archetypeName: "Shadow", intensityScore: 8, isIntegrated: false },
        { archetypeName: "Shadow", intensityScore: 7, isIntegrated: false },
      ];
      expect(aggregateArchetypes(tags).map((r) => r.archetype)).toEqual(["Shadow", "Anima"]);
    });
  });

  describe("Query param schemas", () => {
    it("DashboardQuerySchema coerces and defaults limit", () => {
      expect(DashboardQuerySchema.parse({}).limit).toBe(100);
      expect(DashboardQuerySchema.parse({ limit: "25" }).limit).toBe(25);
      expect(DashboardQuerySchema.safeParse({ limit: "0" }).success).toBe(false);
      expect(DashboardQuerySchema.safeParse({ limit: "9999" }).success).toBe(false);
    });

    it("RelatedQuerySchema defaults k and bounds it", () => {
      expect(RelatedQuerySchema.parse({}).k).toBe(5);
      expect(RelatedQuerySchema.safeParse({ k: "21" }).success).toBe(false);
    });

    it("RelatedParamsSchema requires a UUID", () => {
      expect(RelatedParamsSchema.safeParse({ id: "not-a-uuid" }).success).toBe(false);
      expect(
        RelatedParamsSchema.safeParse({ id: "11111111-1111-4111-8111-111111111111" }).success
      ).toBe(true);
    });
  });

  describe("Output schemas", () => {
    it("validates a snapshot point", () => {
      const point = {
        recordedAt: "2026-06-07T10:00:00.000Z",
        timezone: "Asia/Ho_Chi_Minh",
        tensionIndex: 0.65,
        shadowScore: 0.4,
        functions: { thinking: 0.4, feeling: 0.2, sensation: 0.2, intuition: 0.2 },
      };
      expect(SnapshotPointSchema.safeParse(point).success).toBe(true);
    });

    it("rejects an archetype summary with an out-of-range integrated ratio", () => {
      expect(
        ArchetypeSummarySchema.safeParse({
          archetype: "Shadow",
          count: 2,
          avgIntensity: 7,
          integratedRatio: 1.5,
        }).success
      ).toBe(false);
    });
  });
});
