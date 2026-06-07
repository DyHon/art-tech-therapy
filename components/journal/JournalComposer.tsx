"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { TJungianAnalysis } from "@/lib/validations/analysis";

const ENTRY_TYPES = [
  { value: "REFLECTION", label: "Reflection" },
  { value: "DREAM", label: "Dream" },
  { value: "ACTIVE_IMAGINATION", label: "Active imagination" },
  { value: "CINEMATIC_RESPONSE", label: "Cinematic response" },
] as const;

type EntryType = (typeof ENTRY_TYPES)[number]["value"];
type Status = "idle" | "loading" | "done" | "error";

const MAX_CHARS = 5000;

export function JournalComposer() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [entryType, setEntryType] = useState<EntryType>("REFLECTION");
  const [status, setStatus] = useState<Status>("idle");
  const [analysis, setAnalysis] = useState<TJungianAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || status === "loading") return;
    setStatus("loading");
    setError(null);

    try {
      const res = await fetch("/api/journal/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, entryType }),
      });
      const data = await res.json();

      // ShadowGuard intercepted a crisis signal — leave analysis behind, go to safety.
      if (data?.crisis_flag || data?.redirect === "/safety") {
        router.push("/safety");
        return;
      }
      if (!res.ok) {
        setError("The Alchemist couldn't complete this reflection. Please try again in a moment.");
        setStatus("error");
        return;
      }
      setAnalysis(data.analysis as TJungianAnalysis);
      setStatus("done");
    } catch {
      setError("Couldn't reach the Alchemist. Check your connection and try again.");
      setStatus("error");
    }
  }

  function reset() {
    setContent("");
    setAnalysis(null);
    setError(null);
    setStatus("idle");
  }

  if (status === "done" && analysis) {
    return <MirrorReflection analysis={analysis} onWriteAnother={reset} />;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {ENTRY_TYPES.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setEntryType(t.value)}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              entryType === t.value
                ? "bg-indigo-500 text-white"
                : "bg-white/70 text-slate-600 ring-1 ring-slate-200 hover:bg-white dark:bg-slate-800/60 dark:text-slate-300 dark:ring-slate-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value.slice(0, MAX_CHARS))}
          placeholder="Write freely. There is no wrong way to begin…"
          rows={10}
          className="w-full resize-none rounded-2xl bg-white/70 p-5 text-slate-700 shadow-sm ring-1 ring-slate-200/70 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-300 dark:bg-slate-900/50 dark:text-slate-200 dark:ring-slate-800"
        />
        <span className="absolute bottom-3 right-4 text-xs text-slate-400">
          {content.length}/{MAX_CHARS}
        </span>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-sm text-rose-600 dark:text-rose-300"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <Link href="/dashboard" className="text-sm text-slate-500 underline-offset-2 hover:underline dark:text-slate-400">
          Your constellation →
        </Link>
        <button
          type="submit"
          disabled={!content.trim() || status === "loading"}
          className="rounded-full bg-indigo-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "loading" ? "The Alchemist is contemplating…" : "Hold up the mirror"}
        </button>
      </div>
    </form>
  );
}

function MirrorReflection({
  analysis,
  onWriteAnother,
}: {
  analysis: TJungianAnalysis;
  onWriteAnother: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col gap-6"
    >
      <div className="rounded-2xl bg-white/70 p-6 shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900/50 dark:ring-slate-800">
        <h2 className="mb-3 text-lg font-medium text-slate-700 dark:text-slate-200">What the mirror reflects</h2>
        <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
          <span className="text-slate-400">Conscious emphasis — </span>
          {analysis.compensation_dynamic.conscious_imbalance}
        </p>
        <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
          <span className="text-slate-400">The unconscious compensates — </span>
          {analysis.compensation_dynamic.compensatory_intent}
        </p>
      </div>

      {analysis.archetypal_mappings.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Archetypes present</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.archetypal_mappings.map((a, i) => (
              <span
                key={i}
                className="rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700 ring-1 ring-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-200 dark:ring-indigo-900"
              >
                {a.archetype} · {a.intensity}/10
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <button onClick={onWriteAnother} className="text-sm text-slate-500 underline-offset-2 hover:underline dark:text-slate-400">
          ← Write another
        </button>
        <Link
          href="/dashboard"
          className="rounded-full bg-indigo-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-600"
        >
          See your constellation
        </Link>
      </div>
    </motion.div>
  );
}
