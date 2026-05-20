import Link from "next/link";
import { ArrowRight, Search, CalendarDays, FolderKanban, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicNav } from "@/components/public/PublicNav";
import { PublicFooter } from "@/components/public/PublicFooter";
import { Hero } from "@/components/public/Hero";
import { LabCard } from "@/components/labs/LabCard";
import { PLACEHOLDER_LABS } from "@/lib/placeholder/labs";

const FEATURES = [
  {
    icon: Search,
    title: "Discover",
    description:
      "Browse machine catalogs, component inventories, and lab capabilities across every Plaksha facility — searchable, filterable, always current.",
    accentClass: "text-primary bg-primary/10",
  },
  {
    icon: CalendarDays,
    title: "Book",
    description:
      "Reserve machines, schedule mentor sessions, and check out tools with real-time availability and approval workflows.",
    accentClass: "text-[hsl(var(--lab-makerspace))] bg-[hsl(27_96%_61%/0.1)]",
  },
  {
    icon: FolderKanban,
    title: "Build",
    description:
      "Manage Bills of Materials, track procurement, and publish completed projects to the public showcase — linked to your lab and team.",
    accentClass: "text-[hsl(var(--lab-robotics))] bg-[hsl(239_100%_78%/0.1)]",
  },
] as const;

export default function HomePage() {
  return (
    <div className="app-canvas flex min-h-screen flex-col text-foreground">
      <PublicNav />

      <main className="flex-1">
        {/* Hero */}
        <Hero />

        {/* Divider */}
        <div
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
          aria-hidden="true"
        >
          <div className="h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
        </div>

        {/* Feature strip */}
        <section
          aria-labelledby="features-heading"
          className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
        >
          <h2 id="features-heading" className="sr-only">
            Platform capabilities
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`stagger-in stagger-in-${i + 1} rounded-2xl border border-white/8 bg-card/60 p-8 backdrop-blur-sm transition-colors duration-200 hover:bg-card/80`}
              >
                <span
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${f.accentClass} mb-5`}
                  aria-hidden="true"
                >
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-semibold leading-tight text-foreground">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
          aria-hidden="true"
        >
          <div className="h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
        </div>

        {/* Active labs grid */}
        <section
          aria-labelledby="active-labs-heading"
          className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="section-kicker">Facilities</p>
              <h2
                id="active-labs-heading"
                className="mt-2 text-3xl font-bold leading-tight tracking-tight text-foreground"
              >
                Active labs
              </h2>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
                Two fully-operational labs, each with their own catalog,
                workflow, and team — all accessible from one sign-in.
              </p>
            </div>
            <Link href="/labs">
              <Button variant="outline" className="gap-2">
                View all <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PLACEHOLDER_LABS.map((lab, i) => (
              <div
                key={lab.slug}
                className={`stagger-in stagger-in-${i + 1}`}
              >
                <LabCard lab={lab} />
              </div>
            ))}
          </div>
        </section>

        {/* CTA section */}
        <section
          aria-labelledby="cta-heading"
          className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-32"
        >
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-card/60 p-10 text-center backdrop-blur-sm md:p-16">
            {/* Ambient */}
            <div
              className="pointer-events-none absolute inset-0 overflow-hidden"
              aria-hidden="true"
            >
              <div className="absolute left-1/2 top-0 -translate-x-1/2 h-64 w-96 rounded-full bg-primary/8 blur-3xl" />
            </div>

            <div className="relative">
              <Wrench className="mx-auto mb-4 h-8 w-8 text-primary/60" aria-hidden="true" />
              <h2
                id="cta-heading"
                className="text-3xl font-bold tracking-tight text-foreground md:text-4xl"
              >
                Ready to start building?
              </h2>
              <p className="mx-auto mt-4 max-w-md text-base text-muted-foreground">
                Sign in with your Plaksha University account to access machine
                bookings, check out tools, and manage your projects.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link href="/auth/signin">
                  <Button size="lg" className="gap-2">
                    Get started{" "}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </Link>
                <Link href="/labs">
                  <Button variant="outline" size="lg">
                    Browse labs
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
