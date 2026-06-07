# 2026-06-07 — Onboarding, encryption hardening, memory vault, docs migration, Milestone 4

_One continuous session covering several threads; logged together._

## Summary
Onboarded to the project and ingested the governance substrate (POLICIES / CLAUDE /
PROCESS / PERSONAS), verifying Milestones 1–3 against the actual code rather than trusting
the "audited" claim. Established a governance precedence chain and added Karpathy-inspired
engineering discipline to CLAUDE.md. Fixed two real encryption weaknesses. Stood up an
Obsidian vault as cross-session memory and migrated/translated the project's Vietnamese
Google Docs into English Knowledge notes. Then planned and implemented **Milestone 4 (The
Red Thread)** core, and verified it live against the real Gemini API.

## What changed (files / areas)
**Governance**
- `CLAUDE.md` — §0 precedence chain (POLICIES > CLAUDE > PROCESS > PERSONAS), §4
  Engineering Discipline (Karpathy), §5 Session Memory Protocol.

**Security hardening**
- `lib/security/encryption.ts` — fail-fast on missing `ENCRYPTION_KEY` (removed public
  fallback key); `decrypt` throws on malformed/forged input instead of returning ciphertext.
- `tests/milestone3.test.ts` — +3 cases (tamper/malformed/missing-key) + inline test key.
- `.env` — added gitignored dev `ENCRYPTION_KEY` (and later `GEMINI_API_KEY`).

**Memory vault**
- `vault/` — Templates, `_STATE.md`, CHANGELOG, ADRs, sessions, Knowledge.
- `.claude/commands/save.md` — `/save` session-end command.
- `.gitignore` — ignore `vault/.obsidian/` and the temp `/docs/` export.

**Docs migration**
- Translated 9 Vietnamese Google Docs (`.docx`) → English `vault/Knowledge/` notes
  (feasibility report, 5-milestone roadmap, data models, rationale notes); rewrote the
  conversion index.

**Milestone 4 — The Red Thread (core)**
- `lib/ai/adapter.interface.ts` / `lib/ai/adapters/gemini.adapter.ts` — `embed()` (Gemini
  `gemini-embedding-001` @1536 via `@google/genai`; deterministic mock in test mode).
- `lib/vector/constants.ts`, `lib/vector/serialize.ts`, `lib/vector/red-thread.ts` —
  `EMBEDDING_DIM`, `toVectorLiteral`, `persistEmbedding`, `findSimilarEntries`
  (`$queryRaw` cosine over the HNSW index; never `findMany`).
- `lib/timezone.ts` + `prisma` — `getUserTimezone` and `UserSnapshot.timezone` (PROCESS 4.5).
- `prisma/migrations/20260607120000_m4_red_thread/migration.sql` — HNSW index
  `idx_journal_entry_vector_hnsw` + `UserSnapshot.timezone`. **Applied** by owner.
- `app/api/journal/ingest/route.ts` — embed + persist before the ZDR purge; localized tz.
- `tests/milestone4.test.ts` — +10 cases. Added `@google/genai` dependency.

## Decisions made
- [[2026-06-07-aes256gcm-failfast-key]] — encryption fail-fast + decrypt-throws.
- [[2026-06-07-pluggable-ai-adapter]] — adapter pattern (owner-confirmed: swap LLM freely).
- [[2026-06-07-immutable-usersnapshot]] (inferred) — append-only snapshot time-series.
- [[2026-06-07-embedding-provider-hnsw]] — Gemini @1536 via `@google/genai` + HNSW cosine.

## Verification
- 23/23 Vitest pass; `tsc --noEmit` clean; `prisma validate` clean; no PII in logs.
- Migration applied to Docker Postgres. Live Gemini embedding smoke test returned a
  **1536-dim** vector — M4 confirmed end-to-end (the `AQ.`-prefixed AI Studio key is valid).

## Open issues / next steps
- Start **Milestone 5 (The Mirror)**: Constellation dashboard + full ShadowGuard crisis
  redirect.
- Deferred M4 follow-ons: red-thread API endpoint, archetype Integration Score, and
  filtered-ANN performance as data grows.
- Unresolved policy tension: encrypted raw transcript (`contentEncrypted`) at rest vs
  POLICIES §1.
- Owner may delete the temporary `docs/` export folder (gitignored).
- Latest commits not yet pushed; three owner-authored vault notes (taste-skill / watch-list)
  remain uncommitted by request.
