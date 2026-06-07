"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * A slow, soft "breathing" circle for grounding — 4s in / 4s hold / 4s out (12s cycle).
 * Respects prefers-reduced-motion: when the user opts out of motion, the circle is static
 * and only the text cues remain. Soft/minimalist, low-intensity by design (mental-health
 * context — calming, never stimulating).
 */
export function BreathingGuide() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex flex-col items-center gap-5 py-2">
      <div className="relative flex h-44 w-44 items-center justify-center">
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-200/70 to-indigo-200/70 dark:from-sky-900/40 dark:to-indigo-900/40"
          animate={
            reduceMotion
              ? { scale: 1, opacity: 0.7 }
              : { scale: [1, 1.35, 1.35, 1], opacity: [0.55, 0.9, 0.9, 0.55] }
          }
          transition={
            reduceMotion
              ? undefined
              : { duration: 12, times: [0, 0.34, 0.66, 1], repeat: Infinity, ease: "easeInOut" }
          }
        />
        <span className="z-10 text-sm font-medium text-slate-600 dark:text-slate-300">
          breathe
        </span>
      </div>
      <p className="text-center text-sm leading-6 text-slate-500 dark:text-slate-400">
        Breathe in slowly… hold… and let it go.
        <br />
        Follow the circle for a minute. There's no rush.
      </p>
    </div>
  );
}
