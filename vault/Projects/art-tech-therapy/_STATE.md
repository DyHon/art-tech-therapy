# Current State — art-tech-therapy
_Last updated: 2026-06-07 (session: encryption-hardening-vault-setup)_

## Current focus
Milestone 5 (The Mirror) **in progress**. 5A (`/safety` crisis route) and 5B (Zod-validated
read APIs for the dashboard) are done & verified live. Next: 5C Constellation dashboard
(lock charting lib — visx vs Recharts) → 5D aesthetic. M1–M4 complete and verified.

## Progress / where things stand
- M1 Database ✅ — Prisma + Postgres, pgvector ext enabled. Schema has
  `JournalEntry.embedding vector(1536)`, now populated on ingest (M4).
- M2 Hybrid ingestion ✅ — text + audio (Whisper ASR mock), ShadowGuard pre-check,
  ZDR purge of transient media in `finally`.
- M3 Pluggable AI ✅ — `IAIEngineAdapter` → `GeminiAdapter`, Zod-validated output,
  double medical-redline (prompt + `sanitizeClinicalTerms`).
- Security hardening ✅ (this session) — encryption now fail-fast on missing
  `ENCRYPTION_KEY`; `decrypt` throws instead of silently returning ciphertext.
- Tests: 27/27 passing; `tsc --noEmit` clean; `next build` clean.
- M5a ✅ — `/safety` route + `BreathingGuide` (Framer Motion, reduced-motion aware) +
  `lib/safety/crisis-resources.ts`. Client redirect to /safety still to wire (needs the
  journaling UI). Aesthetic: soft/minimalist + Framer Motion adopted (taste-skill SKILL.md
  not yet vendored).
- M5b ✅ — read layer: `lib/dashboard/` (snapshot series + pure archetype aggregation),
  `lib/vector/red-thread.ts` related-entries, and Zod-validated `GET /api/dashboard` +
  `GET /api/journal/[id]/related`. Verified live against Postgres.
- M4 core ✅ (this session) — `adapter.embed()` (Gemini `gemini-embedding-001` @1536 via
  `@google/genai`), `persistEmbedding` / `findSimilarEntries` ($queryRaw + HNSW cosine),
  migration `20260607120000_m4_red_thread` (HNSW index + `UserSnapshot.timezone`).
  Migration applied ✅; live Gemini embedding verified end-to-end (1536-dim) ✅.
- Docs migration ✅ — 9 Vietnamese Google Docs exported to `.docx` and translated to
  English Markdown in `vault/Knowledge/` (feasibility report, 5-milestone roadmap, data
  models, rationale notes). The full roadmap has **5 milestones** (M5 = The Mirror
  dashboard + full ShadowGuard crisis redirect).

## Next steps
1. M5 continues: 5C — Constellation dashboard (lock charting lib: visx vs Recharts; Radar
   + tension/shadow trend + archetype map) → 5D dream-state aesthetic. 5A (/safety) ✅,
   5B (read APIs) ✅.
2. Deferred M4 follow-ons: red-thread API endpoint + archetype Integration Score; revisit
   filtered-ANN (`userId` + HNSW) performance as entry volume grows.
3. (Owner) delete the temporary `docs/` export folder once satisfied with the converted
   notes — it is gitignored and will not be committed.

## Blockers / open questions
- Policy tension: ingest route persists `contentEncrypted` (encrypted raw transcript),
  but POLICIES.md §1 permits only `analysis_json` + `vector_rep` at rest. Decide whether
  encrypted raw text is in-scope for retention.
- vitest config loading hits an ESM/CJS bug (vitest 4 / vite); test env key set inline
  as a workaround.
- ✅ Resolved this session — analysis adapter no longer silently mocks on failure: it
  retries transient errors (429/500/503, exp backoff) and **throws** on real failure, so
  ingest returns an error instead of persisting fake analysis. Model fixed to
  `gemini-2.5-flash`. Full M3→M4→M5 pipeline verified live with real analysis + embeddings.

## Key references
- [[2026-06-07-aes256gcm-failfast-key]] · [[2026-06-07-embedding-provider-hnsw]] (decisions)
- [[2026-06-07-encryption-hardening-vault-setup]] (session)
- Governance chain: POLICIES.md > CLAUDE.md > PROCESS.md > PERSONAS.md
- [[architecture-vision]] · [[feasibility-report]] · [[roadmap-5-milestones]] (design docs)
- [[watch-list-tools-to-evaluate]] (third-party tools/repos to consider integrating)
- [[taste-skill-frontend]] / [[2026-06-07-taste-skill-deferred-m5]] — UI design skill,
  evaluated 2026-06-07, parked for M5 (not adopted now)
- [[_migrated-from-google-docs]] (conversion index)
