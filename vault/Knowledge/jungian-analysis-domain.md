# Jungian Analysis Domain (project glossary)

- Source(s): inferred from `lib/validations/analysis.ts`, `lib/ai/adapters/gemini.adapter.ts`,
  `lib/security/shadow-guard.ts`, and [[architecture-vision]]. _Inferred — verify._

## Summary
The analytical output the Alchemist (Gemini) produces, and the safety frame around it.
The canonical shape is the Zod `JungianAnalysisSchema` → `TJungianAnalysis`.

## Key points
- **Analysis object fields:**
  - `compensation_dynamic` — `conscious_imbalance` (what the ego over-emphasizes) +
    `compensatory_intent` (what the unconscious is balancing).
  - `archetypal_mappings[]` — `archetype`, `dream_representation`, `symbolic_meaning`,
    `intensity` (1–10). Archetypes: Shadow, Anima/Animus, Self, Wise Old Man/Woman,
    Trickster, Persona.
  - `complexes_identified[]` — `complex_type`, `affective_indicators[]`,
    `analytical_insight`.
  - `psychic_tension` — `tension_score` (0–1) + `function_ratios` over the four Jungian
    functions (thinking / feeling / sensation / intuition, each 0–1).
  - `crisis_flag` — set by ShadowGuard, not the LLM.
- **Persona of the analyst ("the Alchemist"):** neutral mirror, anti-sycophantic
  ("productive discomfort"), uses symbolic amplification, never literal interpretation.
- **Medical redline:** no DSM-5 / clinical terms (depression, anxiety disorder, bipolar,
  PTSD, OCD, psychosis…). Enforced twice: system prompt + `sanitizeClinicalTerms()`
  post-filter that swaps clinical terms for Jungian equivalents ("libidinal stagnation",
  "psychic tension"…).
- **ShadowGuard:** keyword crisis interception (VN + EN terms) runs *before* the LLM; on a
  hit it sets `crisis_flag`, returns a neutralized analysis, and the route redirects to
  `/safety`.

## Related notes
- [[architecture-vision]]
- [[2026-06-07-pluggable-ai-adapter]]
