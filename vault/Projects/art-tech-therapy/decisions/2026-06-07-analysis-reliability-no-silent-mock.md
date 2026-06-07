# Surface analysis failures (retry transient, no silent mock); fix retired model

- Date: 2026-06-07
- Status: accepted

## Context
During the end-to-end demo, ingestion looked healthy (200 OK) but was silently returning
**mock** analysis. Two causes: (1) the configured `gemini-1.5-pro` had been retired by
Google (404), and (2) `GeminiAdapter.analyze` caught *any* error and fell back to the mock
parser — so a 404 *and* transient 503s both persisted fabricated analysis as if genuine.
For a psychological-analysis product, storing fake analysis is a correctness/trust failure
(the same silent-fallback anti-pattern fixed earlier in encryption).

## Decision
- Update the analysis model to `gemini-2.5-flash` (embeddings already use
  `gemini-embedding-001`).
- `analyze()` retries transient errors (429/500/503) with exponential backoff (pure helpers
  in `lib/ai/retry.ts`) and, on a real or exhausted failure, **throws** — the route returns
  an error instead of persisting mock. The deterministic mock remains ONLY for the explicit
  no-API-key path (tests / local dev).

## Alternatives considered
- **Keep the silent mock fallback** — rejected; hides failures and corrupts the record.
- **Persist with a "degraded / analysis_failed" flag** — deferred; needs schema work.
  Failing loudly (no row) is simpler and safe for now.
- **Retry indefinitely** — rejected; bounded retries (3) avoid hanging the request.

## Consequences
- Real failures surface (ingest 500 + graceful UI error); fake data is never stored.
- Free-tier Gemini rate limits can cause failures under rapid use — space out or upgrade.
- Retry helpers are unit-tested; CLAUDE.md model reference updated; verified live (real
  Jungian analysis once not rate-limited).
