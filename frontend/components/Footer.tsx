import { Database } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Database className="w-4 h-4 text-brand-400" />
          <span>
            Intent<span className="gradient-text font-semibold">SQL</span> — Text to SQL with a Clarification Engine
          </span>
        </div>
        <div className="text-xs text-gray-600">
          Built with FastAPI · Groq · PostgreSQL · Next.js
        </div>
      </div>
    </footer>
  );
}