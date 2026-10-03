"use client";

import { useState } from "react";
import { Check, Copy, Sparkles, Search } from "lucide-react";
import clsx from "clsx";

type Props = {
  prompt: string;
  tag: string;
  category: "ambiguous" | "clear";
};

export default function PromptCard({ prompt, tag, category }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="group p-4 rounded-xl glass hover:border-brand-500/30 transition-all">
      <div className="flex items-start justify-between gap-3 mb-3">
        <span
          className={clsx(
            "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-medium uppercase tracking-wider",
            category === "ambiguous"
              ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
              : "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
          )}
        >
          {category === "ambiguous" ? (
            <><Search className="w-2.5 h-2.5" /> Ambiguous</>
          ) : (
            <><Sparkles className="w-2.5 h-2.5" /> Clear</>
          )}
        </span>
        <button
          onClick={copy}
          className="opacity-0 group-hover:opacity-100 transition text-gray-500 hover:text-white"
          aria-label="Copy prompt"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      <p className="text-sm text-gray-200 leading-relaxed mb-3">{prompt}</p>

      <div className="text-[11px] text-gray-500 font-mono">#{tag}</div>
    </div>
  );
}