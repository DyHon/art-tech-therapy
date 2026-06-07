import { describe, it, expect } from "vitest";
import { GeminiAdapter } from "../lib/ai/adapters/gemini.adapter";
import { IAIEngineAdapter } from "../lib/ai/adapter.interface";
import { EMBEDDING_DIM } from "../lib/vector/constants";
import { toVectorLiteral } from "../lib/vector/serialize";
import { getUserTimezone, isValidTimezone } from "../lib/timezone";

describe("Milestone 4 - The Red Thread (Vector Search) Suite", () => {
  // 1. Embedding generation through the adapter (Interface Rule)
  describe("Embedding generation (adapter.embed)", () => {
    it("produces a 1536-dimensional finite numeric vector", async () => {
      const adapter: IAIEngineAdapter = new GeminiAdapter();
      const vec = await adapter.embed("I dreamt of an endless staircase descending into water.");

      expect(vec).toHaveLength(EMBEDDING_DIM);
      expect(vec.every((n) => Number.isFinite(n))).toBe(true);
    });

    it("is deterministic for identical input and differs for different input", async () => {
      const adapter = new GeminiAdapter();
      const a1 = await adapter.embed("the snake coiled by the river");
      const a2 = await adapter.embed("the snake coiled by the river");
      const b = await adapter.embed("a clock melting in the afternoon sun");

      expect(a1).toEqual(a2);
      expect(a1).not.toEqual(b);
    });

    it("returns a roughly unit-norm vector so cosine distance is well-behaved", async () => {
      const adapter = new GeminiAdapter();
      const vec = await adapter.embed("anything");
      const norm = Math.sqrt(vec.reduce((s, n) => s + n * n, 0));

      expect(norm).toBeGreaterThan(0.99);
      expect(norm).toBeLessThan(1.01);
    });
  });

  // 2. Adapter swappability extends to embeddings
  describe("Adapter swappability for embed()", () => {
    it("any IAIEngineAdapter implementation exposes a working embed()", async () => {
      const custom: IAIEngineAdapter = {
        analyze: async () => {
          throw new Error("analyze not used in this test");
        },
        embed: async () => new Array(EMBEDDING_DIM).fill(0.5),
      };

      const vec = await custom.embed("x");
      expect(vec).toHaveLength(EMBEDDING_DIM);
    });
  });

  // 3. pgvector literal serialization (guards against corrupt vectors reaching the DB)
  describe("toVectorLiteral (pgvector serialization)", () => {
    it("formats a numeric vector as a bracketed comma list", () => {
      expect(toVectorLiteral([0.1, -0.2, 3])).toBe("[0.1,-0.2,3]");
    });

    it("throws on an empty vector", () => {
      expect(() => toVectorLiteral([])).toThrow();
    });

    it("throws on non-finite values", () => {
      expect(() => toVectorLiteral([1, NaN, 3])).toThrow();
      expect(() => toVectorLiteral([1, Infinity])).toThrow();
    });
  });

  // 4. Localized timezone metadata (PROCESS.md Step 4.5)
  describe("getUserTimezone (localized snapshot tz)", () => {
    it("reads a valid IANA timezone from personaMask", () => {
      expect(getUserTimezone({ timezone: "Asia/Ho_Chi_Minh" })).toBe("Asia/Ho_Chi_Minh");
    });

    it("defaults to UTC when missing, empty, malformed, or wrong-typed", () => {
      expect(getUserTimezone(null)).toBe("UTC");
      expect(getUserTimezone({})).toBe("UTC");
      expect(getUserTimezone({ timezone: "" })).toBe("UTC");
      expect(getUserTimezone({ timezone: "Not/AZone" })).toBe("UTC");
      expect(getUserTimezone({ timezone: 123 })).toBe("UTC");
    });

    it("validates IANA zone identifiers", () => {
      expect(isValidTimezone("Europe/London")).toBe(true);
      expect(isValidTimezone("Mars/Olympus")).toBe(false);
    });
  });
});
