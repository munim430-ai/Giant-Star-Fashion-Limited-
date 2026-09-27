"use client";

import { MotionConfig } from "framer-motion";

/** Animations respect the visitor's reduced-motion preference site-wide. */
export function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
