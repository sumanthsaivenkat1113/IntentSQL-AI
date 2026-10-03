"use client";

import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SCHEMA } from "@/lib/schema";

type Table = (typeof SCHEMA)[number];

// parent -> child (one parent row has many child rows)
const RELATIONS: [string, string][] = [
  ["categories", "products"],
  ["products", "order_items"],
  ["order_items", "orders"],
  ["customers", "orders"],
  ["orders", "payments"],
  ["orders", "refunds"],
  ["customers", "customer_visits"],
  ["customers", "reviews"],
  ["products", "reviews"],
  ["customers", "customer_support_tickets"],
];

export default function SchemaPage() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string>(SCHEMA[0].name);

  const filtered = useMemo(
    () =>
      SCHEMA.filter((t: Table) =>
        t.name.toLowerCase().includes(query.trim().toLowerCase())
      ),
    [query]
  );

  const table = SCHEMA.find((t: Table) => t.name === selected) ?? SCHEMA[0];

  const parents = RELATIONS.filter(([, child]) => child === table.name).map(
    ([parent]) => parent
  );
  const children = RELATIONS.filter(([parent]) => parent === table.name).map(
    ([, child]) => child
  );

  const RelLink = ({ name }: { name: string }) => (
    <button
      onClick={() => {
        setSelected(name);
        setQuery("");
      }}
      className="font-mono text-sm px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-200 hover:border-brand-500/50 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500 transition"
    >
      {name}
    </button>
  );

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-16">
        <header className="mb-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Database schema
          </h1>
          <p className="text-gray-400">
            {SCHEMA.length} tables covering customers, orders, products,
            payments, refunds, visits, reviews, and support tickets. Pick a
            table to see its columns and how it connects to the others.
          </p>
        </header>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8 items-start">
          {/* Table picker */}
          <aside className="lg:sticky lg:top-24 rounded-2xl glass p-3">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tables"
              aria-label="Search tables"
              className="w-full mb-3 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-brand-500/60"
            />
            <nav
              aria-label="Tables"
              className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible"
            >
              {filtered.map((t: Table) => {
                const active = t.name === table.name;
                return (
                  <button
                    key={t.name}
                    onClick={() => setSelected(t.name)}
                    aria-current={active ? "true" : undefined}
                    className={`shrink-0 flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500 ${
                      active
                        ? "bg-brand-500/15 text-white border border-brand-500/30"
                        : "text-gray-400 hover:bg-white/5 hover:text-gray-200 border border-transparent"
                    }`}
                  >
                    <span className="text-lg">{t.icon}</span>
                    <span className="font-mono text-sm flex-1">{t.name}</span>
                    <span className="text-xs text-gray-500">
                      {t.columns.length}
                    </span>
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <p className="px-3 py-4 text-sm text-gray-500">
                  No table matches &ldquo;{query}&rdquo;.
                </p>
              )}
            </nav>
          </aside>

          {/* Detail */}
          <section className="rounded-2xl glass overflow-hidden">
            <div className="p-6 border-b border-white/5 flex items-start gap-4">
              <span className="text-3xl">{table.icon}</span>
              <div>
                <h2 className="font-mono text-2xl text-white">{table.name}</h2>
                <p className="text-sm text-gray-400 mt-1 max-w-xl">
                  {table.description}
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 p-6 border-b border-white/5">
              <div>
                <h3 className="text-sm text-gray-400 mb-3">Belongs to</h3>
                <div className="flex flex-wrap gap-2">
                  {parents.length ? (
                    parents.map((p) => <RelLink key={p} name={p} />)
                  ) : (
                    <span className="text-sm text-gray-500">
                      Top-level table
                    </span>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-sm text-gray-400 mb-3">Has many</h3>
                <div className="flex flex-wrap gap-2">
                  {children.length ? (
                    children.map((c) => <RelLink key={c} name={c} />)
                  ) : (
                    <span className="text-sm text-gray-500">
                      No dependent tables
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-white/5">
                    <th className="px-6 py-3 font-medium">Column</th>
                    <th className="px-6 py-3 font-medium">Type</th>
                    <th className="px-6 py-3 font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {table.columns.map((c) => (
                    <tr key={c.name} className="hover:bg-white/5 transition">
                      <td className="px-6 py-3 font-mono text-gray-100">
                        {c.name}
                      </td>
                      <td className="px-6 py-3 font-mono text-gray-400">
                        {c.type}
                      </td>
                      <td className="px-6 py-3">
                        {c.note && (
                          <span className="text-xs px-2 py-0.5 rounded bg-brand-500/10 text-brand-300 border border-brand-500/20">
                            {c.note}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}