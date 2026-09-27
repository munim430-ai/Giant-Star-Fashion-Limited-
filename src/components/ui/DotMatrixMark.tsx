import { cn } from "@/lib/utils";

// Dot bitmaps traced from the GSFL mark (1 = dot). Each letter carries the
// left→right colour sweep of the original logo.
const LETTERS: { rows: string[]; from: string; to: string }[] = [
  {
    rows: ["1111111", "1111111", "11.....", "11.1111", "11.1111", "11...11", "1111111", "1111111"],
    from: "#586719",
    to: "#A6201E",
  },
  {
    rows: ["1111111", "1111111", "11.....", "1111111", "1111111", ".....11", "1111111", "1111111"],
    from: "#A90425",
    to: "#845012",
  },
  {
    rows: ["1111111", "1111111", "11.....", "1111111", "1111111", "11.....", "11.....", "11....."],
    from: "#686718",
    to: "#276019",
  },
  {
    rows: ["11...", "11...", "11...", "11...", "11...", "11...", "11...", "11111"],
    from: "#6B6817",
    to: "#2D6215",
  },
];

function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function mix(from: string, to: string, t: number) {
  const a = hexToRgb(from);
  const b = hexToRgb(to);
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * t));
  return `rgb(${c[0]} ${c[1]} ${c[2]})`;
}

const GAP = 1; // blank columns between letters

export type MarkDot = { x: number; y: number; fill: string };

export const MARK_DOTS: MarkDot[] = (() => {
  const dots: MarkDot[] = [];
  let offset = 0;
  for (const letter of LETTERS) {
    const width = letter.rows[0].length;
    letter.rows.forEach((row, y) => {
      [...row].forEach((cell, x) => {
        if (cell === "1")
          dots.push({ x: offset + x, y, fill: mix(letter.from, letter.to, x / Math.max(width - 1, 1)) });
      });
    });
    offset += width + GAP;
  }
  return dots;
})();

export const MARK_COLS = LETTERS.reduce((sum, l) => sum + l.rows[0].length, 0) + GAP * (LETTERS.length - 1);
export const MARK_ROWS = 8;

/**
 * Vector rendition of the GSFL dot-matrix mark. Used as the logo fallback while
 * the raster logo loads (or if it fails), and as a decorative brand element.
 */
export function DotMatrixMark({
  className,
  withWordmark = false,
  title = "Giant Star Fashion Ltd.",
}: {
  className?: string;
  withWordmark?: boolean;
  title?: string;
}) {
  const cell = 10;
  const width = MARK_COLS * cell;
  const markHeight = MARK_ROWS * cell;
  const height = withWordmark ? markHeight + 34 : markHeight;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("block", className)}
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      {MARK_DOTS.map((d) => (
        <circle
          key={`${d.x}-${d.y}`}
          cx={d.x * cell + cell / 2}
          cy={d.y * cell + cell / 2}
          r={cell * 0.4}
          fill={d.fill}
        />
      ))}
      {withWordmark ? (
        <>
          <rect x="0" y={markHeight + 5} width={width} height="1.6" fill="#BE151C" />
          <text
            x={width / 2}
            y={markHeight + 24}
            textAnchor="middle"
            fontFamily="var(--font-display), ui-sans-serif, system-ui, sans-serif"
            fontWeight="600"
            fontSize="14.5"
            fill="#021129"
          >
            Giant Star Fashion Ltd.
          </text>
          <rect x="0" y={markHeight + 31} width={width} height="1.6" fill="#BE151C" />
        </>
      ) : null}
    </svg>
  );
}
