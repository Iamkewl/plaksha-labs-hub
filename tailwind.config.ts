import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* ── Semantic surface tokens ─────────────────────────────────── */
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        /* ── Lab semantic tokens ─────────────────────────────────────── */
        "lab-makerspace": "hsl(var(--lab-makerspace))",
        "lab-robotics": "hsl(var(--lab-robotics))",
        /* Plaksha brand green — success / institutional */
        "plaksha-green": "hsl(var(--plaksha-green))",
        /* Surface interaction */
        "surface-hover": "hsl(var(--surface-hover))",
      },
      borderRadius: {
        /* Maps to --radius (0.75rem = 12px) */
        lg: "var(--radius)",
        /* Cards use lg; inner elements use md (10px) */
        md: "calc(var(--radius) - 2px)",
        /* Tight chips, tags */
        sm: "calc(var(--radius) - 4px)",
      },
      letterSpacing: {
        /* Kicker / all-caps label spacing — referenced as tracking-kicker */
        kicker: "var(--tracking-kicker, 0.18em)",
        /* Hero headline — tighter than Tailwind's tracking-tight */
        hero: "var(--tracking-hero, -0.03em)",
      },
      boxShadow: {
        /* Card lift shadow — used on hover states */
        "card-lift": "0 20px 48px -20px rgba(0,0,0,0.60)",
        /* Stat tile lift */
        "tile-lift": "0 16px 40px -20px rgba(0,0,0,0.50)",
        /* Modal / elevated surfaces */
        elevated: "0 24px 56px -20px rgba(0,0,0,0.80)",
        /* Nav logo glow — periwinkle */
        "logo-glow": "0 8px 20px -8px hsl(239 100% 88% / 0.50)",
        "logo-glow-strong": "0 10px 24px -8px hsl(239 100% 88% / 0.70)",
      },
      transitionTimingFunction: {
        /* expo ease-out — the canonical snap curve across the system */
        snap: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      animation: {
        /* Aurora orb drift — used in aurora-mesh utility class via CSS        */
        "aurora-1": "aurora-1 28s ease-in-out infinite",
        "aurora-2": "aurora-2 34s ease-in-out infinite",
        "aurora-3": "aurora-3 40s ease-in-out infinite",
        /* Shimmer sweep — skeleton placeholders                               */
        shimmer: "shimmer 1.8s linear infinite",
        /* Scroll-reveal — trigger class applied via JS                        */
        "scroll-reveal": "scroll-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
        /* Ribbon sweep — decorative accent stripe on lab heroes               */
        "ribbon-sweep": "ribbon-sweep 4s linear infinite",
        /* Glow pulse — magnetic CTA button halo                               */
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        /* Stagger in (explicit, mirrors CSS utility) */
        "stagger-in": "stagger-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) both",
        /* Fade slide X */
        "fade-slide-x": "fade-slide-x 0.34s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
      keyframes: {
        "aurora-1": {
          "0%":   { transform: "translate(0%, 0%) scale(1)" },
          "33%":  { transform: "translate(4%, -6%) scale(1.08)" },
          "66%":  { transform: "translate(-3%, 4%) scale(0.95)" },
          "100%": { transform: "translate(0%, 0%) scale(1)" },
        },
        "aurora-2": {
          "0%":   { transform: "translate(0%, 0%) scale(1)" },
          "40%":  { transform: "translate(-5%, 5%) scale(1.12)" },
          "70%":  { transform: "translate(3%, -3%) scale(0.92)" },
          "100%": { transform: "translate(0%, 0%) scale(1)" },
        },
        "aurora-3": {
          "0%":   { transform: "translate(0%, 0%) scale(1.05)" },
          "50%":  { transform: "translate(6%, 4%) scale(0.93)" },
          "100%": { transform: "translate(0%, 0%) scale(1.05)" },
        },
        shimmer: {
          from: { backgroundPosition: "-200% center" },
          to:   { backgroundPosition:  "200% center" },
        },
        "scroll-reveal": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "ribbon-sweep": {
          "0%":   { backgroundPosition: "-200% 50%" },
          "100%": { backgroundPosition:  "200% 50%" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.55", transform: "scale(1)" },
          "50%":      { opacity: "0.80", transform: "scale(1.04)" },
        },
        "stagger-in": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "fade-slide-x": {
          from: { opacity: "0", transform: "translateX(-10px)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
