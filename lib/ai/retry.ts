/**
 * Small, pure helpers for retrying transient LLM API failures. Kept separate so the
 * retry policy is unit-testable without the SDK.
 */

/** HTTP statuses worth retrying — transient server/rate-limit conditions. */
const RETRYABLE_STATUSES = new Set<number>([429, 500, 503]);

/** Extracts a numeric HTTP status from an unknown error, if one is present. */
export function errorStatus(error: unknown): number | undefined {
  if (error && typeof error === "object" && "status" in error) {
    const status = (error as { status?: unknown }).status;
    if (typeof status === "number") return status;
  }
  return undefined;
}

/** True if a status code represents a transient failure worth retrying. */
export function isRetryableStatus(status: number | undefined): boolean {
  return status !== undefined && RETRYABLE_STATUSES.has(status);
}

/** Exponential backoff in ms: 500, 1000, 2000, … */
export function backoffMs(attempt: number, baseMs = 500): number {
  return baseMs * 2 ** (attempt - 1);
}
