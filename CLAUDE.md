# CLAUDE.md - Development Standards

## 1. TECH STACK
- **Framework:** Next.js 14+ (App Router, TypeScript).
- **Styling:** Tailwind CSS + Framer Motion (for "dream-state" UI).
- **Database:** PostgreSQL with `pgvector` extension enabled.
- **ORM:** Prisma.
- **AI/LLM:** Google Gemini 1.5 Pro (for symbolic extraction) & Whisper (for ASR).
- **Validation:** Zod (mandatory for all API payloads and AI outputs).

## 2. WORKFLOW & ARCHITECTURE
- **Pattern:** Backend-for-Frontend (BFF) pattern within Next.js Server Actions.
- **Testing:** Vitest for unit tests; Playwright for E2E.
- **Commits:** Atomic commits following Conventional Commits (feat, fix, refactor, docs).
- **Folder Structure:** 
  - `/app` (Routes & UI)
  - `/lib/jungian` (Analytical Logic)
  - `/lib/security` (Encryption & PII scrubbing)
  - `/lib/vector` (Embedding logic)
  - `/components` (Shared UI)

## 3. CODING RULES
- No `any` type in TypeScript.
- Every API endpoint must have a Zod schema validation.
- All database queries must be handled via Prisma with proper error boundaries.
- **Privacy Rule:** Enforce Zero Raw Data Retention. Wipe raw audio/text from memory immediately post-vectorization. Never write raw journals to unencrypted application logs.
- **Architecture Rule:** Isolate AI operations using the Adapter Pattern. Backend controllers must only interact with the `AnalyticalEngineAdapter` interface.
- **State Rule:** Treat psychological tags as immutable time-series data. State updates must create a new `UserSnapshot` instead of overwriting history.
- **Safety Rule:** Inject `ShadowGuard` middleware at the entry point of all analytical pipelines to intercept crisis sentiment before LLM ingestion.
