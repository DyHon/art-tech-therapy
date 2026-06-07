import type { Metadata } from "next";
import { JournalComposer } from "@/components/journal/JournalComposer";

export const metadata: Metadata = {
  title: "The Mirror — write a reflection",
  description: "Write a dream or reflection and let the Alchemist hold up the mirror.",
};

export default function JournalPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-indigo-50 px-6 py-16 text-slate-700 dark:from-slate-950 dark:to-slate-900 dark:text-slate-200">
      <div className="mx-auto flex max-w-2xl flex-col gap-8">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-800 dark:text-slate-100">
            The Mirror
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Write a dream or a reflection. The Alchemist will read it symbolically — never
            literally, never clinically — and reflect it back.
          </p>
        </header>
        <JournalComposer />
      </div>
    </main>
  );
}
