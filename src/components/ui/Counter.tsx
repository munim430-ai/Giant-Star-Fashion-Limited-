"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { formatNumber } from "@/lib/utils";

type Props = {
  value: number;
  format?: "full" | "compact";
  duration?: number;
  className?: string;
};

/**
 * Counts up from zero the first time it scrolls into view. The final value is
 * always present for assistive tech and crawlers; the ticking digits are
 * presentational only.
 */
export function Counter({ value, format = "full", duration = 1.8, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(latest),
    });
    return () => controls.stop();
  }, [inView, reduceMotion, value, duration]);

  const rounded = format === "compact" && display < value ? Math.round(display / 1000) * 1000 : Math.round(display);

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true" className="tabular-nums">
        {formatNumber(rounded, format)}
      </span>
      <span className="sr-only">{formatNumber(value, format)}</span>
    </span>
  );
}
