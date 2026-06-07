# Watch List — tools/repos to evaluate for integration

- Source(s): user-curated, added 2026-06-07. External links below.
- Status: **WATCH / evaluate** — none adopted yet. Candidates to consider implementing,
  integrating, or using in the art-tech-therapy application or its dev harness.

## Summary
A running shortlist of third-party repositories and products worth evaluating. Each entry
notes what it is and the plausible angle for *this* project. Nothing here is a commitment;
promote an item to a [[decisions]] ADR before actually adopting it.

## Candidates

### 1. Headroom — context compression for LLM agents
- Link: https://github.com/chopratejas/headroom
- **What:** Context-compression tool that shrinks tool outputs, logs, RAG chunks, files,
  and conversation history by 60–95% before they reach the model. Ships as a library, a
  proxy, or an MCP server. Reversible (originals retrievable on demand). Python/Rust/TS.
- **Angle for us:** Could cut token cost on the Gemini analytical pipeline and on large
  context passed to coding agents. ⚠️ Compliance gate: any compression layer that touches
  journal/dream content sits on the **ZDR/PII boundary** — must not retain or log raw text.
  Evaluate against POLICIES.md before any pipeline use.

### 2. ECC — agent harness / skills + memory system
- Link: https://github.com/affaan-m/ECC
- **What:** Large agent-harness system (64 agents, 261 skills, hooks/rules) for Claude
  Code, Cursor, Codex, etc. Emphasizes skills, persistent memory, security checks, and
  research-first development. Installable plugin + rule system.
- **Angle for us:** Dev-tooling, not app code. Compare its memory/skills approach against
  our existing Obsidian vault protocol ([[architecture-vision]], session-memory protocol in
  CLAUDE.md §5) — cherry-pick patterns rather than adopt wholesale.

### 3. Harness (revfactory) — agent-team factory for Claude Code
- Link: https://github.com/revfactory/harness
- **What:** Claude Code plugin that generates specialized agent teams + skills from a domain
  description, using six architecture patterns (Pipeline, Fan-out/Fan-in, Expert Pool,
  Producer-Reviewer, Supervisor, Hierarchical Delegation). Claims +60% avg quality.
- **Angle for us:** Dev-tooling. Could scaffold the Architect/Alchemist/Guardian roles
  (PERSONAS.md) into a more formal agent team. Evaluate vs. the single-agent-wearing-hats
  model we currently use.

### 4. getdesign.md — DESIGN.md analyses of real design systems
- Link: https://getdesign.md/
- **What:** Curated, machine-readable analyses of 72 production design systems (Stripe,
  Apple, Claude, Spotify, etc.) — patterns, tokens, rules — meant to help AI agents produce
  higher-quality UIs.
- **Angle for us:** Directly relevant to the Tailwind + Framer Motion "dream-state" UI
  (CLAUDE.md §1). Could seed a DESIGN.md for the front end to make agent-generated UI more
  consistent. Lowest compliance risk of the four (presentation layer only).

### 5. taste-skill — anti-slop frontend design skill ✅ evaluated
- Link: https://github.com/leonxlnx/taste-skill
- **What:** ~13 portable `SKILL.md` design-discipline files (no runtime dep) that stop
  agent-generated UIs looking templated. Default targets Tailwind + Framer Motion + GSAP.
- **Angle for us:** Directly serves the "dream-state" UI (CLAUDE.md §1). **Evaluated
  2026-06-07 → adopt selectively, deferred to M5** (use `soft`/`minimalist` variant, low
  motion, vendor the file rather than full CLI install). Full note: [[taste-skill-frontend]];
  decision: [[2026-06-07-taste-skill-deferred-m5]]. Sibling of #4 (getdesign.md) — decide
  between/alongside at M5.

## Next action
- (Owner) triage which, if any, to spike. Headroom and getdesign.md are the two with the
  clearest fit; ECC and Harness overlap with tooling we already have. taste-skill (#5) is
  triaged: parked for M5.

## Related notes
- [[architecture-vision]]
- [[_STATE]]
