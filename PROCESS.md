# PROCESS.md - The Development Lifecycle

## STEP 1: DISCOVERY & ALIGNMENT
- Before coding, read `POLICIES.md` and `CLAUDE.md`.
- Identify any potential violations of the Zero Data Retention policy in the new task.

## STEP 2: PLANNING (Reasoning)
- Outline the logic flow (e.g., Audio -> Memory Buffer -> Whisper -> Gemini -> Vector -> DELETE RAW).
- Propose schema changes or API contract changes for review.

## STEP 3: ATOMIC IMPLEMENTATION
- Write code in small, testable chunks.
- Implement the "Shadow Guard" safety check *before* the main feature logic.

## STEP 4: MULTI-STAGE VALIDATION (The Guardian)
1. **Lint/Type Check:** Run `tsc`.
2. **Schema Audit:** Verify Prisma consistency.
3. **Safety Check:** Confirm that no `console.log` or file-write operations store PII.
4. **Unit Test:** Run Vitest/Jest for logic.
5. The Guardian must ensure all time-series snapshots explicitly compute and sync with the user's localized timezone metadata stored in User.personaMask, rather than blindly trusting server-side UTC execution.

## STEP 5: COMMIT & DOCUMENT
- Commit using Conventional Commits.
- Update `CLAUDE.md` if tech-stack or workflow instructions changed.
