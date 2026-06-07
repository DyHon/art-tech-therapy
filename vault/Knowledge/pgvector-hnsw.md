# pgvector & HNSW (Milestone 4 reference)

- Source(s): pgvector docs; project schema `prisma/schema.prisma`; PERSONAS.md Guardian
  rules. Supersedes the cloud-only "HNSW index dùng để làm gì" Google Doc
  (see [[_migrated-from-google-docs]]).

## Summary
Reference for building "The Red Thread" — vector-similarity search over journal/dream
embeddings to surface recurring psychological motifs.

## Key points
- **Column:** `JournalEntry.embedding vector(1536)` is declared via Prisma
  `Unsupported("vector(1536)")`. Prisma can't bind `Unsupported` types, so reads/writes
  of the vector must use `prisma.$queryRaw` / `$executeRaw` with native SQL.
- **HNSW** (Hierarchical Navigable Small World) is an approximate-nearest-neighbor index.
  It makes similarity queries fast and is the index this project standardizes on:
  `idx_journal_entry_vector_hnsw`.
- **Distance operators:** `<->` L2, `<=>` cosine, `<#>` inner product. Match the operator
  to the embedding model's expected metric (cosine for most text-embedding models).
- **Guardian acceptance criteria (PERSONAS.md):**
  - Similarity search MUST use `$queryRaw` hitting the HNSW index — never
    `prisma.journalEntry.findMany`.
  - Fail review if a raw vector query is combined with un-indexed app-level filtering that
    forces a full table scan.
  - P95 latency for vector queries < 150 ms.
- **Interface Rule:** embedding generation flows through `IAIEngineAdapter` (e.g. add
  `embed(text): Promise<number[]>`), not a direct client call from a route.

## Related notes
- [[architecture-vision]]
- [[2026-06-07-pluggable-ai-adapter]]
