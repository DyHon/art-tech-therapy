"use client";

import { Group } from "@visx/group";
import { scaleTime, scaleLinear } from "@visx/scale";
import { LinePath } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { curveMonotoneX } from "@visx/curve";
import { motion } from "framer-motion";

interface TrendPoint {
  recordedAt: string;
  tensionIndex: number;
  shadowScore: number;
}

const WIDTH = 560;
const HEIGHT = 240;
const MARGIN = { top: 16, right: 16, bottom: 28, left: 36 };
const AXIS_COLOR = "#94a3b8"; // slate-400 — legible in light and dark

const SERIES = [
  { key: "tensionIndex" as const, label: "Psychic tension", color: "#fb7185" }, // rose-400
  { key: "shadowScore" as const, label: "Shadow awareness", color: "#818cf8" }, // indigo-400
];

/**
 * A line chart of psychic tension and shadow awareness over time (each 0–1). Soft and
 * minimal; lines ease in via Framer Motion. Needs at least two snapshots to draw a trend.
 */
export function TensionTrend({ points }: { points: TrendPoint[] }) {
  if (points.length < 2) {
    return (
      <p className="py-10 text-center text-sm text-slate-400">
        Your tension and shadow trend will appear once you have a few reflections.
      </p>
    );
  }

  const innerW = WIDTH - MARGIN.left - MARGIN.right;
  const innerH = HEIGHT - MARGIN.top - MARGIN.bottom;

  const dates = points.map((p) => new Date(p.recordedAt));
  const xScale = scaleTime({
    domain: [dates[0], dates[dates.length - 1]],
    range: [0, innerW],
  });
  const yScale = scaleLinear({ domain: [0, 1], range: [innerH, 0] });

  // When every reflection is on the same day, label ticks by time instead of date.
  const spanMs = dates[dates.length - 1].getTime() - dates[0].getTime();
  const sameDay = spanMs < 24 * 60 * 60 * 1000;

  const xOf = (p: TrendPoint) => xScale(new Date(p.recordedAt));

  return (
    <div className="flex flex-col gap-3">
      <svg width="100%" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label="Tension and shadow over time">
        <Group left={MARGIN.left} top={MARGIN.top}>
          {[0, 0.5, 1].map((t) => (
            <line
              key={t}
              x1={0}
              x2={innerW}
              y1={yScale(t)}
              y2={yScale(t)}
              className="stroke-slate-200 dark:stroke-slate-700"
              strokeWidth={1}
            />
          ))}

          {SERIES.map((s) => (
            <motion.g key={s.key} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
              <LinePath<TrendPoint>
                data={points}
                x={xOf}
                y={(p) => yScale(p[s.key])}
                stroke={s.color}
                strokeWidth={2.5}
                curve={curveMonotoneX}
              />
              {points.map((p, i) => (
                <circle key={i} cx={xOf(p)} cy={yScale(p[s.key])} r={3} fill={s.color} />
              ))}
            </motion.g>
          ))}

          <AxisLeft
            scale={yScale}
            numTicks={3}
            tickFormat={(v) => `${Math.round(Number(v) * 100)}%`}
            stroke={AXIS_COLOR}
            tickStroke={AXIS_COLOR}
            tickLabelProps={() => ({ fill: AXIS_COLOR, fontSize: 10, textAnchor: "end", dx: -4, dy: 3 })}
          />
          <AxisBottom
            top={innerH}
            scale={xScale}
            numTicks={Math.min(points.length, 5)}
            tickFormat={(v) =>
              sameDay
                ? new Date(v as Date).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
                : new Date(v as Date).toLocaleDateString(undefined, { month: "short", day: "numeric" })
            }
            stroke={AXIS_COLOR}
            tickStroke={AXIS_COLOR}
            tickLabelProps={() => ({ fill: AXIS_COLOR, fontSize: 10, textAnchor: "middle" })}
          />
        </Group>
      </svg>

      <div className="flex justify-center gap-6">
        {SERIES.map((s) => (
          <span key={s.key} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-block h-2 w-3 rounded-full" style={{ backgroundColor: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}
