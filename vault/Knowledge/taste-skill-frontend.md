# taste-skill — anti-slop frontend design skill (evaluation)

- Source(s): https://github.com/leonxlnx/taste-skill (MIT, ~35.7k★, ©2026 Leonxlnx)
- Evaluated: 2026-06-07. Verdict: **adopt selectively, deferred to M5.** See ADR
  [[2026-06-07-taste-skill-deferred-m5]].
- Status: WATCH → evaluated. Not yet installed; research only.

## Summary
"The Anti-Slop Frontend Framework for AI Agents." A collection of portable `SKILL.md`
instruction files (no runtime library, no build step) that encode design discipline so
agent-generated UIs stop looking templated. Framework-agnostic by intent, but the default
skill explicitly targets **Tailwind + Framer Motion (`motion/react`) + GSAP/ScrollTrigger**
— i.e. our exact stack (CLAUDE.md §1, the "dream-state" UI goal). ~18,000 words of concrete,
checkable rules in the main skill.

## Key points
- **Contents:** ~13 skill variants — default `design-taste-frontend` (v2, experimental),
  `-v1` (stable), `gpt-taste`, `redesign-skill`, `soft-skill`, `minimalist-skill`,
  `brutalist-skill`, `stitch-skill`, `output-skill`, `image-to-code-skill`, and 3 image-gen
  skills (`imagegen-frontend-web/-mobile`, `brandkit`).
- **Three dials (1–10):** `DESIGN_VARIANCE` (clean→asymmetric), `MOTION_INTENSITY`
  (hover→scroll/magnetic), `VISUAL_DENSITY` (spacious→dense dashboards).
- **Concrete, verifiable rules** (not vibes): bans Inter-as-default + restricts serifs;
  max 1 accent color, saturation <80%; bans pure `#000`/`#fff`; WCAG AA contrast enforced;
  hero must fit viewport; 15 layout hard-fails (no 3-equal-col cards, zigzag cap, no empty
  bento cells); hard em-dash ban; `min-h-[100dvh]` not `h-screen`; bans
  `window.addEventListener('scroll')` in favor of GSAP ScrollTrigger; 45-point pre-flight
  checklist; 50+ "production-tested AI tells" to excise.
- **Security/footprint:** pure markdown + one trivial `skill.sh` (bash assoc-array path
  lookup — no network, no file writes, no exec; read & confirmed harmless). Install via
  `npx skills add <repo>` (Vercel Labs `skills` CLI) **or** just copy the `SKILL.md` files.

## Fit & caveats for this project
- **Strong fit:** directly serves the Tailwind + Framer Motion "dream-state" UI; its rules
  pair naturally with our pre-flight / Karpathy discipline (CLAUDE.md §4).
- **Right variant ≠ default:** the default tone is aggressive/modern-asymmetric. A
  mental-health / Jungian context wants calm + safe → use **`soft-skill`** ("polished, calm,
  expensive, softer contrast, whitespace") and/or **`minimalist-skill`**, with
  `MOTION_INTENSITY` kept low.
- **Timing:** zero UI surface in M4 (pgvector backend). Natural insertion point is **M5 —
  "The Mirror" dashboard** ([[roadmap-5-milestones]]).
- **Governance:** presentation-layer only (`/app`, `/components`) — does **not** touch
  `/lib/security`, `/lib/jungian`, or the ZDR/PII boundary, so low compliance risk. Our
  governance chain (CLAUDE.md §0) outranks any external skill; treat its opinionated rules
  (em-dash ban, palette bans) as a checklist to consult, not law.
- **Adoption preference:** **vendor** the 1–2 chosen `SKILL.md` files into the repo rather
  than `npx skills add` the whole set — keeps dependency/review surface minimal (CLAUDE.md §4
  "Surgical Changes").

## Related notes
- [[2026-06-07-taste-skill-deferred-m5]] (ADR stub)
- [[watch-list-tools-to-evaluate]] (sibling candidate: getdesign.md, #4)
- [[roadmap-5-milestones]] · [[architecture-vision]] · [[_STATE]]
