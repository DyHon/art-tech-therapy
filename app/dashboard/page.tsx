import type { Metadata } from "next";
import { resolveCurrentUserId } from "@/lib/user/current-user";
import { getSnapshotSeries } from "@/lib/dashboard/queries";
import { FunctionRadar } from "@/components/dashboard/FunctionRadar";

// Reads live DB state per request — never prerender at build time.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your Constellation",
  description: "A map of your inner balance, drawn from your reflections.",
};

export default async function DashboardPage() {
  const userId = await resolveCurrentUserId();
  const snapshots = userId ? await getSnapshotSeries(userId) : [];
  const latest = snapshots.at(-1);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-indigo-50 px-6 py-16 text-slate-700 dark:from-slate-950 dark:to-slate-900 dark:text-slate-200">
      <div className="mx-auto flex max-w-4xl flex-col gap-10">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-800 dark:text-slate-100">
            The Constellation
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            A map of your inner balance, drawn from your reflections.
          </p>
        </header>

        {!latest ? (
          <EmptyState />
        ) : (
          <section className="rounded-3xl bg-white/70 p-8 shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900/50 dark:ring-slate-800">
            <h2 className="text-lg font-medium text-slate-700 dark:text-slate-200">Function balance</h2>
            <p className="mb-6 text-sm text-slate-400">
              From your most recent reflection · {new Date(latest.recordedAt).toLocaleDateString()}
            </p>
            <div className="flex flex-col items-center gap-10 sm:flex-row sm:justify-around">
              <FunctionRadar functions={latest.functions} />
              <dl className="grid grid-cols-1 gap-y-3 text-sm sm:min-w-48">
                <Stat label="Thinking" value={latest.functions.thinking} />
                <Stat label="Feeling" value={latest.functions.feeling} />
                <Stat label="Sensation" value={latest.functions.sensation} />
                <Stat label="Intuition" value={latest.functions.intuition} />
                <div className="my-1 border-t border-slate-200/70 dark:border-slate-800" />
                <Stat label="Psychic tension" value={latest.tensionIndex} />
                <Stat label="Shadow awareness" value={latest.shadowScore} />
              </dl>
            </div>
            <p className="mt-6 text-xs text-slate-400">
              {snapshots.length} reflection{snapshots.length === 1 ? "" : "s"} recorded · timezone {latest.timezone}
            </p>
          </section>
        )}
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-6">
      <dt className="text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="font-medium tabular-nums text-slate-700 dark:text-slate-200">
        {(value * 100).toFixed(0)}%
      </dd>
    </div>
  );
}

function EmptyState() {
  return (
    <section className="rounded-3xl border border-dashed border-slate-300 bg-white/40 p-16 text-center dark:border-slate-700 dark:bg-slate-900/30">
      <p className="leading-7 text-slate-500 dark:text-slate-400">
        No reflections yet. Your constellation will appear here as you journal — each entry
        adds a point to the map of your psyche.
      </p>
    </section>
  );
}
