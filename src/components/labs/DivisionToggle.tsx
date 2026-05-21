"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { LabDivision } from "@/lib/placeholder/labs";

// Per-division accent styles — warm/cool palette contrast for quick scan
const divisionAccent: Record<
  string,
  {
    active: string;
    card: string;
    cardHover: string;
    dot: string;
    dotBg: string;
  }
> = {
  mechanical: {
    active: "border-amber-500/38 bg-amber-500/10 text-amber-300",
    card: "border-amber-500/18 bg-amber-500/[0.04]",
    cardHover: "hover:border-amber-500/32 hover:bg-amber-500/[0.08]",
    dot: "bg-amber-400",
    dotBg: "bg-amber-400/12",
  },
  electronics: {
    active: "border-violet-500/38 bg-violet-500/10 text-violet-300",
    card: "border-violet-500/18 bg-violet-500/[0.04]",
    cardHover: "hover:border-violet-500/32 hover:bg-violet-500/[0.08]",
    dot: "bg-violet-400",
    dotBg: "bg-violet-400/12",
  },
};

const fallbackAccent = {
  active: "border-primary/38 bg-primary/10 text-primary",
  card: "border-primary/15 bg-primary/[0.04]",
  cardHover: "hover:border-primary/28 hover:bg-primary/[0.07]",
  dot: "bg-primary",
  dotBg: "bg-primary/12",
};

interface DivisionToggleProps {
  divisions: LabDivision[];
}

export function DivisionToggle({ divisions }: DivisionToggleProps) {
  const options = [{ slug: "all", name: "All" }, ...divisions];
  const [active, setActive] = useState("all");
  const [prefersReduced, setPrefersReduced] = useState(false);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mql.matches);
    const onChange = () => setPrefersReduced(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const filtered =
    active === "all" ? divisions : divisions.filter((d) => d.slug === active);

  return (
    <div>
      {/* Filter pill buttons */}
      <div
        role="group"
        aria-label="Filter by division"
        className="flex flex-wrap gap-2"
      >
        {options.map((opt) => {
          const accent = divisionAccent[opt.slug] ?? fallbackAccent;
          const isActive = active === opt.slug;
          return (
            <button
              key={opt.slug}
              type="button"
              onClick={() => setActive(opt.slug)}
              aria-pressed={isActive}
              className={cn(
                "rounded-lg border px-3.5 py-1.5 text-sm font-medium",
                "transition-all duration-200 ease-snap",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isActive
                  ? cn(accent.active, "shadow-[0_2px_12px_-4px_rgba(0,0,0,0.35)]")
                  : "border-border bg-transparent text-muted-foreground hover:text-foreground hover:border-border/70"
              )}
            >
              {opt.name}
            </button>
          );
        })}
      </div>

      {/* Division cards — staggered reveal on filter change */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {filtered.map((div, i) => {
          const accent = divisionAccent[div.slug] ?? fallbackAccent;
          return (
            <div
              key={div.slug}
              ref={(el) => {
                if (el) cardRefs.current.set(div.slug, el);
                else cardRefs.current.delete(div.slug);
              }}
              className={cn(
                "group relative overflow-hidden rounded-xl border p-6 backdrop-blur-sm",
                "transition-all duration-200 ease-snap",
                accent.card,
                accent.cardHover,
                "hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.45)] hover:-translate-y-0.5",
                // Staggered entrance animation via CSS delay
                !prefersReduced && "stagger-in"
              )}
              style={
                !prefersReduced
                  ? { animationDelay: `${i * 60}ms` }
                  : undefined
              }
            >
              {/* Accent dot — top-right, with soft glow halo */}
              <span
                className={cn(
                  "absolute right-5 top-5 flex h-5 w-5 items-center justify-center rounded-full",
                  accent.dotBg,
                  "transition-transform duration-200 group-hover:scale-110"
                )}
                aria-hidden="true"
              >
                <span
                  className={cn("h-2 w-2 rounded-full", accent.dot)}
                />
              </span>

              <h3 className="pr-8 text-base font-semibold text-foreground">
                {div.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {div.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
