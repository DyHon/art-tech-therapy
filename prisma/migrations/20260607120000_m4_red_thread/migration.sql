-- Milestone 4: The Red Thread (vector search) + localized snapshot timezone.

-- 1) Localized timezone metadata for time-series snapshots (PROCESS.md Step 4.5):
--    record the user's IANA timezone so the dashboard buckets by local day, not server UTC.
ALTER TABLE "UserSnapshot" ADD COLUMN "timezone" TEXT NOT NULL DEFAULT 'UTC';

-- 2) HNSW index for approximate-nearest-neighbour cosine search over journal embeddings.
--    Required by THE GUARDIAN; vector queries must hit this index via $queryRaw using `<=>`.
CREATE INDEX IF NOT EXISTS "idx_journal_entry_vector_hnsw"
  ON "JournalEntry" USING hnsw (embedding vector_cosine_ops);
