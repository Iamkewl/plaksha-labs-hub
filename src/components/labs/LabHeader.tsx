import Link from "next/link";
import { MapPin, Mail, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PlaceholderLab } from "@/lib/placeholder/labs";

const labAccent: Record<
  string,
  {
    kicker: string;
    gradientClass: string;
    stripeClass: string;
    accentText: string;
    accentBg: string;
    accentBorder: string;
    divisionAccentText: string;
    divisionAccentBg: string;
    divisionAccentBorder: string;
  }
> = {
  makerspace: {
    kicker: "Fabrication & Making",
    gradientClass: "lab-makerspace-gradient",
    stripeClass: "lab-stripe-makerspace",
    accentText: "text-[hsl(var(--lab-makerspace))]",
    accentBg: "bg-[hsl(27_96%_61%/0.09)]",
    accentBorder: "border-[hsl(27_96%_61%/0.28)]",
    divisionAccentText: "text-[hsl(var(--lab-makerspace))]",
    divisionAccentBg: "bg-[hsl(27_96%_61%/0.07)]",
    divisionAccentBorder: "border-[hsl(27_96%_61%/0.22)]",
  },
  robotics: {
    kicker: "Robotics & Automation",
    gradientClass: "lab-robotics-gradient",
    stripeClass: "lab-stripe-robotics",
    accentText: "text-[hsl(var(--lab-robotics))]",
    accentBg: "bg-[hsl(239_100%_78%/0.09)]",
    accentBorder: "border-[hsl(239_100%_78%/0.28)]",
    divisionAccentText: "text-[hsl(var(--lab-robotics))]",
    divisionAccentBg: "bg-[hsl(239_100%_78%/0.07)]",
    divisionAccentBorder: "border-[hsl(239_100%_78%/0.22)]",
  },
};

const fallbackAccent = {
  kicker: "Laboratory",
  gradientClass: "",
  stripeClass: "border-t-2 border-primary/35",
  accentText: "text-primary",
  accentBg: "bg-primary/10",
  accentBorder: "border-primary/22",
  divisionAccentText: "text-primary",
  divisionAccentBg: "bg-primary/7",
  divisionAccentBorder: "border-primary/18",
};

interface LabHeaderProps {
  lab: PlaceholderLab;
}

export function LabHeader({ lab }: LabHeaderProps) {
  const accent = labAccent[lab.slug] ?? fallbackAccent;

  const todayLabel = (() => {
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
    const todayHours = lab.hours.find((h) => h.day === today);
    if (!todayHours || todayHours.open === "Closed") return "Closed today";
    return `Open today · ${todayHours.open}–${todayHours.close}`;
  })();

  const isOpenToday = !todayLabel.startsWith("Closed");

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/[0.09] bg-card/60 p-8 backdrop-blur-sm md:p-12",
        accent.stripeClass
      )}
    >
      {/* Background gradient overlay */}
      <div
        className={cn("pointer-events-none absolute inset-0", accent.gradientClass)}
        aria-hidden="true"
      />

      <div className="relative">
        {/* Kicker */}
        <p
          className={cn("text-[0.67rem] font-semibold uppercase", accent.accentText)}
          style={{ letterSpacing: "0.18em" }}
        >
          {accent.kicker}
        </p>

        {/* Lab name — hero tracking */}
        <h1 className="mt-3 text-4xl font-bold leading-tight text-foreground sm:text-5xl plaksha-headline">
          {lab.name}
        </h1>

        {/* Tagline */}
        <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
          {lab.tagline}
        </p>

        {/* Division badges */}
        {lab.divisions.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2" aria-label="Lab divisions">
            {lab.divisions.map((div) => (
              <span
                key={div.slug}
                className={cn(
                  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase",
                  accent.divisionAccentText,
                  accent.divisionAccentBg,
                  accent.divisionAccentBorder
                )}
                style={{ letterSpacing: "0.06em" }}
              >
                {div.name}
              </span>
            ))}
          </div>
        )}

        {/* Meta row */}
        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
            {lab.location}
          </span>

          <span
            className={cn(
              "flex items-center gap-1.5",
              isOpenToday && "text-emerald-400"
            )}
          >
            {/* Pulse dot when open */}
            {isOpenToday && (
              <span
                className="h-1.5 w-1.5 rounded-full bg-emerald-400 status-dot-open"
                aria-hidden="true"
              />
            )}
            <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
            {todayLabel}
          </span>

          <a
            href={`mailto:${lab.contactEmail}`}
            className="flex items-center gap-1.5 transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
          >
            <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
            {lab.contactEmail}
          </a>
        </div>

        {/* CTA */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link href="/auth/signin">
            <Button className="gap-2">
              Sign in to access this lab{" "}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </Link>
          <Link href="/labs">
            <Button variant="outline">All labs</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
