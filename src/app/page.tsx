import Link from "next/link";
import { ArrowRight, Cpu, Search, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PublicNav } from "@/components/public/PublicNav";
import { PublicFooter } from "@/components/public/PublicFooter";
import { LabCard } from "@/components/labs/LabCard";
import { PLACEHOLDER_LABS } from "@/lib/placeholder/labs";

export default function HomePage() {
  return (
    <div className="app-canvas flex min-h-screen flex-col text-foreground">
      <PublicNav />

      <main className="flex-1">
        <section
          aria-labelledby="hero-heading"
          className="mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 lg:px-8 lg:pt-24"
        >
          <p className="section-kicker">Plaksha Labs Hub</p>
          <h1
            id="hero-heading"
            className="mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            Every lab.
            <br />
            Every tool.
            <br />
            <span className="bg-gradient-to-r from-primary to-indigo-300 bg-clip-text text-transparent">
              One place.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Plaksha Labs Hub unifies the Makerspace and Robotics Lab into a single
            operating surface — machine catalogs, bookings, component inventory, mentor
            sessions, and project showcases, all in one system.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/labs">
              <Button size="lg" className="gap-2">
                Explore Labs <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </section>

        <section
          aria-labelledby="features-heading"
          className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
        >
          <h2 id="features-heading" className="sr-only">
            Platform features
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="surface-panel">
              <CardHeader>
                <Search className="h-6 w-6 text-primary" aria-hidden="true" />
                <CardTitle className="text-xl">Discover</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Browse machine catalogs, component inventories, and lab capabilities
                  across every facility at Plaksha.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="surface-panel">
              <CardHeader>
                <Cpu className="h-6 w-6 text-primary" aria-hidden="true" />
                <CardTitle className="text-xl">Book</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Reserve machines, schedule mentor sessions, and check out tools — all
                  with real-time availability and approval workflows.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="surface-panel">
              <CardHeader>
                <Wrench className="h-6 w-6 text-primary" aria-hidden="true" />
                <CardTitle className="text-xl">Build</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Manage Bill of Materials, track procurement, and publish your completed
                  projects to the public showcase.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        <section
          aria-labelledby="active-labs-heading"
          className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
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
            </div>
            <Link href="/labs">
              <Button variant="outline" className="gap-2">
                View all <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PLACEHOLDER_LABS.map((lab) => (
              <LabCard key={lab.slug} lab={lab} />
            ))}
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
