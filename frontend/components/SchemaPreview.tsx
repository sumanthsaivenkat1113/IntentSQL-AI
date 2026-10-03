import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SCHEMA } from "@/lib/schema";

export default function SchemaPreview() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
            10 tables. Real relationships.
          </h2>
          <p className="text-gray-400 max-w-2xl">
            A realistic e-commerce schema with customers, orders, payments,
            refunds, visits, reviews, and support tickets — designed to have
            genuinely ambiguous questions.
          </p>
        </div>
        <Link
          href="/schema"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass text-white text-sm hover:bg-white/5 transition"
        >
          Full schema
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {SCHEMA.map((t) => (
          <div
            key={t.name}
            className="p-4 rounded-xl glass hover:border-brand-500/30 transition group"
          >
            <div className="text-2xl mb-2">{t.icon}</div>
            <div className="font-mono text-sm text-white mb-1 truncate">
              {t.name}
            </div>
            <div className="text-[11px] text-gray-500">
              {t.columns.length} columns
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}