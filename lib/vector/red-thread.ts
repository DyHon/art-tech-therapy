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
