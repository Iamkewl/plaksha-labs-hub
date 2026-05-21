import type { Config } from "tailwindcss";

const config: Config = {
  /*
   * Dark mode: class-based opt-in.
   * Default is light (:root). Dark is activated by adding .dark to <html>.
   * The Once UI ThemeProvider in providers.tsx controls this via data-theme;
   * the .dark Tailwind class is set separately by the app-shell agent if a
   * theme toggle is wired up.
   *
   * Figma pivot 2026-05-21: teal primary, light-mode default.
   */
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* ── Semantic surface tokens ───────────────────────────────────── */
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",           /* Teal #0F8E92 = HSL 182 80% 32% */
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
          DEFAULT: "hsl(var(--accent))",            /* Yellow #FFD43B = HSL 47 100% 61% */
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

        /* ── App sidebar tokens ────────────────────────────────────────── */
        /* Deep teal sidebar: #0C6E71 = HSL 182 81% 24%                    */
        sidebar: {
          DEFAULT: "hsl(var(--sidebar))",
          foreground: "hsl(var(--sidebar-foreground))",
        },

        /* ── Brand tokens ──────────────────────────────────────────────── */
        /* Plaksha logo leaf green: #5BAA5B = HSL 120 32% 51%              */
        "brand-leaf": "hsl(var(--brand-leaf))",

        /* ── Surface muted — light gray section bg: HSL 0 0% 93% ───────── */
        "surface-muted": "hsl(var(--surface-muted))",
        "surface-muted-foreground": "hsl(var(--surface-muted-foreground))",

        /* ── Lab semantic tokens (secondary indicators) ─────────────────── */
        /* Makerspace: warm amber-orange — no longer brand-primary           */
        "lab-makerspace": "hsl(var(--lab-makerspace))",
        /* Robotics: periwinkle — no longer brand-primary                    */
        "lab-robotics": "hsl(var(--lab-robotics))",

        /* ── Legacy alias — plaksha-green maps to brand-leaf ───────────── */
        "plaksha-green": "hsl(var(--plaksha-green))",

        /* ── Surface interaction ───────────────────────────────────────── */
        "surface-hover": "hsl(var(--surface-hover))",
      },
      borderRadius: {
        /* --radius = 0.75rem (12px) — Figma cards ~10–12px               */
        lg: "var(--radius)",
        /* Inner elements: 10px */
        md: "calc(var(--radius) - 2px)",
        /* Tight chips, tags: 8px */
        sm: "calc(var(--radius) - 4px)",
      },
      letterSpacing: {
        kicker: "var(--tracking-kicker, 0.18em)",
        hero: "var(--tracking-hero, -0.03em)",
      },
      boxShadow: {
        /*
         * Light-mode card lift — Figma uses very diffuse shadows.
         * Much softer than the previous dark-mode values.
         */
        "card-lift": "0 4px 24px -6px rgba(0, 0, 0, 0.10)",
        /* Hover lift */
        "card-lift-hover": "0 8px 32px -8px rgba(0, 0, 0, 0.14)",
        /* Stat tile */
        "tile-lift": "0 4px 20px -6px rgba(0, 0, 0, 0.10)",
        /* Modal / elevated surfaces */
        elevated: "0 8px 40px -12px rgba(0, 0, 0, 0.18)",
        /* Teal glow — CTA buttons, primary interactive elements */
        "teal-glow": "0 8px 20px -8px hsl(182 80% 32% / 0.40)",
        "teal-glow-strong": "0 10px 24px -8px hsl(182 80% 32% / 0.60)",
        /* Yellow accent glow — stat circles */
        "accent-glow": "0 6px 16px -6px hsl(47 100% 61% / 0.50)",
        /* Legacy — kept for backward compat during sibling agent migration */
        "logo-glow": "0 8px 20px -8px hsl(182 80% 32% / 0.40)",
        "logo-glow-strong": "0 10px 24px -8px hsl(182 80% 32% / 0.60)",
      },
      transitionTimingFunction: {
        /* Canonical snap curve — expo ease-out */
        snap: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      animation: {
        /* Aurora orb drift — kept for dark-mode reactivation; suppressed in light mode via CSS */
        "aurora-1": "aurora-1 28s ease-in-out infinite",
        "aurora-2": "aurora-2 34s ease-in-out infinite",
        "aurora-3": "aurora-3 40s ease-in-out infinite",
        /* Shimmer sweep — skeleton placeholders */
        shimmer: "shimmer 1.8s linear infinite",
        /* Scroll-reveal */
        "scroll-reveal": "scroll-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
        /* Ribbon sweep */
        "ribbon-sweep": "ribbon-sweep 4s linear infinite",
        /* Glow pulse — CTA button halo */
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        /* Stagger in */
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
