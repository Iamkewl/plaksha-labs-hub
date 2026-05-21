import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { StaggerGrid } from "@/components/motion/StaggerGrid";
import { Wrench, Clock, Users, Share2 } from "lucide-react";

interface FeatureItem {
  icon: React.ElementType;
  title: string;
  description: string;
  accent: string; // Tailwind bg for icon ring
}

const FEATURES: FeatureItem[] = [
  {
    icon: Clock,
    title: "Request machine time",
    description:
      "Book CNC, laser cutters, 3D printers, and specialised equipment through a single unified calendar.",
    accent: "bg-primary/10 text-primary ring-1 ring-primary/20",
  },
  {
    icon: Users,
    title: "Mentor and approval support",
    description:
      "Every session is backed by a mentor sign-off — safety and guidance built into the workflow.",
    accent: "bg-[hsl(225_80%_55%/0.10)] text-[hsl(225_80%_45%)] ring-1 ring-[hsl(225_80%_55%/0.20)]",
  },
  {
    icon: Wrench,
    title: "Build with governed access",
    description:
      "Role-based permissions mean students, mentors, and admins each see exactly what they need.",
    accent: "bg-[hsl(27_90%_45%/0.10)] text-[hsl(27_90%_40%)] ring-1 ring-[hsl(27_90%_45%/0.20)]",
  },
  {
    icon: Share2,
    title: "Showcase projects publicly",
    description:
      "Publish finished builds to the public gallery so your work lives beyond the semester.",
    accent: "bg-brand-leaf/10 text-brand-leaf ring-1 ring-brand-leaf/20",
  },
];

/**
 * WhatHappensHere — four-feature grid on a muted surface.
 * Each feature card has a tinted icon, bold title, and supporting copy.
 * Cards stagger in on scroll via StaggerGrid.
 *
 * Two-column at md, four-column at lg — dense but not crowded.
 * A top-left background teal tint (low opacity radial) adds warmth.
 */
export function WhatHappensHere() {
  return (
    <section
      aria-labelledby="what-happens-heading"
      className="relative overflow-hidden bg-surface-muted px-4 py-14 sm:px-6 sm:py-20 lg:px-8"
    >
      {/* Subtle teal warmth in the top-left corner */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full"
        style={{
          background:
            "radial-gradient(circle, hsl(182 80% 32% / 0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="mb-10">
            <p className="section-kicker mb-2 text-primary">How it works</p>
            <h2
              id="what-happens-heading"
              className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
            >
              What Happens Here?
            </h2>
            <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-muted-foreground sm:text-base">
              One platform. Every step of the build journey — from booking to
              build to showcase.
            </p>
          </div>
        </ScrollReveal>

        <StaggerGrid
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          baseDelay={0}
          staggerDelay={80}
          threshold={0.15}
        >
          {FEATURES.map(({ icon: Icon, title, description, accent }) => (
            <div
              key={title}
              className="
                group flex flex-col gap-4 rounded-xl border border-border
                bg-card p-5
                shadow-[0_2px_12px_-4px_rgba(0,0,0,0.07)]
                transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                hover:-translate-y-1 hover:shadow-[0_8px_28px_-6px_rgba(0,0,0,0.11)]
              "
            >
              {/* Icon */}
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${accent} transition-colors duration-300`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>

              {/* Copy */}
              <div>
                <p className="text-sm font-semibold leading-snug text-foreground">
                  {title}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
