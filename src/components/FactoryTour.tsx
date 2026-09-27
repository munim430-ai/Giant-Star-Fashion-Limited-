"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { facilityAreas } from "@/data/factoryData";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/Button";
import { Icon } from "./ui/Icon";
import { Reveal } from "./ui/Reveal";
import { RfqLink } from "./ui/RfqLink";
import { SectionHeading } from "./ui/SectionHeading";

const accents = ["bg-olive-500", "bg-rust-500", "bg-crimson-700", "bg-forest-500"];

export function FactoryTour() {
  const [activeId, setActiveId] = useState(facilityAreas[2].id);
  const active = facilityAreas.find((a) => a.id === activeId) ?? facilityAreas[0];
  const activeIndex = facilityAreas.indexOf(active);

  return (
    <section id="facility" aria-labelledby="facility-title" className="section bg-paper">
      <div className="container">
        <Reveal>
          <SectionHeading
            id="facility-title"
            eyebrow="Factory floor & facility tour"
            title="Walk the floor before you place the order."
            description="Eight dedicated areas take a tech pack from pattern to export carton. Select an area to see what happens there — then book a guided visit or live video walkthrough."
          />
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-12">
          <ul
            className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 lg:col-span-7 lg:grid-cols-2"
            aria-label="Facility areas"
          >
            {facilityAreas.map((area, i) => {
              const selected = area.id === active.id;
              return (
                <li key={area.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(area.id)}
                    aria-pressed={selected}
                    aria-controls="facility-detail"
                    className={cn(
                      "group relative flex h-full min-h-[10.5rem] w-full flex-col justify-between overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 sm:p-5",
                      selected
                        ? "border-ink-950 bg-ink-950 text-white shadow-lift"
                        : "border-ink-100 bg-white text-ink-950 shadow-card hover:-translate-y-0.5 hover:border-ink-300",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "bg-dots absolute inset-0 transition-opacity [--dot-size:14px]",
                        selected
                          ? "opacity-100 [--dot-color:rgb(255_255_255/0.08)]"
                          : "opacity-0 group-hover:opacity-100",
                      )}
                    />
                    <span className="relative flex items-start justify-between gap-2">
                      <span
                        className={cn(
                          "inline-flex size-10 items-center justify-center rounded-xl text-white transition-transform group-hover:scale-105",
                          accents[i % accents.length],
                        )}
                      >
                        <Icon name={area.icon} className="size-5" />
                      </span>
                      <span className={cn("font-mono text-xs", selected ? "text-ink-300" : "text-ink-500")}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </span>
                    <span className="relative mt-6 block">
                      <span className="block text-balance font-display text-[0.95rem] font-semibold leading-snug sm:text-base">
                        {area.name}
                      </span>
                      <span
                        className={cn(
                          "mt-1.5 block font-mono text-xs",
                          selected ? "text-crimson-300" : "text-crimson-700",
                        )}
                      >
                        {area.stat}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="lg:col-span-5">
            <div
              id="facility-detail"
              aria-live="polite"
              className="sticky top-24 overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-lift"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="relative flex aspect-[16/9] items-center justify-center overflow-hidden bg-ink-950">
                    {active.image ? (
                      <Image
                        src={active.image}
                        alt={active.name}
                        fill
                        sizes="(min-width: 1024px) 40vw, 100vw"
                        className="object-cover"
                      />
                    ) : (
                      <>
                        <div
                          aria-hidden="true"
                          className="bg-dots absolute inset-0 [--dot-color:rgb(255_255_255/0.14)] [--dot-size:18px]"
                        />
                        <div
                          aria-hidden="true"
                          className={cn(
                            "absolute -right-10 -top-10 size-56 rounded-full opacity-40 blur-3xl",
                            accents[activeIndex % accents.length],
                          )}
                        />
                        <span className="relative inline-flex size-20 items-center justify-center rounded-3xl border border-white/15 bg-white/10 text-white backdrop-blur">
                          <Icon name={active.icon} className="size-9" />
                        </span>
                        <span className="absolute bottom-4 left-5 font-mono text-xs uppercase tracking-[0.14em] text-ink-300">
                          Area {String(activeIndex + 1).padStart(2, "0")} /{" "}
                          {String(facilityAreas.length).padStart(2, "0")}
                        </span>
                        <span className="absolute bottom-4 right-5 rounded-full bg-white/10 px-3 py-1 font-mono text-xs text-white">
                          {active.stat}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="p-6 sm:p-8">
                    <h3 className="font-display text-2xl font-semibold text-ink-950">{active.name}</h3>
                    <p className="mt-3 leading-relaxed text-ink-600">{active.description}</p>
                    <ul className="mt-6 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                      {active.highlights.map((h) => (
                        <li key={h} className="flex items-center gap-2.5 text-sm font-medium text-ink-800">
                          <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-forest-50 text-forest-500">
                            <Check className="size-3.5" aria-hidden="true" />
                          </span>
                          {h}
                        </li>
                      ))}
                    </ul>
                    <RfqLink
                      prefill={{
                        inquiryType: "Factory Tour / Audit Visit",
                        message: `We would like to tour the factory, including the ${active.name}.`,
                      }}
                      className={cn(buttonVariants({ variant: "dark" }), "mt-8")}
                    >
                      Book a guided tour of this area
                      <ArrowRight />
                    </RfqLink>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
