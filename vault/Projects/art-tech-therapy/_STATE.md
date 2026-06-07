# Current State — art-tech-therapy
_Last updated: 2026-06-07 (session: encryption-hardening-vault-setup)_

## Current focus
Milestone 4 — "The Red Thread" (pgvector vector-similarity search). Not yet started;
next action is to draft the M4 implementation plan for approval.

## Progress / where things stand
- M1 Database ✅ — Prisma + Postgres, pgvector ext enabled. Schema has
  `JournalEntry.embedding vector(1536)` **declared but not yet populated**.
- M2 Hybrid ingestion ✅ — text + audio (Whisper ASR mock), ShadowGuard pre-check,
  ZDR purge of transient media in `finally`.
- M3 Pluggable AI ✅ — `IAIEngineAdapter` → `GeminiAdapter`, Zod-validated output,
  double medical-redline (prompt + `sanitizeClinicalTerms`).
- Security hardening ✅ (this session) — encryption now fail-fast on missing
  `ENCRYPTION_KEY`; `decrypt` throws instead of silently returning ciphertext.
- Tests: 13/13 passing; `tsc --noEmit` clean.

## Next steps
1. Draft M4 plan: `adapter.embed()`, HNSW index `idx_journal_entry_vector_hnsw`,
   `$queryRaw` similarity search, P95 < 150ms (per PERSONAS Guardian rules).
2. Fold timezone-from-`User.personaMask` fix into M4 (PROCESS Step 4.5; currently
   `UserSnapshot.recordedAt` defaults to server UTC).
3. Convert exported Google Docs → English Markdown in `vault/Knowledge/`. Owner will
   export the cloud docs into a temporary `docs/` folder; do the conversion once present.
   (See [[_migrated-from-google-docs]] for the list of originals.)

## Blockers / open questions
- Policy tension: ingest route persists `contentEncrypted` (encrypted raw transcript),
  but POLICIES.md §1 permits only `analysis_json` + `vector_rep` at rest. Decide whether
  encrypted raw text is in-scope for retention.
- vitest config loading hits an ESM/CJS bug (vitest 4 / vite); test env key set inline
  as a workaround.

## Key references
- [[2026-06-07-aes256gcm-failfast-key]] (decision)
- [[2026-06-07-encryption-hardening-vault-setup]] (session)
- Governance chain: POLICIES.md > CLAUDE.md > PROCESS.md > PERSONAS.md
- [[architecture-vision]] (migrated design doc)
