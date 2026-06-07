/**
 * Embedding dimensionality. Must match the `JournalEntry.embedding vector(1536)` column
 * and the embedding provider's configured output. Kept DB-free so non-database modules
 * (e.g. the AI adapter) can reference it without importing the Prisma layer.
 */
export const EMBEDDING_DIM = 1536;
