import type { Gauge, SwatchKind } from "@/data/factoryData";
import { cn } from "@/lib/utils";

/**
 * Procedurally drawn knit swatch. Stitch size follows the machine gauge, so a
 * 14G jersey reads finer than a 5/7G chunky cable. Rendered as SVG patterns —
 * no image weight, crisp at any size, identical on server and client.
 */

const W = 240;
const H = 180;
const STITCH: Record<Gauge, number> = { "14G": 5, "12G": 6, "7G": 8, "5/7G": 10 };

type Palette = Record<string, string | undefined>;

/* ------------------------------- geometry --------------------------------- */

/** Closed path for an ellipse rotated by `deg` (positive = clockwise). */
function ellipsePath(cx: number, cy: number, rx: number, ry: number, deg: number) {
  const t = (deg * Math.PI) / 180;
  const dx = ry * Math.sin(t);
  const dy = ry * Math.cos(t);
  const f = (n: number) => +n.toFixed(2);
  const a = `${f(rx)} ${f(ry)} ${deg}`;
  return `M${f(cx + dx)} ${f(cy - dy)}A${a} 0 1 ${f(cx - dx)} ${f(cy + dy)}A${a} 0 1 ${f(cx + dx)} ${f(cy - dy)}Z`;
}

/* -------------------------------- charts ---------------------------------- */

const GEO = [
  ".....##.....",
  "....####....",
  "...##..##...",
  "..##.##.##..",
  ".##.#..#.##.",
  "##.#....#.##",
  "##.#....#.##",
  ".##.#..#.##.",
  "..##.##.##..",
  "...##..##...",
  "....####....",
  ".....##.....",
];

const SNOWFLAKE = [
  "....a....",
  ".a..a..a.",
  "..a.a.a..",
  "...aaa...",
  "aaaa.aaaa",
  "...aaa...",
  "..a.a.a..",
  ".a..a..a.",
  "....a....",
];
const TREE = ["..b..", "..b..", ".bbb.", ".bbb.", "bbbbb", ".bbb.", "bbbbb", "..c..", "..c.."];

const FAIRISLE = [
  "cccccccccccccccc",
  "................",
  "..a...a...a...a.",
  ".aaa.aaa.aaa.aaa",
  "..a...a...a...a.",
  "................",
  "bbbbbbbbbbbbbbbb",
  "................",
  ...SNOWFLAKE.map((row, i) => `${row}.${TREE[i]}.`),
  "................",
  "bbbbbbbbbbbbbbbb",
  "................",
  "a.a.a.a.a.a.a.a.",
  ".a.a.a.a.a.a.a.a",
  "a.a.a.a.a.a.a.a.",
  "................",
];

const BEAR = [
  "..aaa......aaa..",
  ".aaaaa....aaaaa.",
  ".aacaaaaaaaacaa.",
  ".aaaaaaaaaaaaaa.",
  "aaaaaaaaaaaaaaaa",
  "aaaabbaaaabbaaaa",
  "aaaabbaaaabbaaaa",
  "aaaaaaccccaaaaaa",
  "aaaaaccbbccaaaaa",
  "aaaaaccbbccaaaaa",
  ".aaaaccccccaaaa.",
  ".aaaaaaccaaaaaa.",
  "..aaaaaaaaaaaa..",
  "....aaaaaaaa....",
];

const ARGYLE = Array.from({ length: 16 }, (_, y) =>
  Array.from({ length: 16 }, (_, x) => {
    if ((x - y + 16) % 16 === 0 || (x + y) % 16 === 15) return "c";
    return Math.abs(x + 0.5 - 8) + Math.abs(y + 0.5 - 8) <= 8 ? "b" : ".";
  }).join(""),
);

const STRIPE = ["a", "a", "a", "a", "b", "b"];

const POINTELLE_EYELETS: [number, number][] = [
  [6, 1],
  [4, 3],
  [8, 3],
  [2, 5],
  [10, 5],
  [4, 7],
  [8, 7],
  [6, 9],
  [0, 5],
];

/* ------------------------------ primitives -------------------------------- */

function ChartTiles({
  chart,
  palette,
  s,
  x = 0,
  y = 0,
}: {
  chart: string[];
  palette: Palette;
  s: number;
  x?: number;
  y?: number;
}) {
  const rects: React.ReactNode[] = [];
  chart.forEach((row, r) => {
    let start = 0;
    for (let c = 1; c <= row.length; c++) {
      if (c === row.length || row[c] !== row[start]) {
        const fill = palette[row[start]];
        if (fill) {
          rects.push(
            <rect
              key={`${r}-${start}`}
              x={x + start * s}
              y={y + r * s}
              width={(c - start) * s}
              height={s}
              fill={fill}
            />,
          );
        }
        start = c;
      }
    }
  });
  return <g shapeRendering="crispEdges">{rects}</g>;
}

function ChartPattern({ id, chart, palette, s }: { id: string; chart: string[]; palette: Palette; s: number }) {
  return (
    <pattern id={id} width={chart[0].length * s} height={chart.length * s} patternUnits="userSpaceOnUse">
      <ChartTiles chart={chart} palette={palette} s={s} />
    </pattern>
  );
}

/** Shared overlays: knit "V" stitches, purl bumps and soft studio lighting. */
function StitchDefs({ uid, s }: { uid: string; s: number }) {
  const legL = ellipsePath(s * 0.3, s * 0.52, s * 0.19, s * 0.46, -28);
  const legR = ellipsePath(s * 0.7, s * 0.52, s * 0.19, s * 0.46, 28);
  return (
    <>
      <linearGradient id={`${uid}-leg`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.26" />
        <stop offset="0.55" stopColor="#fff" stopOpacity="0.04" />
        <stop offset="1" stopColor="#000" stopOpacity="0.12" />
      </linearGradient>
      <pattern id={`${uid}-v`} width={s} height={s} patternUnits="userSpaceOnUse">
        <path d={`M0 0H${s}V${s}H0Z${legL}${legR}`} fillRule="evenodd" fill="#000" fillOpacity="0.34" />
        <path d={legL + legR} fill={`url(#${uid}-leg)`} />
      </pattern>
      <pattern id={`${uid}-p`} width={s} height={s} patternUnits="userSpaceOnUse">
        <rect width={s} height={s} fill="#000" fillOpacity="0.3" />
        <ellipse cx={s / 2} cy={s * 0.45} rx={s * 0.46} ry={s * 0.24} fill="#fff" fillOpacity="0.16" />
        <ellipse cx={0} cy={s * 0.95} rx={s * 0.46} ry={s * 0.22} fill="#fff" fillOpacity="0.1" />
        <ellipse cx={s} cy={s * 0.95} rx={s * 0.46} ry={s * 0.22} fill="#fff" fillOpacity="0.1" />
      </pattern>
      <radialGradient id={`${uid}-light`} cx="0.25" cy="0.15" r="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.18" />
        <stop offset="0.6" stopColor="#fff" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity="0.22" />
      </radialGradient>
    </>
  );
}

/** Slanted rope segments, repeated above/below so pattern tiles join seamlessly. */
function Rope({
  cx,
  period,
  width,
  deg,
  fill,
  shadow,
  offset = 0,
}: {
  cx: number;
  period: number;
  width: number;
  deg: number;
  fill: string;
  shadow: string;
  offset?: number;
}) {
  return (
    <>
      {[-1, 0, 1].map((k) => {
        const cy = period / 2 + offset + k * period;
        return (
          <g key={k}>
            <path
              d={ellipsePath(cx + 1.5, cy + 2.5, width * 0.28, width * 0.62, deg)}
              fill={shadow}
              fillOpacity="0.55"
            />
            <path d={ellipsePath(cx, cy, width * 0.28, width * 0.62, deg)} fill={fill} />
          </g>
        );
      })}
    </>
  );
}

/* -------------------------------- swatch ---------------------------------- */

export function KnitSwatch({
  id,
  kind,
  colors,
  gauge,
  className,
}: {
  id: string;
  kind: SwatchKind;
  colors: string[];
  gauge: Gauge;
  className?: string;
}) {
  const s = STITCH[gauge];
  const uid = `ks-${id.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [c0, c1 = c0, c2 = c1, c3 = c2] = colors;
  const V = `url(#${uid}-v)`;
  const P = `url(#${uid}-p)`;

  let defs: React.ReactNode = null;
  let body: React.ReactNode;

  switch (kind) {
    case "jacquard":
      defs = <ChartPattern id={`${uid}-chart`} chart={GEO} palette={{ ".": c0, "#": c1 }} s={s} />;
      body = <rect width={W} height={H} fill={`url(#${uid}-chart)`} />;
      break;

    case "fairisle":
      defs = <ChartPattern id={`${uid}-chart`} chart={FAIRISLE} palette={{ ".": c0, a: c1, b: c2, c: c3 }} s={s} />;
      body = <rect width={W} height={H} fill={`url(#${uid}-chart)`} />;
      break;

    case "argyle":
      defs = <ChartPattern id={`${uid}-chart`} chart={ARGYLE} palette={{ ".": c0, b: c1, c: c2 }} s={s} />;
      body = <rect width={W} height={H} fill={`url(#${uid}-chart)`} />;
      break;

    case "stripe":
      defs = <ChartPattern id={`${uid}-chart`} chart={STRIPE} palette={{ a: c0, b: c1 }} s={s} />;
      body = <rect width={W} height={H} fill={`url(#${uid}-chart)`} />;
      break;

    case "motif": {
      const cols = BEAR[0].length;
      const x = Math.round((W / s - cols) / 2) * s;
      const y = Math.round((H / s - BEAR.length) / 2 - 1) * s;
      body = (
        <>
          <rect width={W} height={H} fill={c0} />
          <ChartTiles chart={BEAR} palette={{ a: c1, b: c2, c: c3 }} s={s} x={x} y={y} />
          <rect y={H - 3 * s} width={W} height={s} fill={c1} />
        </>
      );
      break;
    }

    case "pointelle":
      defs = (
        <pattern id={`${uid}-eyelet`} width={12 * s} height={10 * s} patternUnits="userSpaceOnUse">
          {POINTELLE_EYELETS.map(([ex, ey]) => (
            <g key={`${ex}-${ey}`}>
              <circle cx={ex * s + s / 2} cy={ey * s + s / 2} r={s * 0.95} fill="#fff" fillOpacity="0.35" />
              <circle cx={ex * s + s / 2} cy={ey * s + s / 2} r={s * 0.62} fill={c2} />
              <circle cx={ex * s + s / 2} cy={ey * s + s * 0.38} r={s * 0.42} fill="#000" fillOpacity="0.28" />
            </g>
          ))}
        </pattern>
      );
      body = (
        <>
          <rect width={W} height={H} fill={c0} />
          <rect width={W} height={H} fill={V} />
          <rect width={W} height={H} fill={`url(#${uid}-eyelet)`} />
        </>
      );
      break;

    case "tipped": {
      const band = 7 * s;
      body = (
        <>
          <rect width={W} height={H} fill={c0} />
          <rect width={W} height={H - band} fill={V} />
          <rect y={H - band} width={W} height={band} fill={`url(#${uid}-rib)`} />
          <rect y={H - band + 2 * s} width={W} height={s * 2} fill={c2} fillOpacity="0.92" />
          <rect y={H - band + 2 * s} width={W} height={s * 2} fill={V} />
        </>
      );
      defs = <RibPattern uid={uid} s={s} knit={c0} purl={c1} ratio={1} />;
      break;
    }

    case "rib":
      defs = <RibPattern uid={uid} s={s} knit={c0} purl={c1} ratio={2} />;
      body = <rect width={W} height={H} fill={`url(#${uid}-rib)`} />;
      return <SwatchFrame uid={uid} s={s} defs={defs} body={body} className={className} overlay={false} />;

    case "cable": {
      // Tile: moss 4 · purl 1 · cable 6 · purl 1 (stitches)
      const tileW = 12 * s;
      const period = 4 * s;
      const cableX = 5 * s;
      defs = (
        <>
          <pattern id={`${uid}-moss`} width={2 * s} height={2 * s} patternUnits="userSpaceOnUse">
            <rect width={2 * s} height={2 * s} fill={c1} />
            <rect width={s} height={s} fill={c0} />
            <rect x={s} y={s} width={s} height={s} fill={c0} />
          </pattern>
          <pattern id={`${uid}-cable`} width={tileW} height={period} patternUnits="userSpaceOnUse">
            <rect width={4 * s} height={period} fill={`url(#${uid}-moss)`} />
            <rect width={4 * s} height={period} fill={V} />
            <rect x={4 * s} width={s} height={period} fill={c2} />
            <rect x={4 * s} width={s} height={period} fill={P} />
            <rect x={cableX} width={6 * s} height={period} fill={c1} />
            <rect x={cableX} width={6 * s} height={period} fill={P} />
            <Rope cx={cableX + 3 * s} period={period} width={6 * s} deg={-38} fill={c0} shadow={c2} />
            <rect x={cableX} width={6 * s} height={period} fill={V} fillOpacity="0.7" />
            <rect x={11 * s} width={s} height={period} fill={c2} />
            <rect x={11 * s} width={s} height={period} fill={P} />
          </pattern>
        </>
      );
      body = <rect width={W} height={H} fill={`url(#${uid}-cable)`} />;
      return <SwatchFrame uid={uid} s={s} defs={defs} body={body} className={className} overlay={false} />;
    }

    case "chunky-cable": {
      // Tile: purl 2 · braid 8 · purl 2 (stitches); two staggered rope columns form a plait.
      const tileW = 12 * s;
      const period = 4 * s;
      defs = (
        <pattern id={`${uid}-braid`} width={tileW} height={period} patternUnits="userSpaceOnUse">
          <rect width={tileW} height={period} fill={c1} />
          <rect width={tileW} height={period} fill={P} />
          <Rope cx={4.5 * s} period={period} width={4.6 * s} deg={-40} fill={c0} shadow={c2} />
          <Rope cx={7.5 * s} period={period} width={4.6 * s} deg={40} fill={c0} shadow={c2} offset={period / 2} />
          <rect x={2 * s} width={8 * s} height={period} fill={V} fillOpacity="0.65" />
        </pattern>
      );
      body = <rect width={W} height={H} fill={`url(#${uid}-braid)`} />;
      return <SwatchFrame uid={uid} s={s} defs={defs} body={body} className={className} overlay={false} />;
    }
  }

  return (
    <SwatchFrame
      uid={uid}
      s={s}
      defs={defs}
      body={body}
      className={className}
      overlay={kind !== "pointelle" && kind !== "tipped"}
    />
  );
}

function RibPattern({
  uid,
  s,
  knit,
  purl,
  ratio,
}: {
  uid: string;
  s: number;
  knit: string;
  purl: string;
  ratio: number;
}) {
  const w = ratio * s;
  return (
    <>
      <linearGradient id={`${uid}-ribshade`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#000" stopOpacity="0.25" />
        <stop offset="0.5" stopColor="#000" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity="0.25" />
      </linearGradient>
      <pattern id={`${uid}-rib`} width={2 * w} height={s} patternUnits="userSpaceOnUse">
        <rect width={w} height={s} fill={knit} />
        <rect width={w} height={s} fill={`url(#${uid}-v)`} />
        <rect x={w} width={w} height={s} fill={purl} />
        <rect x={w} width={w} height={s} fill={`url(#${uid}-p)`} />
        <rect x={w} width={w} height={s} fill={`url(#${uid}-ribshade)`} />
      </pattern>
    </>
  );
}

function SwatchFrame({
  uid,
  s,
  defs,
  body,
  overlay,
  className,
}: {
  uid: string;
  s: number;
  defs: React.ReactNode;
  body: React.ReactNode;
  overlay: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className={cn("block h-full w-full", className)}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <StitchDefs uid={uid} s={s} />
        {defs}
      </defs>
      {body}
      {overlay ? <rect width={W} height={H} fill={`url(#${uid}-v)`} /> : null}
      <rect width={W} height={H} fill={`url(#${uid}-light)`} />
    </svg>
  );
}
