"use client";

import { useMemo } from "react";
import {
  forceSimulation,
  forceManyBody,
  forceCenter,
  forceCollide,
  type SimulationNodeDatum,
} from "d3-force";
import { scaleLinear } from "@visx/scale";
import { motion } from "framer-motion";
import type { TArchetypeSummary } from "@/lib/validations/dashboard";

const WIDTH = 600;
const HEIGHT = 360;
const LABEL_PAD = 18;

/** Shorten long archetype names so adjacent labels don't collide; full name in <title>. */
const truncate = (s: string, max = 18) => (s.length > max ? `${s.slice(0, max - 1)}…` : s);

interface ConstellationNode extends SimulationNodeDatum {
  archetype: string;
  count: number;
  integratedRatio: number;
  avgIntensity: number;
  r: number;
}

/** A node after layout, with resolved coordinates. */
interface PositionedNode extends ConstellationNode {
  x: number;
  y: number;
}

/**
 * A force-directed "constellation" of the user's archetypes. Node size = how often the
 * archetype appears; brightness/glow = how integrated it is (dim = unintegrated, still
 * calling for attention). The layout is computed deterministically (d3-force, fixed ticks)
 * and eased in with Framer Motion. No edges yet — co-occurrence links are a future pass.
 */
export function ArchetypeConstellation({ archetypes }: { archetypes: TArchetypeSummary[] }) {
  const nodes = useMemo<PositionedNode[]>(() => {
    if (archetypes.length === 0) return [];

    const maxCount = Math.max(2, ...archetypes.map((a) => a.count));
    const rScale = scaleLinear({ domain: [1, maxCount], range: [18, 46] });

    const sim: ConstellationNode[] = archetypes.map((a) => ({
      archetype: a.archetype,
      count: a.count,
      integratedRatio: a.integratedRatio,
      avgIntensity: a.avgIntensity,
      r: rScale(a.count),
    }));

    const simulation = forceSimulation<ConstellationNode>(sim)
      .force("charge", forceManyBody<ConstellationNode>().strength(-50))
      .force("center", forceCenter(WIDTH / 2, HEIGHT / 2))
      .force("collide", forceCollide<ConstellationNode>().radius((d) => d.r + 10))
      .stop();

    for (let i = 0; i < 300; i++) simulation.tick();

    // Clamp inside the viewport, leaving room for labels below each node.
    return sim.map((n) => ({
      ...n,
      x: Math.max(n.r, Math.min(WIDTH - n.r, n.x ?? WIDTH / 2)),
      y: Math.max(n.r, Math.min(HEIGHT - n.r - LABEL_PAD, n.y ?? HEIGHT / 2)),
    }));
  }, [archetypes]);

  if (nodes.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-slate-400">
        Archetypes will gather here as the Alchemist reads your reflections.
      </p>
    );
  }

  return (
    <svg width="100%" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label="Archetype constellation">
      {nodes.map((n, i) => {
        const fillOpacity = 0.18 + 0.55 * n.integratedRatio;
        const glowOpacity = 0.08 + 0.32 * n.integratedRatio;
        return (
          <motion.g
            key={n.archetype}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06, duration: 0.6, ease: "easeOut" }}
            style={{ transformOrigin: `${n.x}px ${n.y}px` }}
          >
            <title>{`${n.archetype} · seen ${n.count}×`}</title>
            {/* soft glow */}
            <circle cx={n.x} cy={n.y} r={n.r + 8} className="fill-indigo-400" fillOpacity={glowOpacity} />
            {/* node */}
            <circle
              cx={n.x}
              cy={n.y}
              r={n.r}
              className="fill-indigo-400 stroke-indigo-400 dark:stroke-indigo-300"
              fillOpacity={fillOpacity}
              strokeWidth={1.5}
            />
            {/* count */}
            <text
              x={n.x}
              y={n.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={13}
              className="fill-slate-700 dark:fill-slate-100"
              fontWeight={600}
            >
              {n.count}
            </text>
            {/* label below */}
            <text
              x={n.x}
              y={n.y + n.r + 12}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={11}
              className="fill-slate-500 dark:fill-slate-400"
            >
              {truncate(n.archetype)}
            </text>
          </motion.g>
        );
      })}
    </svg>
  );
}
