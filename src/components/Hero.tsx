import { ArrowDown, ArrowRight } from "lucide-react";
import { company, gaugeProfiles, knittingBrand, trustBadges } from "@/data/factoryData";
import { cn } from "@/lib/utils";
import { JacquardChart } from "./JacquardChart";
import { buttonVariants } from "./ui/Button";
import { Icon } from "./ui/Icon";
import { RfqLink } from "./ui/RfqLink";

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-ink-950 text-white">
      {/* Backdrop: needle-bed dot grid + brand glow */}
      <div
        aria-hidden="true"
        className="bg-dots mask-fade-b absolute inset-0 -z-10 opacity-70 [--dot-color:rgb(255_255_255/0.09)] [--dot-size:26px]"
      />
      <div
        aria-hidden="true"
        className="absolute -right-40 -top-40 -z-10 size-[36rem] rounded-full bg-crimson-700/25 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-48 -left-32 -z-10 size-[32rem] rounded-full bg-olive-500/25 blur-[120px]"
      />

      <div className="container grid items-center gap-14 pb-36 pt-16 sm:pt-20 lg:grid-cols-12 lg:gap-10 lg:pb-44 lg:pt-24">
        <div className="lg:col-span-7">
          <p className="mb-6 inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-ink-200 sm:text-xs">
            <span>Est. {company.established}</span>
            <span aria-hidden="true" className="text-ink-500">
              /
            </span>
            <span>Ashulia, Dhaka</span>
            <span aria-hidden="true" className="text-ink-500">
              /
            </span>
            <span className="text-crimson-300">100% Export</span>
          </p>

          <h1 id="hero-title" className="text-balance font-display text-display-xl font-semibold">
            Precision Knitwear Manufacturing at{" "}
            <span className="bg-gradient-to-r from-olive-300 via-rust-300 to-crimson-300 bg-clip-text text-transparent">
              Global Scale
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-ink-200 sm:text-xl">
            {company.summary}
          </p>

          <ul className="mt-8 flex flex-wrap gap-2.5" aria-label="Memberships and certifications">
            {trustBadges.map((badge) => (
              <li
                key={badge.label}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] py-2 pl-2.5 pr-3.5 text-sm backdrop-blur-sm"
              >
                <span className="inline-flex size-7 items-center justify-center rounded-lg bg-white/10 text-crimson-200">
                  <Icon name={badge.icon} className="size-4" />
                </span>
                <span className="font-semibold text-white">{badge.label}</span>
                <span className="text-ink-300">{badge.detail}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a href="#infrastructure" className={cn(buttonVariants({ variant: "light", size: "lg" }))}>
              Explore Manufacturing Capabilities
              <ArrowDown />
            </a>
            <RfqLink prefill={{ inquiryType: "Tech Pack Review" }} className={cn(buttonVariants({ size: "lg" }))}>
              Request Quotation &amp; Tech Pack Review
              <ArrowRight />
            </RfqLink>
          </div>
        </div>

        {/* Jacquard chart panel */}
        <div className="lg:col-span-5">
          <figure className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-5 shadow-2xl shadow-black/40 backdrop-blur sm:p-6">
            <div className="flex items-center justify-between font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-300">
              <span className="inline-flex items-center gap-2">
                <span className="size-2 rounded-full bg-forest-300" aria-hidden="true" />
                Jacquard chart
              </span>
              <span>{knittingBrand}</span>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-ink-950/60 px-3 py-4 sm:px-4">
              <JacquardChart />
            </div>

            <dl className="mt-5 grid grid-cols-4 gap-2">
              {gaugeProfiles.map((g) => (
                <div
                  key={g.gauge}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-2 py-2.5 text-center"
                >
                  <dt className="font-mono text-[0.7rem] text-ink-300">{g.gauge}</dt>
                  <dd className="mt-0.5 font-display text-lg font-semibold tabular-nums text-white sm:text-xl">
                    {g.sets}
                  </dd>
                </div>
              ))}
            </dl>
            <figcaption className="mt-4 text-sm leading-relaxed text-ink-300">
              Every panel is programmed stitch-by-stitch across a{" "}
              <span className="font-semibold text-white">300-set computerized jacquard fleet</span> — from 14G fine
              jersey to 5/7G chunky cables.
            </figcaption>
          </figure>
        </div>
      </div>

      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 bg-brand-rule opacity-80" />
    </section>
  );
}
