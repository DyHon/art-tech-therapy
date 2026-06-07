import type { Metadata } from "next";
import { crisisResources, EMERGENCY_NOTE } from "@/lib/safety/crisis-resources";
import { BreathingGuide } from "@/components/safety/BreathingGuide";

export const metadata: Metadata = {
  title: "You are not alone",
  description: "Immediate support resources and a moment to steady yourself.",
};

const GROUNDING_STEPS = [
  "5 things you can see",
  "4 things you can touch",
  "3 things you can hear",
  "2 things you can smell",
  "1 thing you can taste",
];

export default function SafetyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-sky-50 px-6 py-16 text-slate-700 dark:from-slate-950 dark:to-slate-900 dark:text-slate-200">
      <div className="mx-auto flex max-w-2xl flex-col gap-10">
        {/* Reassurance, not analysis */}
        <header className="flex flex-col gap-3 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-800 dark:text-slate-100">
            You are not alone.
          </h1>
          <p className="text-base leading-7 text-slate-600 dark:text-slate-300">
            It sounds like you may be going through something painful right now. We've paused
            the reflection here — what matters most is your safety. Please take a slow breath,
            and reach out to someone who can help.
          </p>
        </header>

        {/* Immediate-danger callout */}
        <section
          role="alert"
          className="rounded-2xl border border-rose-200 bg-rose-50/80 px-6 py-5 text-sm leading-6 text-rose-900 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-100"
        >
          {EMERGENCY_NOTE}
        </section>

        {/* Grounding */}
        <section className="rounded-2xl bg-white/70 px-6 py-8 shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900/50 dark:ring-slate-800">
          <h2 className="mb-6 text-center text-lg font-medium text-slate-700 dark:text-slate-200">
            A moment to steady yourself
          </h2>
          <BreathingGuide />
          <div className="mt-8 border-t border-slate-200/70 pt-6 dark:border-slate-800">
            <p className="mb-3 text-sm font-medium text-slate-600 dark:text-slate-300">
              Or try the 5-4-3-2-1 grounding exercise — gently name:
            </p>
            <ul className="flex flex-col gap-2">
              {GROUNDING_STEPS.map((step) => (
                <li
                  key={step}
                  className="rounded-lg bg-slate-50 px-4 py-2 text-sm text-slate-600 dark:bg-slate-800/50 dark:text-slate-300"
                >
                  {step}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Resources */}
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-medium text-slate-700 dark:text-slate-200">
            People who want to help
          </h2>
          <ul className="flex flex-col gap-3">
            {crisisResources.map((r) => (
              <li
                key={`${r.region}-${r.name}`}
                className="rounded-2xl bg-white/70 px-5 py-4 ring-1 ring-slate-200/70 dark:bg-slate-900/50 dark:ring-slate-800"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-medium text-slate-800 dark:text-slate-100">{r.name}</span>
                  <span className="text-xs uppercase tracking-wide text-slate-400">{r.region}</span>
                </div>
                <div className="mt-1 text-sm">
                  {r.href ? (
                    <a
                      href={r.href}
                      target={r.href.startsWith("http") ? "_blank" : undefined}
                      rel={r.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="font-medium text-indigo-600 underline-offset-2 hover:underline dark:text-indigo-300"
                    >
                      {r.contact}
                    </a>
                  ) : (
                    <span className="font-medium text-slate-700 dark:text-slate-200">{r.contact}</span>
                  )}
                  {r.available ? <span className="text-slate-400"> · {r.available}</span> : null}
                </div>
                {r.note ? (
                  <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{r.note}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>

        <footer className="pb-6 text-center text-xs leading-5 text-slate-400">
          This space does not provide medical care or diagnosis. If you can, tell someone you
          trust how you're feeling. You matter.
        </footer>
      </div>
    </main>
  );
}
