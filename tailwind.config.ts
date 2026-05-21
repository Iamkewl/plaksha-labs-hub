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
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
