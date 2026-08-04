import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Token names (bg/gold/plum/etc.) stay the same across the codebase
        // on purpose — only the hex values changed, from the dark theme to
        // the new pearl + deep-accent palette. Nothing in components/ has
        // to be touched for a theme swap like this.
        bg: {
          DEFAULT: "#F2EFEA", // Pearl White — base, 35%+
          surface: "#FBFAF7", // elevated cards, near-white
          raised: "#EFEAE1", // hover / raised state
        },
        ink: {
          DEFAULT: "#2B2230", // deep plum-black — body text
          muted: "#786F7D",
          faint: "#A79FA9",
        },
        gold: {
          DEFAULT: "#6B1E2E", // now burgundy — repointed so remaining "gold" references (quiz UI) stay consistent
          soft: "#8B3A48",
        },
        plum: {
          DEFAULT: "#C9BFDD", // Lavender Mist — soft accent (was plum)
          soft: "#DED7EC",
        },
        aubergine: "#3D1B2E", // signature accent — sparing use only
        burgundy: {
          DEFAULT: "#6B1E2E", // new — deep wine, paired with aubergine/iris
          soft: "#8B3A48",
        },
        stone: "#B7B2AA", // Cool Stone — neutral weight
        mauve: "#A38D8C", // Mauve Taupe — warm secondary accent
        sage: "#A8ADA0", // Silver Sage — cool secondary accent
        // Traditional Wu Xing element colors — used specifically for the
        // Five Element displays so Wood/Fire/Earth/Metal/Water read
        // instantly by color, not just by icon/label.
        elementWood: "#4F7A5B",
        elementFire: "#B3392E",
        elementEarth: "#8B6B48",
        elementMetal: "#9498A0",
        elementWater: "#356387",
        elementAir: "#6E71A0",
        petal: "#F2E2E0", // Petal Pink — soft warm tint
        line: "rgba(43, 34, 48, 0.10)",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(22px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "shape-in": {
          "0%": { opacity: "0", transform: "scale(0.82)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-16px) scale(1.04)" },
        },
        "card-pop": {
          "0%": { opacity: "0", transform: "translateY(14px) scale(0.92)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-150% 0" },
          "100%": { backgroundPosition: "250% 0" },
        },
        "wave-drift": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-33.33%)" },
        },
        "blob-morph": {
          "0%, 100%": {
            borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
            transform: "rotate(0deg) scale(1)",
          },
          "33%": {
            borderRadius: "25% 75% 65% 35% / 45% 65% 35% 55%",
            transform: "rotate(15deg) scale(1.18)",
          },
          "66%": {
            borderRadius: "75% 25% 35% 65% / 35% 75% 25% 65%",
            transform: "rotate(-12deg) scale(0.85)",
          },
        },
      },
      animation: {
        "fade-up": "fade-up 0.9s cubic-bezier(0.22,1,0.36,1) both",
        "shape-in": "shape-in 1.1s cubic-bezier(0.22,1,0.36,1) both",
        "float": "float 7s ease-in-out infinite",
        "card-pop": "card-pop 0.6s cubic-bezier(0.22,1,0.36,1) both",
        "spin-slow": "spin-slow 70s linear infinite",
        "shimmer": "shimmer 18s ease-in-out infinite",
        "wave-drift": "wave-drift 18s linear infinite",
        "blob-morph": "blob-morph 12s ease-in-out infinite",
      },
      backgroundImage: {
        "aurora": "radial-gradient(60% 50% at 50% 0%, rgba(92,96,159,0.12) 0%, rgba(242,239,234,0) 70%)",
        "gold-glow": "radial-gradient(50% 50% at 50% 50%, rgba(92,96,159,0.14) 0%, rgba(242,239,234,0) 75%)",
        "quiz-glow": "radial-gradient(70% 45% at 50% 0%, rgba(242,226,224,0.9) 0%, rgba(242,239,234,0) 65%), radial-gradient(50% 40% at 100% 100%, rgba(201,191,221,0.35) 0%, rgba(242,239,234,0) 70%)",
        "dusk":
          "radial-gradient(45% 60% at 50% 25%, rgba(139,58,72,0.5) 0%, rgba(139,58,72,0) 70%), radial-gradient(160% 100% at 10% -10%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 50%), linear-gradient(135deg, #2E1520 0%, #6B1E2E 48%, #4A4A85 100%)",
        "burgundy-wash":
          "radial-gradient(65% 55% at 78% 8%, rgba(107,30,46,0.22) 0%, rgba(107,30,46,0) 70%), radial-gradient(55% 50% at 8% 95%, rgba(107,30,46,0.14) 0%, rgba(107,30,46,0) 70%), radial-gradient(40% 35% at 50% 45%, rgba(107,30,46,0.06) 0%, rgba(107,30,46,0) 70%)",
      },
    },
  },
  plugins: [],
};
export default config;
