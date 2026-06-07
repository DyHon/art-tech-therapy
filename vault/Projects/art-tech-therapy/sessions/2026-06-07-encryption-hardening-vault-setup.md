# 2026-06-07 — Onboarding → MVP: hardening, vault, Milestones 4 & 5 (v0.2.0)

_One long continuous session. Started with onboarding/governance and ended with the full
MVP (Milestones 1–5) public on GitHub, tagged v0.2.0._

## Summary
Onboarded to the project and verified Milestones 1–3 against real code (not the "audited"
claim). Established a governance precedence chain + Karpathy discipline. Fixed two
encryption weaknesses. Stood up an Obsidian memory vault and migrated/translated the
Vietnamese Google Docs to English. Built **Milestone 4 (The Red Thread)** — embeddings +
HNSW vector search — and verified it live. Built **Milestone 5 (The Mirror)** end to end:
`/safety` crisis route, dashboard read APIs, the visx + d3-force Constellation dashboard, a
journaling page, a landing page + nav, and polish. Adopted the taste-skill design guides.
Published to GitHub (`DyHon/art-tech-therapy`, public) and tagged **v0.2.0 (MVP)**. An
end-to-end demo caught a real bug (retired analysis model + silent mock fallback), which we
fixed by surfacing failures.

## What changed (files / areas)
- **Governance:** `CLAUDE.md` §0 precedence chain, §4 Karpathy discipline, §5 memory
  protocol; model reference updated to `gemini-2.5-flash`.
- **Security:** `lib/security/encryption.ts` fail-fast key + throwing decrypt;
  `lib/ai/retry.ts` + hardened `GeminiAdapter.analyze` (retry transient, throw on failure).
- **M4 — Red Thread:** `IAIEngineAdapter.embed()`, `GeminiAdapter` embeddings via
  `@google/genai`, `lib/vector/{constants,serialize,red-thread}.ts`, `lib/timezone.ts`,
  migration `20260607120000_m4_red_thread` (HNSW index + `UserSnapshot.timezone`), ingest
  wiring.
- **M5 — read layer:** `lib/dashboard/{aggregate,queries}.ts`, `lib/user/current-user.ts`,
  `lib/validations/dashboard.ts`, `GET /api/dashboard`, `GET /api/journal/[id]/related`.
- **M5 — UI:** `/safety` (+ `BreathingGuide`, `lib/safety/crisis-resources.ts`),
  `/dashboard` (`FunctionRadar`, `TensionTrend`, `ArchetypeConstellation`), `/journal`
  (`JournalComposer`), landing `app/page.tsx`, `SiteNav`, `app/layout.tsx`.
- **Design:** vendored `design/taste-skill/` (soft + minimalist SKILL.md, MIT).
- **Vault:** memory vault created; design docs translated to `Knowledge/`; ADRs, CHANGELOG
  (v0.2.0 cut), `_STATE.md`, `/save` command.
- **Tooling/repo:** `.npmrc` (legacy-peer-deps), `.gitignore` updates, README, GitHub repo
  created + pushed + tag `v0.2.0`; `package.json` 0.2.0.
- **Tests:** 38/38 (Vitest); `tsc` + `next build` clean throughout.

## Decisions made
- [[2026-06-07-aes256gcm-failfast-key]] — encryption fail-fast + decrypt throws.
- [[2026-06-07-pluggable-ai-adapter]] — adapter pattern (owner-confirmed: swap LLM freely).
- [[2026-06-07-immutable-usersnapshot]] (inferred) — append-only snapshot time-series.
- [[2026-06-07-embedding-provider-hnsw]] — Gemini @1536 via `@google/genai` + HNSW cosine.
- [[2026-06-07-analysis-reliability-no-silent-mock]] — retry + surface failures; model fix.
- [[2026-06-07-charting-visx-d3force]] — visx + d3-force; `.npmrc` React-19 workaround.
- [[2026-06-07-taste-skill-deferred-m5]] — taste-skill adopted at M5 (vendored).

## Verification
- Full M3→M4→M5 pipeline verified live with **real** Gemini analysis + 1536-dim embeddings,
  HNSW Red-Thread search, and dashboard aggregation. All pages rendered (screenshots).
- Crisis text → `/safety` redirect verified end-to-end. Graceful error on analysis failure
  (no fake data persisted).

## Open issues / next steps (post-MVP)
- **Auth** — reads resolve a single seed user; needed for multi-user.
- **Deploy** — Vercel + hosted Postgres/pgvector + env secrets.
- **Policy tension (open):** `contentEncrypted` (encrypted raw transcript) at rest vs
  POLICIES §1 — decide whether encrypted raw text is in scope for retention.
- Free-tier Gemini rate-limits under rapid use.
- Richer features: Integration Score, red-thread "related entries" UI, audio journaling UI.
- Owner may delete the temporary `docs/` export folder (gitignored).
