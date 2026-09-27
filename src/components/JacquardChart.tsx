"use client";

import { motion } from "framer-motion";
import { MARK_COLS, MARK_DOTS, MARK_ROWS } from "./ui/DotMatrixMark";

const PAD_X = 2;
const PAD_Y = 2;
const COLS = MARK_COLS + PAD_X * 2;
const ROWS = MARK_ROWS + PAD_Y * 2;
const CELL = 12;
const ROW_DELAY = 0.14;

const rows = Array.from({ length: MARK_ROWS }, (_, r) => MARK_DOTS.filter((d) => d.y === r));

/**
 * The GSFL mark rendered as a jacquard needle chart and "knitted" bottom-up,
 * row by row, the way a flat-knitting machine builds a panel.
 */
export function JacquardChart() {
  const width = COLS * CELL;
  const height = ROWS * CELL;
  const total = MARK_ROWS * ROW_DELAY;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full"
      role="img"
      aria-label="GSFL mark drawn as a jacquard knitting chart"
    >
      <defs>
        <pattern id="needle-bed" width={CELL} height={CELL} patternUnits="userSpaceOnUse">
          <circle cx={CELL / 2} cy={CELL / 2} r={CELL * 0.14} fill="rgb(255 255 255 / 0.16)" />
        </pattern>
        <linearGradient id="carriage" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#A6B26A" stopOpacity="0" />
          <stop offset="0.5" stopColor="#EE97A0" stopOpacity="0.9" />
          <stop offset="1" stopColor="#A6B26A" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width={width} height={height} fill="url(#needle-bed)" />

      {rows.map((dots, r) => (
        <motion.g
          key={r}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 + (MARK_ROWS - 1 - r) * ROW_DELAY, duration: 0.35 }}
        >
          {dots.map((d) => (
            <circle
              key={`${d.x}-${d.y}`}
              cx={(d.x + PAD_X) * CELL + CELL / 2}
              cy={(d.y + PAD_Y) * CELL + CELL / 2}
              r={CELL * 0.4}
              fill={d.fill}
            />
          ))}
        </motion.g>
      ))}

      {/* Reduced-motion visitors: MotionConfig skips the travel, leaving only a brief fade. */}
      <motion.rect
        x={0}
        width={width}
        height={2}
        rx={1}
        fill="url(#carriage)"
        initial={{ y: (PAD_Y + MARK_ROWS) * CELL, opacity: 0 }}
        animate={{ y: PAD_Y * CELL - 2, opacity: [0, 1, 1, 0] }}
        transition={{
          delay: 0.3,
          duration: total + 0.2,
          ease: "linear",
          opacity: { times: [0, 0.08, 0.9, 1], duration: total + 0.3, delay: 0.3 },
        }}
      />
    </svg>
  );
}
