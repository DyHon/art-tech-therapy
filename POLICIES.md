# POLICIES.md - Compliance & Ethical Redlines

## 1. ZERO DATA RETENTION (ZDR) POLICY
- **Requirement:** Raw media files (.wav, .mp3, .m4a) and raw transcription strings are "Transient Data."
- **Execution:** 
  1. Receive audio buffer in memory.
  2. Transcribe and extract symbolic JSON.
  3. Generate Vector Embeddings.
  4. **PURGE:** Delete raw audio and text from memory/temp-storage immediately.
- **Retention:** Only `analysis_json` and `vector_rep` (encrypted) are permitted in the permanent database.

## 2. SHADOW GUARD (CRISIS DETECTION)
- **Mechanism:** Every user input must pass through the `ShadowGuard` middleware before processing.
- **Detection:** If the LLM or Keyword-Engine identifies high-intensity self-harm, active psychosis, or violent intent:
  - SET `crisis_flag: true`.
  - ABORT Jungian symbolic analysis.
  - REDIRECT to the `/safety` route (Clinical Resources/Hotlines).
- **Depth Limit:** AI is forbidden from performing "Active Imagination" prompts if the user's `tension_index` exceeds 0.9.

## 3. ANTI-SYCOPHANCY RULE
- The AI analyst must not be reflexively polite. It must maintain a "Neutral Mirror" persona.
- If the user provides a defensive or shallow entry, the AI must respond with "Productive Discomfort" to challenge the Ego-Persona.
