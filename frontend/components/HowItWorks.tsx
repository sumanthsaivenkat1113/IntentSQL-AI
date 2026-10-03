import { MessageSquare, Search, CheckCircle2, Code2, FileText } from "lucide-react";

const STEPS = [
  {
    icon: MessageSquare,
    title: "Ask",
    desc: "Type your question in plain English. No SQL, no schema knowledge required.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Search,
    title: "Detect ambiguity",
    desc: "An LLM checks if the question has multiple valid interpretations against the schema.",
    color: "from-amber-500 to-amber-600",
  },
  {
    icon: CheckCircle2,
    title: "Clarify",
    desc: "If ambiguous, IntentSQL asks one focused question with concrete, schema-grounded options.",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    icon: Code2,
    title: "Generate SQL",
    desc: "A read-only PostgreSQL query is generated with correct joins, filters, and limits.",
    color: "from-brand-500 to-brand-600",
  },
  {
    icon: FileText,
    title: "Answer",
    desc: "The query runs against PostgreSQL and an LLM writes a concise, data-backed report.",
    color: "from-cyan-500 to-cyan-600",
  },
];

export default function HowItWorks() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          How IntentSQL works
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          A five-stage pipeline that turns ambiguous English into accurate SQL.
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-4">
        {STEPS.map(({ icon: Icon, title, desc, color }, i) => (
          <div
            key={title}
            className="relative p-5 rounded-2xl glass hover:border-brand-500/30 transition-all group"
          >
            <div className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-ink-900 border border-white/10 flex items-center justify-center text-xs font-mono text-gray-400">
              {i + 1}
            </div>

            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
            >
              <Icon className="w-5 h-5 text-white" />
            </div>

            <h3 className="font-semibold text-white mb-2">{title}</h3>
            <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}