import Link from "next/link";
import { ArrowRight, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReactiveReveal } from "@/components/once-ui/reactive-elements";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 lg:px-8 lg:pb-32 lg:pt-32"
    >
      {/* Ambient dual-lab glow behind the content */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="hero-glow-makerspace absolute inset-0" />
        <div className="hero-glow-robotics absolute inset-0" />
      </div>

      <div className="relative">
        <ReactiveReveal delay={0} translateY={0.4}>
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
            <FlaskConical
              className="h-3.5 w-3.5 text-primary/80"
              aria-hidden="true"
            />
            <span className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-primary/80">
              Plaksha University &middot; Labs Hub
            </span>
          </div>
        </ReactiveReveal>

        <ReactiveReveal delay={0.06} translateY={0.55}>
          <h1
            id="hero-heading"
            className="max-w-3xl text-5xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-6xl lg:text-7xl"
          >
            One platform.
            <br />
            <span className="bg-gradient-to-r from-primary via-indigo-300 to-primary/60 bg-clip-text text-transparent">
              Every lab
            </span>{" "}
            on campus.
          </h1>
        </ReactiveReveal>

        <ReactiveReveal delay={0.12} translateY={0.45}>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Makerspace. Robotics Lab. Machine catalogs, bookings, component
            inventory, mentor sessions — managed together in one operating
            surface built for Plaksha students.
          </p>
        </ReactiveReveal>

        <ReactiveReveal delay={0.18} translateY={0.35}>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link href="/labs" aria-label="Explore labs at Plaksha">
              <Button size="lg" className="gap-2">
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

        {/* Lab pills — visual hint of what's inside */}
        <ReactiveReveal delay={0.26} translateY={0.3}>
          <div
            className="mt-12 flex flex-wrap items-center gap-3"
            aria-label="Available labs"
          >
            <span className="text-xs text-muted-foreground/60 uppercase tracking-widest">
              Labs
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[hsl(27_96%_61%/0.35)] bg-[hsl(27_96%_61%/0.08)] px-3 py-1 text-xs font-medium text-[hsl(var(--lab-makerspace))]">
              <span
                className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--lab-makerspace))]"
                aria-hidden="true"
              />
              Makerspace
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[hsl(239_100%_78%/0.35)] bg-[hsl(239_100%_78%/0.08)] px-3 py-1 text-xs font-medium text-[hsl(var(--lab-robotics))]">
              <span
                className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--lab-robotics))]"
                aria-hidden="true"
              />
              Robotics Lab
            </span>
            <span className="text-xs text-muted-foreground/40">
              + more coming
            </span>
          </div>
        </ReactiveReveal>
      </div>
    </section>
  );
}
