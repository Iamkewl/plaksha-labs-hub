"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { LabDivision } from "@/lib/placeholder/labs";

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
      <div
        role="group"
        aria-label="Filter by division"
        className="flex flex-wrap gap-2"
      >
        {options.map((opt) => (
          <button
            key={opt.slug}
            type="button"
            onClick={() => setActive(opt.slug)}
            aria-pressed={active === opt.slug}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              active === opt.slug
                ? "border-primary/40 bg-primary/16 text-primary"
                : "border-border bg-transparent text-muted-foreground hover:text-foreground hover:border-border/80"
            )}
          >
            {opt.name}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {filtered.map((div) => (
          <div
            key={div.slug}
            className="rounded-xl border border-border/60 bg-card/85 p-6 backdrop-blur-xl"
          >
            <h3 className="text-lg font-semibold text-foreground">{div.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {div.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
