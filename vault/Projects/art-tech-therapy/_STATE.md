# Current State — art-tech-therapy
_Last updated: 2026-06-07 (session: onboarding→MVP / v0.2.0)_

## Current focus
**Milestone 5 (The Mirror) COMPLETE → MVP done (M1–M5), released as v0.2.0.** Landing +
nav, journaling (`/journal`), the Constellation dashboard (`/dashboard`: Radar +
Tension/Shadow trend + d3-force Archetype graph), and the `/safety` crisis route — all
live and rendering real Gemini data. taste-skill (soft/minimalist) vendored + ADR accepted.
Public on GitHub. Next: optional post-MVP — auth, deploy, richer features.

## Progress / where things stand
- M1 Database ✅ — Prisma + Postgres, pgvector ext enabled. Schema has
  `JournalEntry.embedding vector(1536)`, now populated on ingest (M4).
- M2 Hybrid ingestion ✅ — text + audio (Whisper ASR mock), ShadowGuard pre-check,
  ZDR purge of transient media in `finally`.
- M3 Pluggable AI ✅ — `IAIEngineAdapter` → `GeminiAdapter`, Zod-validated output,
  double medical-redline (prompt + `sanitizeClinicalTerms`).
- Security hardening ✅ (this session) — encryption now fail-fast on missing
  `ENCRYPTION_KEY`; `decrypt` throws instead of silently returning ciphertext.
- Tests: 38/38 passing; `tsc --noEmit` clean; `next build` clean.
- M5 UI ✅ — landing + `SiteNav`; `/journal` composer (crisis→/safety redirect verified);
  `/dashboard` (visx Radar + Trend + d3-force Constellation, polished labels/ticks);
  `/safety` (BreathingGuide, reduced-motion aware). taste-skill vendored to
  `design/taste-skill/`, ADR accepted.
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

## Next steps (post-MVP, optional)
1. **Auth** — reads currently resolve a single seed user (`findFirst`); add real
   accounts/sessions before multi-user use.
2. **Deploy** — Vercel + a hosted Postgres with pgvector; set `ENCRYPTION_KEY` /
   `GEMINI_API_KEY` / `DATABASE_URL` as env secrets.
3. **Richer features** — archetype Integration Score, a red-thread "related entries" UI on
   the dashboard, audio journaling in the UI; revisit filtered-ANN perf as data grows.
4. (Owner) delete the temporary `docs/` export folder (gitignored).
   Note: free-tier Gemini rate-limits under rapid use — space out ingests or upgrade tier.

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
- Decisions: [[2026-06-07-aes256gcm-failfast-key]] · [[2026-06-07-embedding-provider-hnsw]] ·
  [[2026-06-07-analysis-reliability-no-silent-mock]] · [[2026-06-07-charting-visx-d3force]] ·
  [[2026-06-07-pluggable-ai-adapter]] · [[2026-06-07-immutable-usersnapshot]]
- [[2026-06-07-encryption-hardening-vault-setup]] (session — full MVP arc)
- Governance chain: POLICIES.md > CLAUDE.md > PROCESS.md > PERSONAS.md
- [[architecture-vision]] · [[feasibility-report]] · [[roadmap-5-milestones]] (design docs)
- [[watch-list-tools-to-evaluate]] (third-party tools/repos to consider integrating)
- [[taste-skill-frontend]] / [[2026-06-07-taste-skill-deferred-m5]] — UI design skill,
  **adopted at M5**; vendored to `design/taste-skill/`
- [[_migrated-from-google-docs]] (conversion index)
