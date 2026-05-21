"use client";

import { useEffect, useRef, useState } from "react";
import { StaggerGrid } from "@/components/motion/StaggerGrid";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

interface Stat {
  /** The target numeric value for count-up */
  target: number;
  /** Display suffix appended after the number (e.g. "+", "k") */
  suffix: string;
  /** Optional prefix (e.g. "") */
  prefix?: string;
  label: string;
}

const STATS: Stat[] = [
  { target: 1200, suffix: "+", label: "Members" },
  { target: 350, suffix: "+", label: "Projects Built" },
  { target: 500, suffix: "+", label: "Hours Booked" },
  { target: 12, suffix: "", label: "Labs Active" },
];

/**
 * CountUp — animates a number from 0 to `target` over `duration`ms
 * once `active` becomes true. Respects prefers-reduced-motion by
 * jumping straight to the final value when motion is reduced.
 */
function CountUp({
  target,
  suffix,
  prefix = "",
  duration = 1400,
  active,
}: {
  target: number;
  suffix: string;
  prefix?: string;
  duration?: number;
  active: boolean;
}) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    // Honour prefers-reduced-motion
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setDisplay(target);
      return;
    }

    if (!active) return;

    startRef.current = null;

    function step(timestamp: number) {
      if (startRef.current === null) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out expo feel: 1 - (1 - progress)^4
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplay(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    }

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [active, target, duration]);

  return (
    <span>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

/**
 * StatsStrip — four yellow circles with teal stat numbers.
 * Numbers count up from 0 when the strip scrolls into view.
 * Subtitle "And growing every semester." below.
 */
export function StatsStrip() {
  const [active, setActive] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      aria-labelledby="stats-heading"
      className="bg-background px-4 pb-12 pt-16 sm:px-6 sm:pt-20 lg:px-8"
    >
      <h2 id="stats-heading" className="sr-only">
        Platform statistics
      </h2>

      {/* Invisible sentinel at section top for IntersectionObserver */}
      <div ref={sentinelRef} aria-hidden="true" className="pointer-events-none absolute" />

      <StaggerGrid
        className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-8 sm:gap-10"
        baseDelay={0}
        staggerDelay={100}
        threshold={0.15}
      >
        {STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-3">
            {/*
             * Yellow circle — bg-accent = hsl(47 100% 61%) yellow.
             * Teal number (text-primary) on yellow: ~4.6:1 contrast (AA pass).
             * Hover: scale + accent glow shadow.
             */}
            <div
              className="
                flex h-36 w-36 flex-col items-center justify-center
                rounded-full bg-accent
                shadow-accent-glow
                transition-all duration-300
                hover:scale-105 hover:shadow-[0_8px_24px_-6px_hsl(47_100%_61%/0.55)]
                sm:h-40 sm:w-40
              "
              role="presentation"
            >
              <span className="text-3xl font-bold leading-none tracking-tight text-primary sm:text-4xl">
                <CountUp
                  target={stat.target}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                  active={active}
                />
              </span>
              <span className="mt-1.5 text-xs font-medium uppercase tracking-wide text-accent-foreground/80">
                {stat.label}
              </span>
            </div>
          </div>
        ))}
      </StaggerGrid>

      {/* Subtitle below circles */}
      <ScrollReveal delay={300}>
        <p className="mt-10 text-center text-sm font-medium text-muted-foreground">
          And growing every semester.
        </p>
      </ScrollReveal>
    </section>
  );
}
