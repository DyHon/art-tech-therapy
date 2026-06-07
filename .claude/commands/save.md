---
description: Persist this session into the Obsidian memory vault (session log, _STATE, ADRs, CHANGELOG)
---

Perform the "session end" memory steps for this project. The vault is plain Markdown at
`./vault`; project space is `vault/Projects/art-tech-therapy/`. Use your normal file
tools — no MCP/plugin needed. Follow the formats in `vault/Templates/`.

Do all of the following:

1. **Write a new session log** at
   `vault/Projects/art-tech-therapy/sessions/YYYY-MM-DD-<slug>.md` using
   `vault/Templates/session.md`. `<slug>` = a few words describing this session's focus.
   Fill in: Summary, What changed (files / areas), Decisions made (link to any
   `decisions/` files), Open issues / next steps. Base it on what actually happened this
   session — do not invent work.

2. **Update `_STATE.md`** at `vault/Projects/art-tech-therapy/_STATE.md`:
   - Refresh the `_Last updated: <date> (session: <slug>)_` line.
   - Rewrite Current focus / Progress / Next steps / Blockers to reflect reality NOW.
   - Keep it short — it is read at the start of every session and must stay token-cheap.
   - Update Key references with links to the new session log and any new ADRs.

3. **Add ADRs** for any significant technical decision made this session, one file per
   decision at `vault/Projects/art-tech-therapy/decisions/YYYY-MM-DD-<slug>.md` using
   `vault/Templates/decision.md`. Capture Context, Decision, Alternatives considered,
   Consequences. If you reconstruct a decision from code rather than from the session,
   mark it clearly as "inferred, please verify".

4. **Update `CHANGELOG.md`** at `vault/Projects/art-tech-therapy/CHANGELOG.md` (Keep a
   Changelog format) ONLY if something changed: add entries under `[Unreleased]`, or cut a
   new versioned section if a version was released this session.

5. **Report** a short bullet list of exactly which vault files you created or modified.

Today's date is available in the environment context — use it for `<date>` (YYYY-MM-DD).
Do not commit or push unless the user explicitly asks.
