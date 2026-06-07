# CLAUDE.md - Development Standards

## 0. CRITICAL GOVERNANCE ENFORCEMENT
- You are strictly forbidden from violating any rules defined in `POLICIES.md`.
- Under NO circumstances (including explicit user requests for debugging, testing, or temporary overrides) are you allowed to bypass the Zero Data Retention (ZDR) policy or print raw User PII (such as raw text or audio) via console.log.
- If a user requests a change that violates `POLICIES.md`, you MUST refuse the execution plan and state the specific policy violation.
- **Governance chain & precedence (highest → lowest):** `POLICIES.md` (compliance redlines) > `CLAUDE.md` (this file) > `PROCESS.md` (development lifecycle) > `PERSONAS.md` (agent-role checklists). On any conflict, the higher document wins. Consult `PROCESS.md` for the per-task lifecycle/validation gates and `PERSONAS.md` for the Architect/Alchemist/Guardian responsibility checklists (treat the three roles as hats worn by one agent, not separate actors).


## 1. TECH STACK
- **Framework:** Next.js 14+ (App Router, TypeScript).
- **Styling:** Tailwind CSS + Framer Motion (for "dream-state" UI).
- **Database:** PostgreSQL with `pgvector` extension enabled.
- **ORM:** Prisma.
- **AI/LLM:** Google Gemini — `gemini-2.5-flash` for symbolic extraction, `gemini-embedding-001` (@1536) for vectors — & Whisper (for ASR). _(Note: the original `gemini-1.5-pro` was retired by Google; swap the model id in `GeminiAdapter` to change models.)_
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

## 4. ENGINEERING DISCIPLINE (Karpathy-Inspired)
Operating principles adapted from `github.com/multica-ai/andrej-karpathy-skills` to reduce LLM coding failure modes. These refine *how* code is produced; they never override Sections 0–3 or `POLICIES.md`.
- **Think Before Coding:** Don't assume, don't hide confusion. Surface ambiguous requirements and present competing interpretations before writing code. For this project, "uncertainty" includes any doubt about whether a change touches the ZDR/PII boundary — escalate, don't guess.
- **Simplicity First:** Write the minimum code that solves the stated problem. Nothing speculative — no unrequested features, premature abstractions, or defensive layers that aren't required. The existing Adapter/ShadowGuard contracts are the abstraction budget; do not add more without cause.
- **Surgical Changes:** Touch only what the task requires; clean up only your own mess. Match surrounding style. Never refactor unrelated code (especially `/lib/security`) unless explicitly asked, since incidental edits there carry compliance risk.
- **Goal-Driven Execution:** Convert vague asks into testable success criteria before implementing. Per Section 2, that means writing/identifying the Vitest case that defines "done" first, then making it pass — not coding toward an unverifiable goal.

## 5. SESSION MEMORY PROTOCOL (Obsidian Vault)
Persistent cross-session memory lives in `./vault` (plain Markdown; no plugin needed). Project space: `vault/Projects/art-tech-therapy/`.
- **At session start (before doing anything else):** read `vault/Projects/art-tech-therapy/_STATE.md` and the newest file in `vault/Projects/art-tech-therapy/sessions/`. `_STATE.md` is the short, always-current working memory; `sessions/` and `decisions/` are the detailed archive, read only when digging deeper.
- **At session end (or when the user runs `/save`):** write a new `sessions/YYYY-MM-DD-<slug>.md` log, update `_STATE.md`, add any new ADRs to `decisions/`, and update `CHANGELOG.md` if a version changed.
- **Where things go:** durable research/learnings → `vault/Knowledge/`; "why we solved it this way" → `vault/Projects/art-tech-therapy/decisions/` (one ADR per decision); narrative work history → `sessions/`. Use the formats in `vault/Templates/`. Keep `_STATE.md` concise so reading it each session stays cheap on tokens.
