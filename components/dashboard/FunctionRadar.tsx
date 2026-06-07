"use client";

import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { motion } from "framer-motion";
import type { TFunctionRatios } from "@/lib/validations/dashboard";

const AXES: { key: keyof TFunctionRatios; label: string }[] = [
  { key: "thinking", label: "Thinking" },
  { key: "intuition", label: "Intuition" },
  { key: "feeling", label: "Feeling" },
  { key: "sensation", label: "Sensation" },
];

const SIZE = 280;
const MARGIN = 52;
const RINGS = [0.25, 0.5, 0.75, 1];

/**
 * A four-axis radar of the Jungian function balance (Thinking/Feeling/Sensation/Intuition),
 * each 0–1. Soft/minimalist; the value polygon eases in via Framer Motion.
 */
export function FunctionRadar({ functions }: { functions: TFunctionRatios }) {
  const radius = (SIZE - MARGIN * 2) / 2;
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const rScale = scaleLinear({ domain: [0, 1], range: [0, radius] });

  // Start each axis at the top (−90°) and go clockwise.
  const angleAt = (i: number) => (Math.PI * 2 * i) / AXES.length - Math.PI / 2;

  const points = AXES.map((axis, i) => {
    const angle = angleAt(i);
    const value = Math.max(0, Math.min(1, functions[axis.key]));
    const r = rScale(value);
    return [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r] as const;
  });
  const polygonPoints = points.map((p) => p.join(",")).join(" ");

  return (
    <svg width={SIZE} height={SIZE} role="img" aria-label="Psychological function balance radar">
      <Group>
        {RINGS.map((t) => (
          <circle
            key={t}
            cx={cx}
            cy={cy}
            r={rScale(t)}
            fill="none"
            className="stroke-slate-200 dark:stroke-slate-700"
            strokeWidth={1}
          />
        ))}

        {AXES.map((axis, i) => {
          const angle = angleAt(i);
          const ex = cx + Math.cos(angle) * radius;
          const ey = cy + Math.sin(angle) * radius;
          const lx = cx + Math.cos(angle) * (radius + 22);
          const ly = cy + Math.sin(angle) * (radius + 22);
          return (
            <g key={axis.key}>
              <line
                x1={cx}
                y1={cy}
                x2={ex}
                y2={ey}
                className="stroke-slate-200 dark:stroke-slate-700"
                strokeWidth={1}
              />
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={12}
                className="fill-slate-500 dark:fill-slate-400"
              >
                {axis.label}
              </text>
            </g>
          );
        })}

        <motion.polygon
          points={polygonPoints}
          className="fill-indigo-400/30 stroke-indigo-500 dark:fill-indigo-400/20 dark:stroke-indigo-300"
          strokeWidth={2}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />

        {points.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r={3} className="fill-indigo-500 dark:fill-indigo-300" />
        ))}
      </Group>
    </svg>
  );
}
