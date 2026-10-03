"use client";

import { useState } from "react";
import {
  Loader2,
  Search,
  CheckCircle2,
  Code2,
  FileText,
  AlertCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import clsx from "clsx";
import { api } from "@/lib/api";
import { SAMPLE_PROMPTS } from "@/lib/samples";
import { parseClarification } from "@/lib/parseOptions";

type Stage =
  | "idle"
  | "checking"
  | "awaiting_clarification"
  | "generating"
  | "answering"
  | "done";

const CUSTOM_VALUE = "__custom__";

export default function PlaygroundClient() {
  // Input
  const [prompt, setPrompt] = useState("Show me last month's best customers.");

  // Pipeline
  const [stage, setStage] = useState<Stage>("idle");
  const [isAmbiguous, setIsAmbiguous] = useState<boolean | null>(null);

  // Clarification
  const [clarificationQuestion, setClarificationQuestion] = useState("");
  const [clarificationOptions, setClarificationOptions] = useState<string[]>([]);
  const [clarificationFallback, setClarificationFallback] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [customAnswer, setCustomAnswer] = useState("");

  // Results
  const [refinedPrompt, setRefinedPrompt] = useState("");
  const [sql, setSql] = useState("");
  const [report, setReport] = useState("");
  const [error, setError] = useState("");

  const reset = () => {
    setStage("idle");
    setIsAmbiguous(null);
    setClarificationQuestion("");
    setClarificationOptions([]);
    setClarificationFallback(false);
    setSelectedOption(null);
    setCustomAnswer("");
    setRefinedPrompt("");
    setSql("");
    setReport("");
    setError("");
  };

  // ---------- Step 1: user clicks Run ----------
  const run = async () => {
    reset();
    setError("");
    try {
      setStage("checking");
      const amb = await api.isAmbiguous(prompt);
      setIsAmbiguous(amb.is_ambiguous);

      if (amb.is_ambiguous) {
        const clar = await api.clarify(prompt);
        const parsed = parseClarification(clar.Clarification);
        setClarificationQuestion(parsed.question);
        setClarificationOptions(parsed.options);
        setClarificationFallback(parsed.fallback);
        setStage("awaiting_clarification");
      } else {
        await generateAndAnswer(prompt);
      }
    } catch (e: any) {
      setError(e?.message || "Something went wrong");
      setStage("idle");
    }
  };

  // ---------- Step 2: user picks an option and continues ----------
  const continueWithChoice = async () => {
    const chosen =
      selectedOption === CUSTOM_VALUE
        ? customAnswer.trim()
        : selectedOption?.trim() || "";

    if (!chosen) return;
    setError("");

    const refined = `${prompt.trim()} Clarification: ${chosen}.`;
    setRefinedPrompt(refined);

    try {
      await generateAndAnswer(refined);
    } catch (e: any) {
      setError(e?.message || "Something went wrong");
      setStage("awaiting_clarification");
    }
  };

  // ---------- Shared: generate SQL + answer ----------
  const generateAndAnswer = async (promptForLLM: string) => {
    setStage("generating");
    const gen = await api.generateSql(promptForLLM);
    setSql(gen.SQL_Query);

    setStage("answering");
    const ans = await api.answer(promptForLLM, gen.SQL_Query);
    setReport(ans.report);

    setStage("done");
  };

  const busy =
    stage === "checking" || stage === "generating" || stage === "answering";
  const awaiting = stage === "awaiting_clarification";

  // Whether the Continue button should be enabled
  const canContinue = awaiting
    ? selectedOption === CUSTOM_VALUE
      ? customAnswer.trim().length > 0
      : !!selectedOption
    : false;

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      {/* -------- LEFT — Input -------- */}
      <div className="lg:col-span-2 space-y-4">
        <div className="p-5 rounded-2xl glass">
          <label className="text-xs uppercase tracking-wider text-gray-400 mb-2 block">
            Your question
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={busy || awaiting}
            rows={4}
            className="w-full bg-ink-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white resize-none focus:outline-none focus:border-brand-500/50 disabled:opacity-60"
            placeholder="Ask anything about customers, orders, revenue..."
          />

          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={run}
              disabled={busy || awaiting || !prompt.trim()}
              className={clsx(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition",
                busy || awaiting || !prompt.trim()
                  ? "bg-white/5 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-brand-600 to-accent-500 text-white hover:opacity-90"
              )}
            >
              {busy ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {busy ? "Running..." : "Run IntentSQL"}
            </button>
            <button
              onClick={reset}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass text-sm text-gray-300 hover:bg-white/5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>

        {/* Sample prompts */}
        <div className="p-5 rounded-2xl glass">
          <div className="text-xs uppercase tracking-wider text-gray-400 mb-3">
            Try a sample
          </div>
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {SAMPLE_PROMPTS.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  reset();
                  setPrompt(s.prompt);
                }}
                disabled={busy || awaiting}
                className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 transition disabled:opacity-50"
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={clsx(
                      "text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider",
                      s.category === "ambiguous"
                        ? "bg-amber-500/10 text-amber-300"
                        : "bg-emerald-500/10 text-emerald-300"
                    )}
                  >
                    {s.category}
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono">
                    #{s.tag}
                  </span>
                </div>
                <div className="text-xs text-gray-300 leading-snug">
                  {s.prompt}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* -------- RIGHT — Pipeline -------- */}
      <div className="lg:col-span-3 space-y-4">
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
            <div className="text-sm text-red-300">{error}</div>
          </div>
        )}

        {/* Stage 1 — Ambiguity */}
        <StageCard
          icon={Search}
          title="1 · Ambiguity check"
          active={stage === "checking"}
          done={isAmbiguous !== null}
        >
          {isAmbiguous === null ? (
            <span className="text-gray-500 text-sm">Waiting for input…</span>
          ) : (
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className={clsx(
                  "inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm border",
                  isAmbiguous
                    ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
                    : "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                )}
              >
                {isAmbiguous ? "Ambiguous" : "Clear"}
              </span>
              <span className="text-xs text-gray-500">
                {isAmbiguous
                  ? "Needs your input before SQL generation."
                  : "Question is specific — generating SQL directly."}
              </span>
            </div>
          )}
        </StageCard>

        {/* Stage 2 — Clarification picker */}
        {isAmbiguous === true && (
          <StageCard
            icon={CheckCircle2}
            title="2 · Pick a meaning"
            active={awaiting}
            done={!awaiting && !!refinedPrompt}
          >
            {!clarificationQuestion ? (
              <span className="text-gray-500 text-sm">Asking LLM…</span>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-200 leading-relaxed">
                  {clarificationQuestion}
                </p>

                {/* Radio options (when the parser found them) */}
                {!clarificationFallback && clarificationOptions.length > 0 && (
                  <div className="space-y-2">
                    {clarificationOptions.map((opt) => {
                      const active = selectedOption === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() => setSelectedOption(opt)}
                          disabled={!awaiting}
                          className={clsx(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition border",
                            active
                              ? "bg-brand-500/15 border-brand-500/40 text-white"
                              : "bg-white/5 border-white/5 text-gray-300 hover:bg-white/10",
                            !awaiting && "opacity-70 cursor-not-allowed"
                          )}
                        >
                          <span
                            className={clsx(
                              "w-3.5 h-3.5 rounded-full border-2 shrink-0 flex items-center justify-center",
                              active ? "border-brand-400" : "border-gray-500"
                            )}
                          >
                            {active && (
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                            )}
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}

                    {/* Optional: allow user to type their own answer */}
                    {awaiting && (
                      <button
                        onClick={() => setSelectedOption(CUSTOM_VALUE)}
                        className={clsx(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition border",
                          selectedOption === CUSTOM_VALUE
                            ? "bg-brand-500/15 border-brand-500/40 text-white"
                            : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10"
                        )}
                      >
                        <span
                          className={clsx(
                            "w-3.5 h-3.5 rounded-full border-2 shrink-0 flex items-center justify-center",
                            selectedOption === CUSTOM_VALUE
                              ? "border-brand-400"
                              : "border-gray-500"
                          )}
                        >
                          {selectedOption === CUSTOM_VALUE && (
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                          )}
                        </span>
                        <span>Something else — I'll type it</span>
                      </button>
                    )}

                    {selectedOption === CUSTOM_VALUE && awaiting && (
                      <textarea
                        value={customAnswer}
                        onChange={(e) => setCustomAnswer(e.target.value)}
                        rows={2}
                        autoFocus
                        className="w-full bg-ink-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white resize-none focus:outline-none focus:border-brand-500/50"
                        placeholder="Describe how you want the answer measured…"
                      />
                    )}
                  </div>
                )}

                {/* Fallback: parser found no options → free text */}
                {clarificationFallback && (
                  <div className="space-y-2">
                    <div className="text-xs text-gray-500">
                      Type your answer to the question above:
                    </div>
                    <textarea
                      value={customAnswer}
                      onChange={(e) => {
                        setCustomAnswer(e.target.value);
                        setSelectedOption(CUSTOM_VALUE);
                      }}
                      disabled={!awaiting}
                      rows={3}
                      className="w-full bg-ink-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white resize-none focus:outline-none focus:border-brand-500/50 disabled:opacity-60"
                      placeholder="e.g. Highest total order revenue from completed orders"
                    />
                  </div>
                )}

                {/* Continue / Cancel */}
                {awaiting && (
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      onClick={continueWithChoice}
                      disabled={!canContinue}
                      className={clsx(
                        "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition",
                        !canContinue
                          ? "bg-white/5 text-gray-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-brand-600 to-accent-500 text-white hover:opacity-90"
                      )}
                    >
                      Continue with this choice
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={reset}
                      className="px-3 py-2 rounded-xl glass text-xs text-gray-400 hover:text-white transition"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {/* Show refined prompt after continuing */}
                {!awaiting && refinedPrompt && (
                  <div className="pt-1">
                    <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                      Refined prompt sent to SQL generator
                    </div>
                    <div className="text-xs font-mono text-gray-300 bg-ink-950 p-3 rounded-lg border border-white/5">
                      {refinedPrompt}
                    </div>
                  </div>
                )}
              </div>
            )}
          </StageCard>
        )}

        {/* Stage 3 — SQL */}
        <StageCard
          icon={Code2}
          title={
            isAmbiguous === true ? "3 · Generated SQL" : "2 · Generated SQL"
          }
          active={stage === "generating"}
          done={!!sql}
        >
          {!sql ? (
            <span className="text-gray-500 text-sm">Waiting…</span>
          ) : (
            <pre className="text-xs font-mono text-gray-200 bg-ink-950 p-4 rounded-lg overflow-x-auto leading-relaxed">
              {sql}
            </pre>
          )}
        </StageCard>

        {/* Stage 4 — Answer */}
        <StageCard
          icon={FileText}
          title={
            isAmbiguous === true ? "4 · Final answer" : "3 · Final answer"
          }
          active={stage === "answering"}
          done={!!report}
        >
          {!report ? (
            <span className="text-gray-500 text-sm">Waiting…</span>
          ) : (
            <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">
              {report}
            </p>
          )}
        </StageCard>
      </div>
    </div>
  );
}

function StageCard({
  icon: Icon,
  title,
  active,
  done,
  children,
}: {
  icon: any;
  title: string;
  active: boolean;
  done: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={clsx(
        "p-5 rounded-2xl glass transition-all",
        active && "border-brand-500/40 shadow-lg shadow-brand-600/10",
        done && !active && "border-white/10"
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon
          className={clsx(
            "w-4 h-4",
            active
              ? "text-brand-400 animate-pulse"
              : done
              ? "text-emerald-400"
              : "text-gray-500"
          )}
        />
        <span className="text-xs uppercase tracking-wider text-gray-400">
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}