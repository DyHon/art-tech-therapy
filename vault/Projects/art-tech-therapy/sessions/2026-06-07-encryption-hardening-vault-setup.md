# 2026-06-07 — Encryption hardening + Obsidian memory vault setup

## Summary
Two threads of work. (1) Onboarded to the project, ingested the governance substrate
(POLICIES/CLAUDE/PROCESS/PERSONAS), verified Milestones 1–3 against the actual code
(13/13 tests pass), and established a governance precedence chain. (2) Fixed two real
security weaknesses in the encryption layer. (3) Stood up this Obsidian vault as
cross-session memory.

## What changed (files / areas)
- `lib/security/encryption.ts` — fail-fast on missing `ENCRYPTION_KEY` (no more public
  fallback key); `decrypt` throws on malformed/forged input instead of returning the
  input unchanged; removed the error-path `console.error`.
- `tests/milestone3.test.ts` — added 3 cases (tampered-tag throws, malformed input
  throws, missing-key throws) + an inline test-only key.
- `.env` — added a gitignored local dev `ENCRYPTION_KEY`.
- `CLAUDE.md` — added §4 Engineering Discipline (Karpathy) and a governance precedence
  note in §0; (pending) §5 Session Memory Protocol.
- `vault/` — created the memory vault (this file, `_STATE.md`, CHANGELOG, ADRs,
  Knowledge, Templates).
- `.claude/commands/save.md` — new `/save` slash command.

## Decisions made
- [[2026-06-07-aes256gcm-failfast-key]] — encryption fail-fast + decrypt-throws.
- [[2026-06-07-pluggable-ai-adapter]] (inferred) — Adapter Pattern for LLM isolation.
- [[2026-06-07-immutable-usersnapshot]] (inferred) — append-only snapshot time-series.

## Open issues / next steps
- Draft the Milestone 4 (pgvector / Red Thread) implementation plan.
- Resolve the `contentEncrypted` vs ZDR §1 retention question.
- Decide whether to remove the `docs/` repo symlink after migration (Drive originals
  stay untouched regardless).
- Commit pending changes (user wants the repo public).
