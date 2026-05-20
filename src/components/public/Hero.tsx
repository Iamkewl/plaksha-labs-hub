import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
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
        Plaksha Labs Hub unifies the Makerspace and Robotics Lab into a single operating
        surface — machine catalogs, bookings, component inventory, mentor sessions, and
        project showcases, all in one system.
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
  );
}
