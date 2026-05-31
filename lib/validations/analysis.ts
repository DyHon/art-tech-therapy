import { z } from "zod";

// Specific schema for the 4 Functions to ensure mathematical consistency
const FunctionRatiosSchema = z.object({
  thinking: z.number().min(0).max(1),
  feeling: z.number().min(0).max(1),
  sensation: z.number().min(0).max(1),
  intuition: z.number().min(0).max(1),
});

export const JungianAnalysisSchema = z.object({
  compensation_dynamic: z.object({
    conscious_imbalance: z.string().describe("What the ego is currently over-emphasizing."),
    compensatory_intent: z.string().describe("What the unconscious is trying to balance."),
  }),
  archetypal_mappings: z.array(
    z.object({
      archetype: z.string(),
      dream_representation: z.string().describe("The specific image representing the archetype."),
      symbolic_meaning: z.string(),
      intensity: z.number().min(1).max(10),
    })
  ),
  complexes_identified: z.array(
    z.object({
      complex_type: z.string(),
      affective_indicators: z.array(z.string()),
      analytical_insight: z.string(),
    })
  ),
  // Refactored to capture the full spectrum of the psyche
  psychic_tension: z.object({
    tension_score: z.number().min(0).max(1),
    function_ratios: FunctionRatiosSchema, 
  }),
  crisis_flag: z.boolean().describe("Redline detection for self-harm or psychosis."),
});

export type TJungianAnalysis = z.infer<typeof JungianAnalysisSchema>;
