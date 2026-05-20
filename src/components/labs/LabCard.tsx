import Link from "next/link";
import { ArrowRight, MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PlaceholderLab } from "@/lib/placeholder/labs";

/** Returns today's open/close label for a lab */
function getTodayHours(lab: PlaceholderLab): string {
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ] as const;
  const today = dayNames[new Date().getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6];
  const hours = lab.hours.find((h) => h.day === today);
  if (!hours || hours.open === "Closed") return "Closed today";
  return `${hours.open}–${hours.close}`;
}

const labConfig: Record<
  string,
  {
    stripeClass: string;
    accentText: string;
    accentBg: string;
    accentBorder: string;
    gradientClass: string;
    categoryLabel: string;
  }
> = {
  makerspace: {
    stripeClass: "lab-stripe-makerspace",
    accentText: "text-[hsl(var(--lab-makerspace))]",
    accentBg: "bg-[hsl(27_96%_61%/0.1)]",
    accentBorder: "border-[hsl(27_96%_61%/0.3)]",
    gradientClass: "lab-makerspace-gradient",
    categoryLabel: "Fabrication & Making",
  },
  robotics: {
    stripeClass: "lab-stripe-robotics",
    accentText: "text-[hsl(var(--lab-robotics))]",
    accentBg: "bg-[hsl(239_100%_78%/0.1)]",
    accentBorder: "border-[hsl(239_100%_78%/0.3)]",
    gradientClass: "lab-robotics-gradient",
    categoryLabel: "Robotics & Automation",
  },
};

const fallbackConfig = {
  stripeClass: "border-t-2 border-primary/40",
  accentText: "text-primary",
  accentBg: "bg-primary/10",
  accentBorder: "border-primary/25",
  gradientClass: "",
  categoryLabel: "Laboratory",
};

interface LabCardProps {
  lab: PlaceholderLab;
  className?: string;
}

export function LabCard({ lab, className }: LabCardProps) {
  const config = labConfig[lab.slug] ?? fallbackConfig;
  const todayHours = getTodayHours(lab);
  const isOpenToday = !todayHours.startsWith("Closed");

  return (
    <Link
      href={`/labs/${lab.slug}`}
      className={cn(
        "group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl",
        className
      )}
      aria-label={`View ${lab.name}`}
    >
      <div
        className={cn(
          "relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-card/75 backdrop-blur-sm transition-all duration-200 hover:border-white/20 hover:shadow-[0_20px_48px_-20px_rgba(0,0,0,0.6)]",
          config.stripeClass
        )}
      >
        {/* Subtle gradient overlay matching lab accent */}
        <div
          className={cn("pointer-events-none absolute inset-0", config.gradientClass)}
          aria-hidden="true"
        />

        {/* Card body */}
        <div className="relative flex flex-1 flex-col p-6">
          {/* Category kicker */}
          <p
            className={cn(
              "text-[0.68rem] font-semibold uppercase tracking-[0.16em]",
              config.accentText
            )}
          >
            {config.categoryLabel}
          </p>

          {/* Heading + division badge */}
          <div className="mt-2 flex items-start justify-between gap-3">
            <h3 className="text-xl font-semibold leading-tight text-foreground transition-colors group-hover:text-foreground">
              {lab.name}
            </h3>
            {lab.divisions.length > 0 && (
              <span
                className={cn(
                  "inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.06em]",
                  config.accentText,
                  config.accentBg,
                  config.accentBorder
                )}
              >
                {lab.divisions.length} division{lab.divisions.length > 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Tagline */}
          <p className={cn("mt-1 text-sm font-medium", config.accentText)}>
            {lab.tagline}
          </p>

          {/* Description */}
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {lab.description}
          </p>

          {/* Chips row */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {/* Location chip */}
            <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-muted/30 px-2.5 py-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
              {lab.location.split(",")[0]}
            </span>

            {/* Hours chip */}
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs",
                isOpenToday
                  ? cn("border-emerald-500/25 bg-emerald-500/8 text-emerald-400")
                  : "border-white/10 bg-muted/30 text-muted-foreground"
              )}
            >
              <Clock className="h-3 w-3 shrink-0" aria-hidden="true" />
              {todayHours}
            </span>
          </div>

          {/* CTA row */}
          <div
            className={cn(
              "mt-6 flex items-center gap-1.5 text-sm font-semibold transition-all duration-150",
              config.accentText,
              "group-hover:gap-2.5"
            )}
          >
            View lab{" "}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </div>
        </div>
      </div>
    </Link>
  );
}
