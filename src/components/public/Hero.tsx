import Link from "next/link";
import { ArrowRight, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReactiveReveal } from "@/components/once-ui/reactive-elements";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 lg:px-8 lg:pb-36 lg:pt-32"
    >
      {/* Ambient dual-lab glow — elliptic for softer falloff */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="hero-glow-makerspace absolute inset-0" />
        <div className="hero-glow-robotics absolute inset-0" />
      </div>

      <div className="relative max-w-3xl">
        {/* Kicker badge */}
        <ReactiveReveal delay={0} translateY={0.4}>
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/[0.10] bg-white/[0.04] px-4 py-1.5 backdrop-blur-sm">
            <FlaskConical
              className="h-3.5 w-3.5 text-primary/70"
              aria-hidden="true"
            />
            <span className="section-kicker" style={{ letterSpacing: "0.16em" }}>
              Plaksha University &middot; Labs Hub
            </span>
          </div>
        </ReactiveReveal>

        {/* Headline — display weight, hero tracking */}
        <ReactiveReveal delay={0.07} translateY={0.55}>
          <h1
            id="hero-heading"
            className="plaksha-headline text-5xl font-bold leading-[1.08] text-foreground sm:text-6xl lg:text-7xl"
          >
            One platform.
            <br />
            <span className="bg-gradient-to-r from-primary via-indigo-300 to-primary/55 bg-clip-text text-transparent">
              Every lab
            </span>{" "}
            on campus.
          </h1>
        </ReactiveReveal>

        {/* Sub-copy */}
        <ReactiveReveal delay={0.14} translateY={0.45}>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            Makerspace. Robotics Lab. Machine catalogs, bookings, component
            inventory, mentor sessions&mdash;managed together in one operating
            surface built for Plaksha students.
          </p>
        </ReactiveReveal>

        {/* CTA row */}
        <ReactiveReveal delay={0.20} translateY={0.35}>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link href="/labs" aria-label="Explore labs at Plaksha">
              <Button
                size="lg"
                className="gap-2 shadow-[0_8px_24px_-8px_hsl(239_100%_88%/0.40)] transition-shadow duration-200 hover:shadow-[0_10px_28px_-8px_hsl(239_100%_88%/0.55)]"
              >
                Explore Labs{" "}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </ReactiveReveal>

        {/* Lab pills */}
        <ReactiveReveal delay={0.28} translateY={0.28}>
          <div
            className="mt-12 flex flex-wrap items-center gap-3"
            aria-label="Available labs"
          >
            <span className="text-xs uppercase tracking-widest text-muted-foreground/50">
              Labs
            </span>

            {/* Makerspace pill */}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[hsl(27_96%_61%/0.32)] bg-[hsl(27_96%_61%/0.07)] px-3 py-1 text-xs font-medium text-[hsl(var(--lab-makerspace))]">
              <span
                className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--lab-makerspace))]"
                aria-hidden="true"
              />
              Makerspace
            </span>

            {/* Robotics pill */}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[hsl(239_100%_78%/0.32)] bg-[hsl(239_100%_78%/0.07)] px-3 py-1 text-xs font-medium text-[hsl(var(--lab-robotics))]">
              <span
                className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--lab-robotics))]"
                aria-hidden="true"
              />
              Robotics Lab
            </span>

            <span className="text-xs text-muted-foreground/35">
              + more coming
            </span>
          </div>
        </ReactiveReveal>
      </div>
    </section>
  );
}
