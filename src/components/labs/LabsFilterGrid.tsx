"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { StaggerGrid } from "@/components/motion/StaggerGrid";
import { LabCard } from "@/components/labs/LabCard";
import type { PlaceholderLab } from "@/lib/placeholder/labs";

// -------------------------------------------------------------------
// "Open now" helper — mirrors the day-name + "Closed" logic in LabCard.
// A lab is open if today's entry exists, is not "Closed", and the wall
// clock HH:MM falls strictly within [open, close).
// -------------------------------------------------------------------
const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

function isLabOpenNow(lab: PlaceholderLab): boolean {
  const today = DAY_NAMES[new Date().getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6];
  const entry = lab.hours.find((h) => h.day === today);
  if (!entry || entry.open === "Closed") return false;

  // Parse current wall-clock time as "HH:MM"
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const toMinutes = (hhmm: string): number => {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + (m ?? 0);
  };

  return (
    currentMinutes >= toMinutes(entry.open) &&
    currentMinutes < toMinutes(entry.close)
  );
}

// -------------------------------------------------------------------
// Filter definitions
// -------------------------------------------------------------------
type FilterValue = "all" | "open" | "divisions";

const FILTERS: { label: string; value: FilterValue }[] = [
  { label: "All", value: "all" },
  { label: "Open now", value: "open" },
  { label: "Has divisions", value: "divisions" },
];

function applyFilter(labs: PlaceholderLab[], filter: FilterValue): PlaceholderLab[] {
  switch (filter) {
    case "open":
      return labs.filter(isLabOpenNow);
    case "divisions":
      return labs.filter((lab) => lab.divisions.length > 0);
    case "all":
    default:
      return labs;
  }
}

// -------------------------------------------------------------------
// Component
// -------------------------------------------------------------------
interface LabsFilterGridProps {
  labs: PlaceholderLab[];
}

export function LabsFilterGrid({ labs }: LabsFilterGridProps) {
  const [activeFilter, setActiveFilter] = useState<FilterValue>("all");

  const filtered = applyFilter(labs, activeFilter);

  return (
    <>
      {/* Filter chips */}
      <div
        className="mt-8 flex flex-wrap gap-2"
        role="group"
        aria-label="Filter labs"
      >
        {FILTERS.map((chip) => {
          const isActive = chip.value === activeFilter;
          return (
            <button
              key={chip.value}
              type="button"
              onClick={() => setActiveFilter(chip.value)}
              aria-pressed={isActive}
              className={cn(
                // Base shape + typography
                "rounded-lg border px-3.5 py-1.5 text-sm font-medium transition-colors duration-150",
                // Focus ring — matches rest of the page
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                // Active vs inactive
                isActive
                  ? "border-foreground/20 bg-foreground/10 text-foreground"
                  : "border-border/50 bg-muted/20 text-muted-foreground hover:border-border hover:bg-muted/40 hover:text-foreground"
              )}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* Lab grid */}
      <section aria-labelledby="labs-list-heading" className="mt-10">
        <h2 id="labs-list-heading" className="sr-only">
          Available labs
        </h2>

        {filtered.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            No labs match this filter.
          </p>
        ) : (
          <StaggerGrid
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            staggerDelay={60}
            baseDelay={80}
          >
            {filtered.map((lab) => (
              <LabCard key={lab.slug} lab={lab} />
            ))}
          </StaggerGrid>
        )}
      </section>
    </>
  );
}
