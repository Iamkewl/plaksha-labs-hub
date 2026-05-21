import Link from "next/link";
import { ArrowRight, MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlowCard } from "@/components/motion/GlowCard";
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
    glowColor: string;
  }
> = {
  makerspace: {
    stripeClass: "lab-stripe-makerspace",
    accentText: "text-[hsl(var(--lab-makerspace))]",
    accentBg: "bg-[hsl(27_96%_61%/0.09)]",
    accentBorder: "border-[hsl(27_96%_61%/0.28)]",
    gradientClass: "lab-makerspace-gradient",
    categoryLabel: "Fabrication & Making",
    glowColor: "hsl(27 96% 61% / 0.14)",
  },
  robotics: {
    stripeClass: "lab-stripe-robotics",
    accentText: "text-[hsl(var(--lab-robotics))]",
    accentBg: "bg-[hsl(239_100%_78%/0.09)]",
    accentBorder: "border-[hsl(239_100%_78%/0.28)]",
    gradientClass: "lab-robotics-gradient",
    categoryLabel: "Robotics & Automation",
    glowColor: "hsl(239 100% 78% / 0.14)",
  },
};

const fallbackConfig = {
  stripeClass: "border-t-2 border-primary/35",
  accentText: "text-primary",
  accentBg: "bg-primary/10",
  accentBorder: "border-primary/22",
  gradientClass: "",
  categoryLabel: "Laboratory",
  glowColor: "hsl(239 100% 88% / 0.12)",
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
      <GlowCard
        glowColor={config.glowColor}
        glowRadius={260}
        className={cn(
          "h-full rounded-2xl",
          config.stripeClass
        )}
      >
        <div
          className={cn(
            // Transition: border + shadow + subtle scale lift on hover
            "relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.09] bg-card/75 backdrop-blur-sm",
            "transition-all duration-300 ease-snap",
            "group-hover:border-white/[0.20] group-hover:shadow-card-lift group-hover:-translate-y-1 group-hover:bg-card/85",
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
                "text-[0.67rem] font-semibold uppercase",
                config.accentText
              )}
              style={{ letterSpacing: "0.16em" }}
            >
              {config.categoryLabel}
            </p>

            {/* Heading + division badge */}
            <div className="mt-2.5 flex items-start justify-between gap-3">
              <h3 className="text-xl font-semibold leading-tight tracking-tight text-foreground">
                {lab.name}
              </h3>
              {lab.divisions.length > 0 && (
                <span
                  className={cn(
                    "inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-[0.64rem] font-semibold uppercase",
                    config.accentText,
                    config.accentBg,
                    config.accentBorder
                  )}
                  style={{ letterSpacing: "0.06em" }}
                >
                  {lab.divisions.length} division
                  {lab.divisions.length > 1 ? "s" : ""}
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
              <span className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.09] bg-muted/25 px-2.5 py-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
                {lab.location.split(",")[0]}
              </span>

              {/* Hours chip — green tint when open */}
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs",
                  isOpenToday
                    ? "border-emerald-500/22 bg-emerald-500/7 text-emerald-400"
                    : "border-white/[0.09] bg-muted/25 text-muted-foreground"
                )}
              >
                <Clock className="h-3 w-3 shrink-0" aria-hidden="true" />
                {todayHours}
              </span>
            </div>

            {/* CTA row — arrow slides right on group-hover */}
            <div
              className={cn(
                "mt-6 flex items-center gap-1.5 text-sm font-semibold",
                "transition-all duration-200 ease-snap",
                "group-hover:gap-3",
                config.accentText
              )}
            >
              View lab{" "}
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 ease-snap group-hover:translate-x-1"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </GlowCard>
    </Link>
  );
}
