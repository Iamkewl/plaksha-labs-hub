"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { LabDivision } from "@/lib/placeholder/labs";

// Per-division accent styles — warm/cool palette contrast for quick scan
const divisionAccent: Record<
  string,
  {
    active: string;
    card: string;
    dot: string;
  }
> = {
  mechanical: {
    active: "border-amber-500/38 bg-amber-500/10 text-amber-300",
    card: "border-amber-500/18 bg-amber-500/[0.04]",
    dot: "bg-amber-400",
  },
  electronics: {
    active: "border-violet-500/38 bg-violet-500/10 text-violet-300",
    card: "border-violet-500/18 bg-violet-500/[0.04]",
    dot: "bg-violet-400",
  },
};

const fallbackAccent = {
  active: "border-primary/38 bg-primary/10 text-primary",
  card: "border-primary/15 bg-primary/[0.04]",
  dot: "bg-primary",
};

interface DivisionToggleProps {
  divisions: LabDivision[];
}

export function DivisionToggle({ divisions }: DivisionToggleProps) {
  const options = [{ slug: "all", name: "All" }, ...divisions];
  const [active, setActive] = useState("all");

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
                "transition-all duration-150 ease-snap",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isActive
                  ? accent.active
                  : "border-border bg-transparent text-muted-foreground hover:text-foreground hover:border-border/70"
              )}
            >
              {opt.name}
            </button>
          );
        })}
      </div>

      {/* Division cards */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {filtered.map((div) => {
          const accent = divisionAccent[div.slug] ?? fallbackAccent;
          return (
            <div
              key={div.slug}
              className={cn(
                "relative overflow-hidden rounded-xl border p-6 backdrop-blur-sm",
                "transition-colors duration-150",
                accent.card
              )}
            >
              {/* Accent dot — top-right corner */}
              <span
                className={cn(
                  "absolute right-5 top-5 h-2 w-2 rounded-full opacity-70",
                  accent.dot
                )}
                aria-hidden="true"
              />
              <h3 className="text-base font-semibold text-foreground">
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
