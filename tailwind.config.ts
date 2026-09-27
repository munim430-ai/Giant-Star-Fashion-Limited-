import type { Config } from "tailwindcss";

// Brand palette sampled from the GSFL dot-matrix mark: olive → rust → crimson
// dots, forest-green accents and the navy wordmark.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2rem" },
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        ink: {
          50: "#F4F6FA",
          100: "#E8ECF3",
          200: "#CDD4E2",
          300: "#A3AEC6",
          400: "#7482A2",
          500: "#515F82",
          600: "#3A4768",
          700: "#283454",
          800: "#17223F",
          900: "#0B1733",
          950: "#021129",
        },
        crimson: {
          50: "#FDF2F3",
          100: "#FBE3E5",
          200: "#F6C4C9",
          300: "#EE97A0",
          400: "#E0606E",
          500: "#D8343A",
          600: "#BE151C",
          700: "#A90425",
          800: "#8A0A22",
          900: "#6F0C1F",
        },
        olive: {
          50: "#F7F8EF",
          100: "#EEF1DF",
          200: "#DCE2BC",
          300: "#A6B26A",
          400: "#7A8A34",
          500: "#586719",
          600: "#4A5715",
          700: "#3B4511",
        },
        rust: {
          50: "#FCF5EE",
          100: "#F7E7D8",
          200: "#EDCBAA",
          300: "#D9955E",
          400: "#B8672A",
          500: "#914D14",
          600: "#7A400F",
          700: "#5F320C",
        },
        forest: {
          50: "#F2F8EE",
          100: "#E4F0DC",
          200: "#C3DEB2",
          300: "#7FAE60",
          400: "#3F7D24",
          500: "#2D6215",
          600: "#245012",
          700: "#1B3D0E",
        },
        paper: {
          DEFAULT: "#FAF8F4",
          100: "#F5F2EB",
          200: "#EDE8DD",
          300: "#DDD5C5",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(2.5rem, 1.6rem + 3.6vw, 4.5rem)", { lineHeight: "1.02", letterSpacing: "-0.035em" }],
        "display-lg": ["clamp(2rem, 1.4rem + 2.4vw, 3.25rem)", { lineHeight: "1.06", letterSpacing: "-0.03em" }],
        "display-md": ["clamp(1.5rem, 1.2rem + 1.2vw, 2.125rem)", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
      },
      boxShadow: {
        card: "0 1px 2px rgb(2 17 41 / 0.04), 0 8px 24px -12px rgb(2 17 41 / 0.12)",
        lift: "0 2px 4px rgb(2 17 41 / 0.06), 0 24px 48px -20px rgb(2 17 41 / 0.28)",
      },
      backgroundImage: {
        "dot-grid": "radial-gradient(circle at center, var(--dot-color, rgb(2 17 41 / 0.12)) 1.2px, transparent 1.6px)",
        "brand-rule": "linear-gradient(90deg, #586719 0%, #914D14 30%, #A90425 50%, #914D14 70%, #2D6215 100%)",
      },
      keyframes: {
        marquee: {
          from: { transform: "translate3d(0, 0, 0)" },
          to: { transform: "translate3d(-50%, 0, 0)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
      },
      animation: {
        marquee: "marquee var(--marquee-duration, 40s) linear infinite",
        "pulse-dot": "pulse-dot 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
