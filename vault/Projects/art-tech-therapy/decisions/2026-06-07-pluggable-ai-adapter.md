# Isolate LLM access behind a pluggable AI engine adapter

- Date: 2026-06-07 (ADR authoring date)
- Status: accepted
- Owner confirmation: 2026-06-07 — motivation confirmed by the project owner (below);
  this ADR is no longer "inferred".

## Context
The project owner wants the freedom to swap the LLM used to analyze user data at will —
to use whichever model/provider is best at any time (for quality, cost, or privacy), and
to never be locked to a single vendor (Gemini today). Calling a vendor SDK directly from
API routes would couple the BFF controllers to one provider and make swapping or mocking
hard. CLAUDE.md §3 also mandates isolating AI operations behind an adapter, and tests need
a deterministic substitute for the network.

## Decision
Define `IAIEngineAdapter` (`lib/ai/adapter.interface.ts`) with `analyze(text)` returning a
Zod-validated `TJungianAnalysis`. Concrete vendors (`GeminiAdapter`) implement it; routes
depend only on the interface. The adapter also self-mocks in test/missing-key mode.

## Alternatives considered
- **Direct `@google/generative-ai` calls in routes** — rejected; vendor lock-in, no
  seam for tests, violates the Interface Rule.
- **A generic LLM SDK wrapper (e.g. LangChain)** — rejected/unused; heavier dependency
  than the narrow contract this project needs.

## Consequences
- Provider can be swapped or mocked behind one interface (proven by the Scenario D test).
- M4 should extend this same interface (e.g. `embed(text)`) rather than calling an
  embedding client directly from routes.
