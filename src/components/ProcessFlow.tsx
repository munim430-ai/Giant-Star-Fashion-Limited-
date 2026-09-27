"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Cog, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { processPhases, processSteps, type ProcessPhase, type ProcessStep } from "@/data/factoryData";
import { cn } from "@/lib/utils";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

const phaseStyles: Record<ProcessPhase["color"], { dot: string; soft: string; text: string; ring: string }> = {
  olive: { dot: "bg-olive-500", soft: "bg-olive-50", text: "text-olive-700", ring: "ring-olive-500" },
  rust: { dot: "bg-rust-500", soft: "bg-rust-50", text: "text-rust-600", ring: "ring-rust-500" },
  crimson: { dot: "bg-crimson-700", soft: "bg-crimson-50", text: "text-crimson-700", ring: "ring-crimson-700" },
  forest: { dot: "bg-forest-500", soft: "bg-forest-50", text: "text-forest-600", ring: "ring-forest-500" },
  ink: { dot: "bg-ink-950", soft: "bg-ink-50", text: "text-ink-800", ring: "ring-ink-950" },
};

const TOTAL = processSteps.length;

function StepDetail({
  step,
  onPrev,
  onNext,
  className,
}: {
  step: ProcessStep;
  onPrev: () => void;
  onNext: () => void;
  className?: string;
}) {
  const phase = processPhases.find((p) => p.id === step.phase)!;
  const style = phaseStyles[phase.color];
  return (
    <div className={cn("overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-lift", className)}>
      <div className="h-1.5 bg-ink-100">
        <motion.div
          className={cn("h-full", style.dot)}
          initial={false}
          animate={{ width: `${(step.n / TOTAL) * 100}%` }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-[auto_1fr_auto] md:items-start">
        <p
          className="font-display text-6xl font-semibold leading-none tabular-nums text-ink-950 sm:text-7xl"
          aria-hidden="true"
        >
          {String(step.n).padStart(2, "0")}
        </p>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step.n}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
            aria-live="polite"
          >
            <p className={cn("font-mono text-xs uppercase tracking-[0.14em]", style.text)}>
              Stage {step.n} of {TOTAL} · {phase.name}
            </p>
            <h3 className="mt-2 font-display text-2xl font-semibold text-ink-950">{step.name}</h3>
            <p className="mt-3 max-w-2xl leading-relaxed text-ink-600">{step.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {step.qcGate ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-forest-200 bg-forest-50 px-3 py-1 text-xs font-semibold text-forest-700">
                  <ShieldCheck className="size-3.5" aria-hidden="true" />
                  Quality gate
                </span>
              ) : null}
              {step.equipment ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-paper px-3 py-1 text-xs font-medium text-ink-700">
                  <Cog className="size-3.5" aria-hidden="true" />
                  {step.equipment}
                </span>
              ) : null}
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="flex gap-2 md:flex-col">
          <button
            type="button"
            onClick={onPrev}
            disabled={step.n === 1}
            className="inline-flex size-11 items-center justify-center rounded-full border border-ink-200 text-ink-800 transition hover:border-ink-950 hover:bg-ink-50 disabled:opacity-40"
            aria-label="Previous stage"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={step.n === TOTAL}
            className="inline-flex size-11 items-center justify-center rounded-full bg-ink-950 text-white transition hover:bg-ink-800 disabled:opacity-40"
            aria-label="Next stage"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProcessFlow() {
  const [activeN, setActiveN] = useState(4);
  const active = processSteps[activeN - 1];
  const go = (n: number) => setActiveN(Math.min(TOTAL, Math.max(1, n)));

  return (
    <section id="process" aria-labelledby="process-title" className="section bg-paper">
      <div className="container">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <Reveal>
            <SectionHeading
              id="process-title"
              eyebrow="17-stage production flow"
              title="From yarn cone to export carton."
              description="One continuous, inspected workflow — three in-line quality gates before the final pre-shipment audit. Select any stage to see what happens there."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-600" aria-label="Legend">
              {processPhases.map((p) => (
                <li key={p.id} className="inline-flex items-center gap-2">
                  <span className={cn("size-2.5 rounded-full", phaseStyles[p.color].dot)} aria-hidden="true" />
                  {p.name}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Yarn thread connecting the phases */}
        <div aria-hidden="true" className="relative mt-14 hidden h-1 rounded-full bg-brand-rule opacity-70 lg:block" />

        <ol
          className="mt-6 grid gap-4 sm:grid-cols-2 lg:mt-0 lg:grid-cols-5 lg:gap-3"
          aria-label="Production stages by phase"
        >
          {processPhases.map((phase, pi) => {
            const steps = processSteps.filter((s) => s.phase === phase.id);
            const style = phaseStyles[phase.color];
            const containsActive = steps.some((s) => s.n === activeN);
            return (
              <li key={phase.id} className="flex flex-col">
                <Reveal delay={pi * 0.06} className="flex flex-col sm:h-full">
                  <div className="relative hidden justify-center lg:flex" aria-hidden="true">
                    <span className={cn("-mt-2.5 size-4 rounded-full border-4 border-paper", style.dot)} />
                  </div>
                  <div className="h-full rounded-2xl border border-ink-100 bg-white p-3 shadow-card lg:mt-3">
                    <div className={cn("rounded-xl px-3 py-2.5", style.soft)}>
                      <p className={cn("font-mono text-[0.7rem] uppercase tracking-[0.14em]", style.text)}>
                        Stages {steps[0].n}–{steps[steps.length - 1].n}
                      </p>
                      <h3 className="mt-0.5 font-display text-base font-semibold text-ink-950">{phase.name}</h3>
                    </div>
                    <div className="relative mt-2">
                      <span aria-hidden="true" className="absolute bottom-4 left-[1.45rem] top-4 w-px bg-ink-100" />
                      <ol className="relative space-y-1">
                        {steps.map((step) => {
                          const selected = step.n === activeN;
                          return (
                            <li key={step.n}>
                              <button
                                type="button"
                                onClick={() => setActiveN(step.n)}
                                aria-current={selected ? "step" : undefined}
                                className={cn(
                                  "relative flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left text-sm transition-colors",
                                  selected
                                    ? "bg-ink-950 text-white"
                                    : "text-ink-700 hover:bg-paper-100 hover:text-ink-950",
                                )}
                              >
                                <span
                                  className={cn(
                                    "relative inline-flex size-7 shrink-0 items-center justify-center rounded-full font-mono text-xs font-semibold tabular-nums",
                                    selected ? "bg-white text-ink-950" : cn("text-white", style.dot),
                                  )}
                                >
                                  {step.n}
                                </span>
                                <span className="flex-1 font-medium leading-snug">{step.name}</span>
                                {step.qcGate ? (
                                  <ShieldCheck
                                    className={cn("size-4 shrink-0", selected ? "text-forest-300" : "text-forest-500")}
                                    aria-label="Quality gate"
                                  />
                                ) : null}
                              </button>
                            </li>
                          );
                        })}
                      </ol>
                    </div>
                  </div>
                </Reveal>
                {/* Small screens: detail sits directly under its phase */}
                {containsActive ? (
                  <StepDetail
                    step={active}
                    onPrev={() => go(activeN - 1)}
                    onNext={() => go(activeN + 1)}
                    className="mt-4 sm:hidden"
                  />
                ) : null}
              </li>
            );
          })}
        </ol>

        <StepDetail
          step={active}
          onPrev={() => go(activeN - 1)}
          onNext={() => go(activeN + 1)}
          className="mt-8 hidden sm:block"
        />
      </div>
    </section>
  );
}
