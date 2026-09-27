"use client";

import { Calculator, Droplets, Info, Zap } from "lucide-react";
import { useId, useState } from "react";
import { capacity, workforce } from "@/data/factoryData";
import { formatNumber } from "@/lib/utils";
import { Counter } from "./ui/Counter";
import { Reveal } from "./ui/Reveal";
import { RfqLink } from "./ui/RfqLink";
import { SectionHeading } from "./ui/SectionHeading";

const tiers = [
  { label: "Daily", range: capacity.daily, note: "pcs per day" },
  { label: "Monthly", range: capacity.monthly, note: "pcs per month" },
  { label: "Yearly", range: capacity.yearly, note: "pcs per year" },
] as const;

const MIN_QTY = 1000;
const MAX_QTY = 200000;
const STEP = 1000;

const notes = [
  {
    icon: Zap,
    text: "700 KVA of standby generation (450 + 250 KVA) keeps knitting and finishing running through grid interruptions.",
  },
  {
    icon: Droplets,
    text: "Washing, drying and steam pressing happen in-house, so finishing capacity moves in step with knitting.",
  },
];

export function Capacity() {
  const id = useId();
  const [qty, setQty] = useState(30000);

  const daysFast = qty / capacity.daily.max;
  const daysSlow = qty / capacity.daily.min;
  const shareLow = (qty / capacity.monthly.max) * 100;
  const shareHigh = (qty / capacity.monthly.min) * 100;

  const fmtDays = (d: number) => (d < 1 ? "<1" : String(Math.ceil(d)));
  const daysLabel =
    fmtDays(daysFast) === fmtDays(daysSlow) ? fmtDays(daysFast) : `${fmtDays(daysFast)}–${fmtDays(daysSlow)}`;
  const fill = ((qty - MIN_QTY) / (MAX_QTY - MIN_QTY)) * 100;

  return (
    <section
      id="capacity"
      aria-labelledby="capacity-title"
      className="section relative isolate overflow-hidden bg-ink-950 text-white"
    >
      <div
        aria-hidden="true"
        className="bg-dots absolute inset-0 -z-10 opacity-60 [--dot-color:rgb(255_255_255/0.07)] [--dot-size:24px]"
      />
      <div
        aria-hidden="true"
        className="absolute -left-40 top-1/3 -z-10 size-[30rem] rounded-full bg-crimson-700/20 blur-[120px]"
      />

      <div className="container">
        <Reveal>
          <SectionHeading
            id="capacity-title"
            tone="dark"
            eyebrow="Production capacity"
            title="Output you can plan a season around."
            description={`Rated capacity across ${formatNumber(workforce.total)} professionals and 300 knitting sets — sized for programme orders, replenishment and multi-style development.`}
          />
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-12">
          <div className="grid gap-4 sm:grid-cols-3 lg:col-span-7 lg:grid-cols-1">
            {tiers.map((tier, i) => (
              <Reveal key={tier.label} delay={i * 0.08}>
                <div className="flex h-full flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-6 lg:flex-row lg:items-center">
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-ink-300">{tier.label} capacity</p>
                  <div className="lg:text-right">
                    <p className="font-display text-3xl font-semibold tabular-nums sm:text-[1.7rem] lg:text-4xl">
                      <Counter value={tier.range.min} />
                      <span className="px-1.5 text-ink-400">–</span>
                      <Counter value={tier.range.max} />
                    </p>
                    <p className="mt-1 text-sm text-ink-300">{tier.note}</p>
                  </div>
                </div>
              </Reveal>
            ))}
            <ul className="grid gap-3 sm:col-span-3 sm:grid-cols-2 lg:col-span-1">
              {notes.map((n) => (
                <li
                  key={n.text}
                  className="flex gap-3 rounded-2xl border border-white/10 p-5 text-sm leading-relaxed text-ink-200"
                >
                  <n.icon className="mt-0.5 size-4 shrink-0 text-crimson-300" aria-hidden="true" />
                  {n.text}
                </li>
              ))}
            </ul>
          </div>

          {/* Order capacity estimator */}
          <Reveal className="lg:col-span-5" delay={0.12}>
            <div className="h-full rounded-3xl bg-white p-6 text-ink-950 shadow-lift sm:p-8">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-10 items-center justify-center rounded-xl bg-crimson-700 text-white">
                  <Calculator className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold">Order capacity estimator</h3>
                  <p className="text-sm text-ink-500">How much of our line would your order occupy?</p>
                </div>
              </div>

              <div className="mt-8">
                <div className="flex items-end justify-between gap-4">
                  <label htmlFor={`${id}-qty`} className="field-label mb-0">
                    Order quantity
                  </label>
                  <div className="flex items-baseline gap-1.5">
                    <input
                      type="number"
                      inputMode="numeric"
                      min={MIN_QTY}
                      max={MAX_QTY}
                      step={STEP}
                      value={qty}
                      aria-label="Order quantity in pieces"
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        if (Number.isFinite(v)) setQty(Math.min(MAX_QTY, Math.max(0, v)));
                      }}
                      onBlur={() => setQty((v) => Math.min(MAX_QTY, Math.max(MIN_QTY, Math.round(v / STEP) * STEP)))}
                      className="w-28 rounded-lg border border-ink-200 px-2 py-1 text-right font-display text-xl font-semibold tabular-nums focus:border-ink-950 focus:outline-none focus:ring-4 focus:ring-ink-950/10"
                    />
                    <span className="text-sm text-ink-500">pcs</span>
                  </div>
                </div>
                <input
                  id={`${id}-qty`}
                  type="range"
                  min={MIN_QTY}
                  max={MAX_QTY}
                  step={STEP}
                  value={Math.max(MIN_QTY, qty)}
                  onChange={(e) => setQty(Number(e.target.value))}
                  aria-valuetext={`${formatNumber(qty)} pieces`}
                  className="mt-5 h-2 w-full cursor-pointer appearance-none rounded-full accent-crimson-700 [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-crimson-700 [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-crimson-700 [&::-webkit-slider-thumb]:shadow-[0_0_0_1px_rgb(169_4_37/0.4),0_2px_6px_rgb(0_0_0/0.25)]"
                  style={{ background: `linear-gradient(90deg, #A90425 ${fill}%, #E8ECF3 ${fill}%)` }}
                />
                <div className="mt-2 flex justify-between font-mono text-[0.7rem] text-ink-500">
                  <span>1K</span>
                  <span>100K</span>
                  <span>200K</span>
                </div>
              </div>

              <dl className="mt-8 grid grid-cols-2 gap-3" aria-live="polite">
                <div className="rounded-2xl bg-paper-100 p-4">
                  <dt className="text-xs font-medium text-ink-500">Full-line production days</dt>
                  <dd className="mt-1 font-display text-3xl font-semibold tabular-nums">
                    {daysLabel}
                    <span className="ml-1 text-base font-medium text-ink-500">days</span>
                  </dd>
                </div>
                <div className="rounded-2xl bg-paper-100 p-4">
                  <dt className="text-xs font-medium text-ink-500">Share of monthly output</dt>
                  <dd className="mt-1 font-display text-3xl font-semibold tabular-nums">
                    {shareLow < 1 ? "<1" : Math.round(shareLow)}
                    {Math.round(shareHigh) !== Math.round(shareLow) && shareLow >= 1 ? `–${Math.round(shareHigh)}` : ""}
                    <span className="ml-0.5 text-base font-medium text-ink-500">%</span>
                  </dd>
                </div>
              </dl>

              <p className="mt-5 flex gap-2 text-xs leading-relaxed text-ink-500">
                <Info className="mt-px size-3.5 shrink-0" aria-hidden="true" />
                Indicative only, at rated daily output of {formatNumber(capacity.daily.min)}–
                {formatNumber(capacity.daily.max)} pcs. Excludes yarn sourcing, sampling and approvals — your confirmed
                time &amp; action plan follows tech-pack review.
              </p>

              <RfqLink
                prefill={{
                  inquiryType: "Quotation (RFQ)",
                  message: `Planned order quantity: approx. ${formatNumber(qty)} pcs.`,
                }}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink-800"
              >
                Request a quote for {formatNumber(qty)} pcs
              </RfqLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
