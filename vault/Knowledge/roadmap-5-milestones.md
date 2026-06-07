# Roadmap — 5 Milestones (Art-Tech Therapy)

- Source(s): converted (VI→EN) from `docs/ phase G1 - Milestones.docx` (Google Doc export).

## Summary

The implementation roadmap for the Jungian Art-Tech Therapy system, structured as one Foundation phase (G0/G1) plus five execution milestones. **Current status:** M1 (Database), M2 (Capture Engine), and M3 (Alchemist AI) are implemented. **M4 — The Red Thread** (vector search / archetypal chronology) is next. **M5 — The Mirror** (Constellation Dashboard plus the full ShadowGuard psychological-defense system) closes out the roadmap.

## Foundation Phase (G0 & G1)

### Phase G0: Establishing System DNA (Completed)

The bootstrapping phase that defines the core rule sets, turning the codebase into a Single Source of Truth (SSOT).

- **CLAUDE.md / POLICIES.md:** Lock in the Carl Jung analytical-psychology philosophy and the absolute Zero Data Retention (ZDR) security policy (no logging; no storage of raw user audio or text after analysis).
- **PERSONAS.md (Multi-Agent separation-of-responsibility mechanism):**
  - **THE ARCHITECT:** Intelligent context management; uses the `knowledge_manifest.json` cache to detect changes under `./docs`, avoiding a full-directory scan that would waste tokens.
  - **THE ALCHEMIST:** The coding engineer; optimizes the vector algorithms and database structure.
  - **THE GUARDIAN:** The security gatekeeper; runs the test suite, checks for PII leakage, and enforces performance.
- **PROCESS.md:** A strict five-step operating workflow — Discovery & Alignment ➔ Planning ➔ Atomic Implementation ➔ Multi-Stage Validation ➔ Commit & Document.

## The Core Pipeline — 5 Execution Milestones

### Milestone 1: Database Implementation & Infrastructure

- **Goal:** Stand up the entire isolated data skeleton on Docker and establish the data-type validation layer.
- **Infrastructure:** PostgreSQL with the `pgvector` extension, running entirely inside a Docker container.
- **Upgraded data structures:**
  - **JournalEntry:** Encrypted content (`contentEncrypted`); stores a 1536-dimension vector (`Unsupported("vector(1536)")`).
  - **UserSnapshot:** The `dominantFunction` field is replaced by `psychologicalFunctions` (JSONB) to hold the dynamic ratios of all four functions (Thinking, Feeling, Sensation, Intuition) for the Constellation Dashboard. A composite index `@@index([userId, recordedAt])` optimizes time-series access.
  - **ArchetypalTag:** Stores unconscious labels such as Shadow, Anima, and Trickster together with an intensity score.
- **THE GUARDIAN's constraints:** Enforce a performance check (P95 latency < 150ms); mandate `Prisma.$queryRaw` for all vector-search statements so they hit the HNSW index directly, and strictly forbid Prisma's standard search helpers, which would trigger a Full Table Scan.

### Milestone 2: The Capture Engine (Audio & Zero-Knowledge Ingestion)

- **Goal:** Build a fully secure ingestion pipeline for dream-journal audio.
- **Additional infrastructure:** Install FFmpeg on the system.
- **Processing flow:** Frontend records audio (Web Audio API) ➔ pushes the buffer to the Node.js backend ➔ calls a local Whisper ASR to transcribe raw text ➔ feeds the raw text into the Gemini AI engine to extract psychological symbols.
- **ZDR enforcement:** Immediately after Gemini returns its JSON result, the system middleware must trigger a permanent delete (`fs.unlinkSync`) of the entire audio file and the raw text string from the buffer, leaving no trace whatsoever on disk.

### Milestone 3: The Alchemist AI (Gemini Symbolic Extraction)

- **Goal:** Establish deep prompts that have Gemini act as a Jungian analyst to extract symbolic meaning.
- **Tasks:**
  - Build a prompt-structuring system that helps Gemini recognize the compensatory nature of the unconscious (Conscious Imbalance vs. Compensatory Intent).
  - Extract symbolic motifs (snake, ocean, clock, etc.) and package them into a normalized JSON format strictly validated by a Zod schema.
  - Automatically compute a `psychic_tension` score and redistribute the ratios of the four psychological functions to update the `UserSnapshot` table.

### Milestone 4: The Red Thread (Vector Search & Archetypal Chronology)

- **Goal:** Connect scattered data points into a personalized progression (Individuation).
- **Tasks:**
  - Use the Gemini Embedding API to turn dreams into vector coordinates.
  - Run similarity queries (Cosine Similarity) in pure SQL through the HNSW index to surface the "Red Thread" — repressed unconscious themes (Shadow) that recur over time.
  - Measure the Integration Score of the archetypes to gauge whether the user has recognized and reconciled with their dark side.

### Milestone 5: The Mirror (Cinematic Dashboard & Shadow Guard)

- **Goal:** Complete the visual frontend and an advanced psychological-defense system.
- **Tasks:**
  - Build the Constellation Dashboard in Next.js, rendering a varying radar chart of the four psychological functions and a symbol-network diagram driven by the JSONB data.
  - Install the ShadowGuard middleware: the system automatically scans for a "Crisis Flag." If it detects signs that the user has slipped into a psychotic state or shows self-harm tendencies, the AI immediately locks the deep-analysis pipeline, redirects the interface to safe Grounding Techniques, and displays real medical-rescue information.

## Related notes
- [[feasibility-report]]
- [[architecture-vision]]
- [[pgvector-hnsw]]
