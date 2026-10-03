import Link from "next/link";
import { Sparkles } from "lucide-react";
import { SiGithub } from 'react-icons/si';
export default function CTASection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="relative overflow-hidden rounded-3xl glass p-12 md:p-16 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 via-transparent to-accent-500/20" />
        <div className="relative">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ready to ask better questions?
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-10">
            Open the playground, paste any of the sample prompts, and watch
            IntentSQL clarify, generate, and answer.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/playground"
              className="group flex items-center gap-2 px-6 py-3 rounded-xl
             bg-gradient-to-r from-brand-500 to-accent-500
             text-white font-semibold
             shadow-lg shadow-brand-500/20
             hover:shadow-brand-500/40
             hover:-translate-y-0.5
             transition-all duration-200"
            >
              <Sparkles className="w-4 h-4 transition-transform group-hover:rotate-12" />
              Open Playground
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-xl glass text-white font-medium hover:bg-white/5 transition"
            >
              <SiGithub className="w-4 h-4" />
              View Source
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}