import { describe, it, expect, beforeEach } from "vitest";
import * as ShadowGuard from "../lib/security/shadow-guard";
import { GeminiAdapter } from "../lib/ai/adapters/gemini.adapter";
import { IAIEngineAdapter } from "../lib/ai/adapter.interface";
import { decrypt, encrypt } from "../lib/security/encryption";

// Deterministic key for the encryption suite ONLY (test-only; never used in dev/prod,
// where ENCRYPTION_KEY is supplied via the environment and is never committed).
process.env.ENCRYPTION_KEY =
  process.env.ENCRYPTION_KEY || "test-only-encryption-key-do-not-use-in-production";

describe("Milestone 3 - Safety Shield & Pluggable AI Integration Suite", () => {
  // 1. Scenario A: Crisis Redline Check
  describe("Scenario A: Crisis Redline (Shadow Guard Interception)", () => {
    it("should immediately trigger crisis_flag for suicidal ideation, bypass deep AI, and return schema-valid empty details", () => {
      const crisisText = "I want to end it all and kill myself, everything is hopeless.";
      const analysis = ShadowGuard.scan(crisisText);

      expect(analysis.crisis_flag).toBe(true);
      expect(analysis.psychic_tension.tension_score).toBe(1.0);
      expect(analysis.compensation_dynamic.conscious_imbalance).toContain("CRISIS INTERCEPTION");
      expect(analysis.archetypal_mappings).toHaveLength(0);
      expect(analysis.complexes_identified).toHaveLength(0);
    });

    it("should not trigger crisis_flag for normal reflective journal text", () => {
      const safeText = "I had a dream that I was wandering around a beautiful green library looking for a hidden door.";
      const analysis = ShadowGuard.scan(safeText);

      expect(analysis.crisis_flag).toBe(false);
      expect(analysis.psychic_tension.tension_score).toBe(0.0);
    });
  });

  // 2. Scenario B: Jungian Integrity Check
  describe("Scenario B: Jungian Integrity (Symbolic Amplification)", () => {
    it("should successfully extract Shadow archetype from a dream containing a shadowy figure in a cave", async () => {
      const adapter: IAIEngineAdapter = new GeminiAdapter();
      const dreamText = "I dreamt I was running in a dark cave, being chased by a terrifying shadowy figure.";
      
      const analysis = await adapter.analyze(dreamText);

      expect(analysis.crisis_flag).toBe(false);
      
      // Verify that 'Shadow' archetype is identified and mapped
      const shadowArchetype = analysis.archetypal_mappings.find(
        (a) => a.archetype.toLowerCase() === "shadow"
      );
      
      expect(shadowArchetype).toBeDefined();
      expect(shadowArchetype?.dream_representation).toContain("Shadowy Figure");
      expect(shadowArchetype?.intensity).toBeGreaterThanOrEqual(1);
      expect(shadowArchetype?.intensity).toBeLessThanOrEqual(10);
    });
  });

  // 3. Scenario C: Constraint & Medical Redline Verification
  describe("Scenario C: Constraint Verification (Diagnostic Ban)", () => {
    it("should strictly avoid clinical DSM-5 words like depression or anxiety and substitute with Jungian equivalents", async () => {
      const adapter: IAIEngineAdapter = new GeminiAdapter();
      
      // Text expressing deep stagnation which might challenge normal LLMs to output "depression" or "anxiety"
      const stagnantText = "I feel completely stuck. My boss blames me for everything, and I feel a deep sense of chronic depression and anxiety disorder.";
      
      const analysis = await adapter.analyze(stagnantText);
      const jsonString = JSON.stringify(analysis).toLowerCase();

      // Enforce clinical bans
      expect(jsonString).not.toContain("depression");
      expect(jsonString).not.toContain("anxiety disorder");
      
      // Confirm that the output is sanitized and uses Jungian replacements
      expect(jsonString).toContain("libidinal stagnation");
      expect(jsonString).toContain("psychic tension");
    });
  });

  // 4. Scenario D: Adapter Swappability
  describe("Scenario D: Adapter Swappability (Abstract Coupling)", () => {
    it("should demonstrate polymorphic compliance where an IAIEngineAdapter object successfully calls analyze", async () => {
      // Create concrete GeminiAdapter instance cast directly to the abstract interface type
      const adapter: IAIEngineAdapter = new GeminiAdapter();
      
      // Define a custom, lightweight mock adapter matching the interface to prove complete pluggability
      const customMockAdapter: IAIEngineAdapter = {
        analyze: async (text: string) => {
          return {
            compensation_dynamic: {
              conscious_imbalance: "Custom imbalance",
              compensatory_intent: "Custom compensatory intent",
            },
            archetypal_mappings: [],
            complexes_identified: [],
            psychic_tension: {
              tension_score: 0.1,
              function_ratios: {
                thinking: 0.25,
                feeling: 0.25,
                sensation: 0.25,
                intuition: 0.25,
              },
            },
            crisis_flag: false,
          };
        },
        embed: async () => new Array(1536).fill(0),
      };

      // Both adapters must be callable identical to each other using the interface contract
      const resGemini = await adapter.analyze("Some text");
      const resCustom = await customMockAdapter.analyze("Some text");

      expect(resGemini.crisis_flag).toBe(false);
      expect(resCustom.crisis_flag).toBe(false);
      expect(resCustom.psychic_tension.tension_score).toBe(0.1);
    });
  });

  // 5. Zero Data Retention & Security Encryption Checks
  describe("ZDR & Encryption Compliance", () => {
    it("should successfully encrypt and decrypt cleartext data", () => {
      const cleartext = "This is a highly secret hypnopompic dream transcript.";
      const encrypted = encrypt(cleartext);
      
      expect(encrypted).not.toBe(cleartext);
      expect(encrypted.split(":")).toHaveLength(3); // iv:authTag:encrypted format

      const decrypted = decrypt(encrypted);
      expect(decrypted).toBe(cleartext);
    });

    it("should THROW (not silently return ciphertext) when the auth tag is tampered with", () => {
      const encrypted = encrypt("A tampered hypnopompic transcript.");
      const [ivHex, authTagHex, dataHex] = encrypted.split(":");
      // Corrupt the GCM auth tag while keeping a valid hex length
      const forgedTag = "0".repeat(authTagHex.length);
      const tampered = `${ivHex}:${forgedTag}:${dataHex}`;

      expect(() => decrypt(tampered)).toThrow();
    });

    it("should THROW on malformed ciphertext that does not match iv:authTag:encrypted", () => {
      expect(() => decrypt("this-is-not-valid-ciphertext")).toThrow();
    });

    it("should fail fast and THROW when ENCRYPTION_KEY is not configured", () => {
      const saved = process.env.ENCRYPTION_KEY;
      delete process.env.ENCRYPTION_KEY;
      try {
        expect(() => encrypt("should not encrypt without a key")).toThrow(/ENCRYPTION_KEY/);
      } finally {
        process.env.ENCRYPTION_KEY = saved;
      }
    });
  });
});
