# Dashboard charting: visx + d3-force (with a React-19 peer workaround)

- Date: 2026-06-07
- Status: accepted

## Context
The Constellation dashboard (M5) needs a function radar, a time-series trend, and a
force-directed archetype graph. The project runs React 19; several chart libraries declare
peer-dependency ranges that predate it.

## Decision
- Use **visx** (`@visx/group|scale|shape|axis|curve`) for the Radar and the Tension/Shadow
  trend, composed with Framer Motion. Use **d3-force** for the archetype constellation
  layout (deterministic fixed-tick simulation, rendered as SVG).
- Add `.npmrc` with `legacy-peer-deps=true` so `npm install` succeeds on a fresh clone
  despite visx's stale React peer range (visx is render-only and React-19-safe at runtime).

## Alternatives considered
- **Recharts** — fastest for radar/line, but no true force-directed network (the
  constellation would degrade to a bubble view).
- **Raw D3** — most powerful, but imperative DOM manipulation fights React.
- **`--legacy-peer-deps` / `--force` per install** — rejected in favour of committing
  `.npmrc` so installs are reproducible for anyone cloning the public repo.

## Consequences
- An authentic force-directed constellation plus clean radar/trend, all dark-mode + soft.
- `.npmrc` suppresses peer-dep checks repo-wide — acceptable for an early-React-19 project;
  revisit once these deps bump their peer ranges.
