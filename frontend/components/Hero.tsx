import Link from "next/link";
import { ArrowRight, Sparkles, MessageSquare, Code2, CheckCircle2 } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative grid-bg overflow-hidden">
      {/* glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-32 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-gray-300 mb-8 animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse" />
          Powered by Groq · FastAPI · PostgreSQL
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 animate-slide-up">
          Ask in English.
          <br />
          <span className="gradient-text">Get SQL that actually</span>
          <br />
          answers the question.
        </h1>

        <p className="max-w-2xl mx-auto text-lg text-gray-400 mb-10 animate-slide-up">
          IntentSQL detects ambiguous questions, asks the right clarifying
          question, then generates SQL and returns a real answer — no
          hallucinated metrics.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <Link
            href="/playground"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-accent-500 text-white font-medium hover:opacity-90 transition shadow-lg shadow-brand-600/20"
          >
            <Sparkles className="w-4 h-4" />
            Open Playground
          </Link>
          <Link
            href="/schema"
            className="flex items-center gap-2 px-6 py-3 rounded-xl glass text-white font-medium hover:bg-white/5 transition"
          >
            Explore Schema
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Flow pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm animate-fade-in">
          {[
            { icon: MessageSquare, label: "Ask" },
            { icon: Sparkles, label: "Detect ambiguity" },
            { icon: CheckCircle2, label: "Clarify" },
            { icon: Code2, label: "Generate SQL" },
          ].map(({ icon: Icon, label }, i, arr) => (
            <div key={label} className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass text-gray-300">
                <Icon className="w-3.5 h-3.5 text-brand-400" />
                {label}
              </div>
              {i < arr.length - 1 && (
                <ArrowRight className="w-3 h-3 text-gray-600" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}