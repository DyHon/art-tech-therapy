import { prisma } from "../prisma";
import { toVectorLiteral } from "./serialize";

/**
 * The Red Thread — pgvector similarity search over journal embeddings.
 *
 * GUARDIAN RULES (PERSONAS.md): vector search MUST go through `$queryRaw` against the
 * HNSW index `idx_journal_entry_vector_hnsw` using the cosine operator `<=>`. It must
 * NEVER use `prisma.journalEntry.findMany`, and must not force a full table scan.
 */

export { EMBEDDING_DIM } from "./constants";
export { toVectorLiteral };

export interface SimilarEntry {
  id: string;
  /** Cosine distance (0 = identical meaning, 2 = opposite). Lower is more similar. */
  distance: number;
}

/**
 * Persists an embedding onto a JournalEntry row. Prisma cannot bind the `Unsupported`
 * vector type, so we use a parameterized raw UPDATE with an explicit `::vector` cast.
 */
export async function persistEmbedding(entryId: string, vec: number[]): Promise<void> {
  const literal = toVectorLiteral(vec);
  await prisma.$executeRaw`
    UPDATE "JournalEntry" SET embedding = ${literal}::vector WHERE id = ${entryId}
  `;
}

/**
 * Finds the `k` most semantically similar past entries for a user. Uses the HNSW index
 * via the cosine operator. The source entry is excluded; rows without an embedding are
 * skipped.
 */
export async function findSimilarEntries(
  userId: string,
  vec: number[],
  k = 5,
  excludeEntryId = ""
): Promise<SimilarEntry[]> {
  const literal = toVectorLiteral(vec);
  return prisma.$queryRaw<SimilarEntry[]>`
    SELECT id, (embedding <=> ${literal}::vector) AS distance
    FROM "JournalEntry"
    WHERE "userId" = ${userId}
      AND embedding IS NOT NULL
      AND id <> ${excludeEntryId}
    ORDER BY embedding <=> ${literal}::vector
    LIMIT ${k}
  `;
}

/**
 * Reads an entry's stored embedding (and owner) back as a numeric vector. pgvector's text
 * form `[a,b,c]` is valid JSON, so we cast to text and parse. Returns null if the entry
 * has no embedding.
 */
export async function getEntryEmbedding(
  entryId: string
): Promise<{ userId: string; embedding: number[] } | null> {
  const rows = await prisma.$queryRaw<{ userId: string; embedding: string | null }[]>`
    SELECT "userId", embedding::text AS embedding FROM "JournalEntry" WHERE id = ${entryId}
  `;
  const row = rows[0];
  if (!row || !row.embedding) return null;
  return { userId: row.userId, embedding: JSON.parse(row.embedding) as number[] };
}

/**
 * Finds entries most similar to a given entry — the user-facing "Red Thread" lookup.
 * Scopes to the entry's owner and excludes the entry itself. Returns [] if the entry has
 * no embedding yet.
 */
export async function findRelatedEntries(entryId: string, k = 5): Promise<SimilarEntry[]> {
  const source = await getEntryEmbedding(entryId);
  if (!source) return [];
  return findSimilarEntries(source.userId, source.embedding, k, entryId);
}
