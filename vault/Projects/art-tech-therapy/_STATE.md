# Current State — art-tech-therapy
_Last updated: 2026-06-07 (session: encryption-hardening-vault-setup)_

## Current focus
Milestone 4 ("The Red Thread") core is complete and **verified live** (real Gemini
embeddings, HNSW search, migration applied). Next: Milestone 5 (The Mirror) — Constellation
dashboard + full ShadowGuard crisis redirect.

## Progress / where things stand
- M1 Database ✅ — Prisma + Postgres, pgvector ext enabled. Schema has
  `JournalEntry.embedding vector(1536)`, now populated on ingest (M4).
- M2 Hybrid ingestion ✅ — text + audio (Whisper ASR mock), ShadowGuard pre-check,
  ZDR purge of transient media in `finally`.
- M3 Pluggable AI ✅ — `IAIEngineAdapter` → `GeminiAdapter`, Zod-validated output,
  double medical-redline (prompt + `sanitizeClinicalTerms`).
- Security hardening ✅ (this session) — encryption now fail-fast on missing
  `ENCRYPTION_KEY`; `decrypt` throws instead of silently returning ciphertext.
- Tests: 23/23 passing; `tsc --noEmit` clean; `prisma validate` clean.
- M4 core ✅ (this session) — `adapter.embed()` (Gemini `gemini-embedding-001` @1536 via
  `@google/genai`), `persistEmbedding` / `findSimilarEntries` ($queryRaw + HNSW cosine),
  migration `20260607120000_m4_red_thread` (HNSW index + `UserSnapshot.timezone`).
  Migration applied ✅; live Gemini embedding verified end-to-end (1536-dim) ✅.
- Docs migration ✅ — 9 Vietnamese Google Docs exported to `.docx` and translated to
  English Markdown in `vault/Knowledge/` (feasibility report, 5-milestone roadmap, data
  models, rationale notes). The full roadmap has **5 milestones** (M5 = The Mirror
  dashboard + full ShadowGuard crisis redirect).

## Next steps
1. Begin Milestone 5 (The Mirror): Constellation dashboard (Radar of the 4 functions +
   archetype network) and full ShadowGuard crisis redirect (psychosis/self-harm →
   grounding exercises → real medical resources).
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

## Key references
- [[2026-06-07-aes256gcm-failfast-key]] · [[2026-06-07-embedding-provider-hnsw]] (decisions)
- [[2026-06-07-encryption-hardening-vault-setup]] (session)
- Governance chain: POLICIES.md > CLAUDE.md > PROCESS.md > PERSONAS.md
- [[architecture-vision]] · [[feasibility-report]] · [[roadmap-5-milestones]] (design docs)
- [[watch-list-tools-to-evaluate]] (third-party tools/repos to consider integrating)
- [[taste-skill-frontend]] / [[2026-06-07-taste-skill-deferred-m5]] — UI design skill,
  evaluated 2026-06-07, parked for M5 (not adopted now)
- [[_migrated-from-google-docs]] (conversion index)
