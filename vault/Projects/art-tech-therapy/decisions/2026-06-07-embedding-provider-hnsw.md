# Embedding provider (Gemini @1536 via @google/genai) + HNSW cosine index

- Date: 2026-06-07
- Status: accepted

## Context
Milestone 4 ("The Red Thread") needs to vectorize journal entries and run similarity
search. Two sub-decisions: (a) which embedding model fills the `JournalEntry.embedding
vector(1536)` column, and (b) how the vector index is built. Findings during planning:
- The installed `@google/generative-ai` SDK's `EmbedContentRequest` has **no
  `outputDimensionality`** field, so it cannot produce 1536-dim vectors (only native 768
  for `text-embedding-004` / 3072 for `gemini-embedding-001`).
- Despite the M1 commit message claiming a "custom HNSW index", the M1 migration created
  **no vector index at all** — only the column.
- The embedding model only *vectorizes* (no interpretation), but it still *reads the raw
  journal text*, making the provider a PII data processor.

## Decision
- **Provider:** Gemini `gemini-embedding-001` with `outputDimensionality: 1536`, via the
  newer **`@google/genai`** SDK (added as a dependency). Rationale: keeps a *single* vendor
  (Google) touching user text — Gemini already does the analysis — minimizing the number
  of third parties that receive PII, consistent with the privacy-first / ZDR posture.
- **Index:** new migration creates `idx_journal_entry_vector_hnsw` using
  `hnsw (embedding vector_cosine_ops)`. All vector queries go through `prisma.$queryRaw`
  with the cosine operator `<=>` (Guardian rule); `findMany` is never used for search.
- **Interface Rule:** embedding generation is exposed as `IAIEngineAdapter.embed()` and
  called only through the adapter, never a direct client in the route.
- **Decoupling:** `EMBEDDING_DIM` and `toVectorLiteral` live in DB-free modules
  (`lib/vector/constants.ts`, `lib/vector/serialize.ts`) so the adapter and tests don't
  transitively import Prisma.

## Alternatives considered
- **OpenAI `text-embedding-3-small` @1536** (already installed) — rejected: adds a *second*
  vendor that receives journal text, weakening the privacy surface.
- **Gemini `text-embedding-004` @768 + re-migrate column to vector(768)** — rejected:
  deviates from the documented 1536 design; chosen path keeps 1536.
- **Pad/truncate a native-dim vector to 1536** — rejected: corrupts cosine semantics.

## Consequences
- New runtime dependency `@google/genai`.
- Schema gains `UserSnapshot.timezone` (PROCESS 4.5) and the HNSW index (migration
  `20260607120000_m4_red_thread`). **Must be applied** with `prisma migrate deploy` once
  the Docker Postgres is up.
- The live embedding call cannot be unit-tested offline; tests use a deterministic mock.
  A **real-key smoke test** is still needed to confirm the live 1536-dim response.
- 23/23 Vitest pass; `tsc --noEmit` clean.
