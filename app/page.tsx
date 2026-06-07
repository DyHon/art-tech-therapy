import Link from "next/link";

const MODULES = [
  {
    name: "The Repository",
    body: "Write dreams and reflections — by text or voice. Each entry is read symbolically and kept private.",
  },
  {
    name: "The Alchemist",
    body: "A neutral mirror, grounded in Carl Jung's analytical psychology. It amplifies symbols and names archetypes — never diagnoses.",
  },
  {
    name: "The Constellation",
    body: "Your inner balance, psychic tension, and the archetypes you carry, visualized as they shift over time.",
  },
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col bg-gradient-to-b from-slate-50 to-indigo-50 text-slate-700 dark:from-slate-950 dark:to-slate-900 dark:text-slate-200">
      {/* Hero */}
      <section className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-6 py-24 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-800 sm:text-5xl dark:text-slate-100">
          Meet yourself in the mirror.
        </h1>
        <p className="max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          Art-Tech Therapy turns your dreams and reflections into a living map of the psyche —
          a Jungian journal that helps you understand, and slowly integrate, your own depths.
        </p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/journal"
            className="rounded-full bg-indigo-500 px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-600"
          >
            Begin a reflection
          </Link>
          <Link
            href="/dashboard"
            className="rounded-full bg-white/70 px-7 py-3 text-sm font-medium text-slate-700 ring-1 ring-slate-200 transition-colors hover:bg-white dark:bg-slate-900/50 dark:text-slate-200 dark:ring-slate-800"
          >
            See your constellation
          </Link>
        </div>
      </section>

      {/* Modules */}
      <section className="mx-auto grid w-full max-w-5xl gap-5 px-6 pb-20 sm:grid-cols-3">
        {MODULES.map((m) => (
          <div
            key={m.name}
            className="rounded-3xl bg-white/70 p-7 shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900/50 dark:ring-slate-800"
          >
            <h2 className="mb-2 text-lg font-medium text-slate-800 dark:text-slate-100">{m.name}</h2>
            <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{m.body}</p>
          </div>
        ))}
      </section>

      {/* Privacy + safety */}
      <section className="mx-auto w-full max-w-3xl px-6 pb-24 text-center">
        <p className="text-sm leading-7 text-slate-500 dark:text-slate-400">
          Privacy first: raw entries are analyzed and then purged — only encrypted insights
          remain. This is a tool for self-reflection, not medical care or diagnosis. If you are
          struggling,{" "}
          <Link href="/safety" className="text-indigo-600 underline-offset-2 hover:underline dark:text-indigo-300">
            support is here
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
