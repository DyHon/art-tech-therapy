# Model psychological state as an append-only UserSnapshot time-series

> ⚠️ **Inferred from code — please verify.** Reconstructed from the Prisma schema and
> CLAUDE.md §3 State Rule, not from a recorded decision.

- Date: 2026-06-07 (ADR authoring date)
- Status: accepted

## Context
A user's Jungian "functions" distribution, tension index, and shadow score evolve over
time. The Constellation feature visualizes the Individuation Process *as a trajectory*,
which requires history, not just a latest value. CLAUDE.md §3 State Rule forbids
overwriting psychological state.

## Decision
Each analysis writes a **new** `UserSnapshot` row (`psychologicalFunctions` JSONB,
`tensionIndex`, `shadowScore`, `recordedAt`) instead of mutating prior state. Snapshots
are immutable, append-only, and indexed by `(userId, recordedAt)`.

## Alternatives considered
- **Mutable per-user state column** — rejected; destroys the history the Constellation
  needs and violates the State Rule.
- **Event-sourced log replayed on read** — rejected as over-engineered for current needs;
  a snapshot row per entry is sufficient.

## Consequences
- Full time-series available for charting and trend analysis.
- **Open issue:** `recordedAt` defaults to server UTC, conflicting with PROCESS Step 4.5
  (compute localized time from `User.personaMask`). To be addressed in Milestone 4.
