import { MessageSquare, Search, CheckCircle2, Code2, FileText } from "lucide-react";

const STEPS = [
  {
    icon: MessageSquare,
    label: "User asks",
    color: "text-blue-400",
    body: (
      <p className="font-mono text-sm text-gray-200">
        &ldquo;Show me last month&apos;s best customers.&rdquo;
      </p>
    ),
  },
  {
    icon: Search,
    label: "is_ambiguous",
    color: "text-amber-400",
    body: (
      <span className="inline-flex items-center gap-2 px-2 py-1 rounded bg-amber-500/10 text-amber-300 text-xs border border-amber-500/20">
        true
      </span>
    ),
  },
  {
    icon: CheckCircle2,
    label: "Clarify",
    color: "text-emerald-400",
    body: (
      <div className="space-y-1.5 text-sm">
        {[
          "Highest total revenue",
          "Most orders placed",
          "Most repeat visits",
          "Highest lifetime value",
        ].map((o) => (
          <div
            key={o}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-white/5 text-gray-300 text-xs"
          >
            <span className="w-3 h-3 rounded-full border border-gray-500" />
            {o}
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: Code2,
    label: "SQL",
    color: "text-brand-400",
    body: (
      <pre className="text-[11px] font-mono text-gray-300 leading-relaxed whitespace-pre-wrap">
{`SELECT c.first_name,
       c.last_name,
       SUM(o.total_amount) AS revenue
FROM customers c
JOIN orders o
  ON o.customer_id = c.customer_id
WHERE o.status = 'completed'
  AND o.order_date >=
      date_trunc('month', CURRENT_DATE
        - INTERVAL '1 month')
GROUP BY 1, 2
ORDER BY revenue DESC
LIMIT 100;`}
      </pre>
    ),
  },
  {
    icon: FileText,
    label: "Report",
    color: "text-cyan-400",
    body: (
      <p className="text-xs text-gray-300 leading-relaxed">
        Last month, the top revenue-generating customer was{" "}
        <span className="text-white font-medium">Priya Sharma</span> with{" "}
        <span className="text-emerald-400">₹1,24,500</span> across 18 completed
        orders. The top 5 customers accounted for 31% of monthly revenue.
      </p>
    ),
  },
];

export default function ExampleFlow() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          One question, end to end
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Watch the clarification engine turn an ambiguous prompt into a
          well-defined query and a real answer.
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-4">
        {STEPS.map(({ icon: Icon, label, color, body }, i) => (
          <div
            key={label}
            className="relative p-5 rounded-2xl glass flex flex-col"
          >
            <div className="flex items-center gap-2 mb-4">
              <Icon className={`w-4 h-4 ${color}`} />
              <span className="text-xs uppercase tracking-wider text-gray-400">
                {label}
              </span>
            </div>
            <div className="flex-1">{body}</div>

            {i < STEPS.length - 1 && (
              <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-px bg-gradient-to-r from-brand-500/50 to-transparent" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}