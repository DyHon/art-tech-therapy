# Adopt taste-skill for UI, deferred to M5 (stub)

- Date: 2026-06-07 (ADR authoring date)
- Status: proposed — **deferred to M5**; not adopted, no code changed. Owner to confirm at M5.

## Context
Researched `leonxlnx/taste-skill` (MIT, ~35.7k★) at owner request before M4. It is an
"anti-slop" frontend design skill (portable `SKILL.md` files, no runtime dep) whose default
targets Tailwind + Framer Motion + GSAP — our exact stack (CLAUDE.md §1) and the "dream-state"
UI goal. Full evaluation: [[taste-skill-frontend]]. We are currently mid-M4 (pgvector
backend, no UI surface), so there is no payoff to adopting now.

## Decision (proposed)
Park as a WATCH candidate; revisit at **M5 — "The Mirror" dashboard**. When adopted: vendor
only the `soft-skill` and/or `minimalist-skill` `SKILL.md` file(s) into the repo (not the full
`npx skills add` set), keep `MOTION_INTENSITY` low for a calming therapeutic tone, and use its
45-point pre-flight checklist as a UI design-review gate.

## Alternatives considered
- **Install now via `npx skills add`** — rejected; M4 has no UI surface and a full install
  pulls ~13 skills (review/dependency bloat, violates "Surgical Changes", CLAUDE.md §4).
- **Adopt the default `design-taste-frontend` variant** — rejected for a mental-health
  context; its aggressive/asymmetric default tone is wrong. Prefer `soft`/`minimalist`.
- **getdesign.md instead** (watch-list #4) — adjacent option; not mutually exclusive. Decide
  between/alongside taste-skill at M5.
- **Do nothing** — viable; our own pre-flight discipline already exists. Taste-skill adds a
  verifiable, stack-matched checklist on top.

## Consequences
- No change to the codebase or M4 plan now; `_STATE.md` carries a pointer for M5.
- At M5, this stub gets promoted to an accepted ADR (or rejected) once a variant is chosen.
- Compliance unaffected: presentation layer only; never touches `/lib/security` or ZDR/PII.
