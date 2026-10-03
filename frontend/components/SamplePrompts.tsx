"use client";

import { useState } from "react";
import { SAMPLE_PROMPTS } from "@/lib/samples";
import PromptCard from "./PromptCard";
import clsx from "clsx";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "ambiguous", label: "Ambiguous" },
  { key: "clear", label: "Clear" },
] as const;

export default function SamplePrompts() {
  const [filter, setFilter] = useState<"all" | "ambiguous" | "clear">("all");

  const items = SAMPLE_PROMPTS.filter(
    (s) => filter === "all" || s.category === filter
  );

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Prompts you can try
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Copy any of these into the playground. Ambiguous ones trigger the
          clarification engine; clear ones go straight to SQL.
        </p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-8">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={clsx(
              "px-4 py-2 rounded-lg text-sm transition",
              filter === f.key
                ? "bg-brand-600 text-white"
                : "glass text-gray-400 hover:text-white"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((s) => (
          <PromptCard
            key={s.id}
            prompt={s.prompt}
            tag={s.tag}
            category={s.category}
          />
        ))}
      </div>
    </section>
  );
}