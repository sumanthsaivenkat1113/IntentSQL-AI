"use client";

import Link from "next/link";
import { Database, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/schema", label: "Schema" },
  { href: "/playground", label: "Playground" },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
            <Database className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-white tracking-tight">
            Intent<span className="gradient-text">SQL</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={clsx(
                "px-4 py-2 rounded-lg text-sm transition-colors",
                pathname === l.href
                  ? "text-white bg-white/5"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <Link
          href="/playground"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-brand-600 to-accent-500 text-white text-sm font-medium hover:opacity-90 transition"
        >
          <Sparkles className="w-4 h-4" />
          Try it
        </Link>
      </div>
    </nav>
  );
}