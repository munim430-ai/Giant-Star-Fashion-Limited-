"use client";

import { Pause, Play } from "lucide-react";
import { useState } from "react";
import { buyers } from "@/data/factoryData";
import { cn } from "@/lib/utils";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

const rowA = buyers.slice(0, Math.ceil(buyers.length / 2));
const rowB = buyers.slice(Math.ceil(buyers.length / 2));
const dots = ["bg-olive-500", "bg-rust-500", "bg-crimson-700", "bg-forest-500"];

function Wordmark({ name, index }: { name: string; index: number }) {
  return (
    <span className="flex shrink-0 items-center gap-6 px-3 sm:gap-10 sm:px-5">
      <span className="whitespace-nowrap font-display text-2xl font-semibold tracking-tight text-ink-300 transition-colors duration-300 hover:text-white sm:text-3xl">
        {name}
      </span>
      <span aria-hidden="true" className="flex gap-1">
        <span className={cn("size-1.5 rounded-full", dots[index % dots.length])} />
        <span className={cn("size-1.5 rounded-full", dots[(index + 1) % dots.length])} />
      </span>
    </span>
  );
}

function MarqueeRow({
  items,
  reverse,
  paused,
  offset,
}: {
  items: readonly string[];
  reverse?: boolean;
  paused: boolean;
  offset: number;
}) {
  return (
    <div className="mask-fade-x flex overflow-hidden motion-reduce:hidden">
      <div
        className={cn(
          "flex w-max animate-marquee",
          reverse && "[animation-direction:reverse]",
          paused && "[animation-play-state:paused]",
        )}
        style={{ "--marquee-duration": `${items.length * 7}s` } as React.CSSProperties}
      >
        {/* Two copies make the loop seamless; the second is hidden from assistive tech. */}
        {[0, 1].map((copy) => (
          <div key={copy} className="flex" aria-hidden={copy === 1 ? true : undefined}>
            {items.map((name, i) => (
              <Wordmark key={`${copy}-${name}`} name={name} index={i + offset} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ClientMarquee() {
  const [userPaused, setUserPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const paused = userPaused || hovered;

  return (
    <section
      id="clients"
      aria-labelledby="clients-title"
      className="section relative overflow-hidden bg-ink-950 text-white"
    >
      <div className="container">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <Reveal>
            <SectionHeading
              id="clients-title"
              tone="dark"
              eyebrow="International buyer roster"
              title="Trusted by global retail partners."
              description="Brands, retailers and buying houses that source knitwear from our Ashulia floor."
            />
          </Reveal>
          <button
            type="button"
            onClick={() => setUserPaused((p) => !p)}
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-ink-200 transition hover:border-white/50 hover:text-white motion-reduce:hidden sm:self-auto"
            aria-pressed={userPaused}
          >
            {userPaused ? (
              <Play className="size-4" aria-hidden="true" />
            ) : (
              <Pause className="size-4" aria-hidden="true" />
            )}
            {userPaused ? "Play" : "Pause"} logo reel
          </button>
        </div>
      </div>

      <div
        className="mt-14 space-y-6 sm:space-y-8"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <MarqueeRow items={rowA} paused={paused} offset={0} />
        <MarqueeRow items={rowB} paused={paused} offset={2} reverse />

        {/* Reduced motion: a static roster instead of the reel */}
        <ul className="container hidden flex-wrap justify-center gap-x-10 gap-y-4 motion-reduce:flex">
          {buyers.map((name) => (
            <li key={name} className="font-display text-2xl font-semibold text-ink-300">
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
