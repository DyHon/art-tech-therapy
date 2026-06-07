/**
 * Serializes a numeric embedding into a pgvector literal, e.g. `[0.1,0.2,...]`.
 * Pure and DB-free. Throws on empty or non-finite input so a corrupt vector never
 * reaches the database.
 */
export function toVectorLiteral(vec: number[]): string {
  if (!Array.isArray(vec) || vec.length === 0) {
    throw new Error("Cannot serialize an empty embedding to a pgvector literal.");
  }
  const parts = vec.map((n) => {
    if (!Number.isFinite(n)) {
      throw new Error("Embedding contains a non-finite value; refusing to serialize.");
    }
    return n;
  });
  return `[${parts.join(",")}]`;
}
