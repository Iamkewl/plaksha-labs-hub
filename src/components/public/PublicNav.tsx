import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FlaskConical } from "lucide-react";

export function PublicNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/35 bg-background/70 backdrop-blur-2xl">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        {/* Logo mark */}
        <Link
          href="/"
          className="group flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Plaksha Labs Hub home"
        >
          {/* Icon container — gradient orb with periwinkle glow */}
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-indigo-300 shadow-logo-glow transition-shadow duration-200 group-hover:shadow-logo-glow-strong">
            <FlaskConical className="h-4 w-4 text-[hsl(245_78%_20%)]" aria-hidden="true" />
          </span>

          {/* Wordmark */}
          <span className="text-sm font-semibold uppercase text-foreground/85 transition-colors duration-150 group-hover:text-foreground" style={{ letterSpacing: "0.13em" }}>
            Plaksha Labs Hub
          </span>
        </Link>

        {/* Right-side links */}
        <div className="flex items-center gap-1">
          <Link
            href="/labs"
            className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Explore Labs
          </Link>
          <Link href="/auth/signin">
            <Button size="sm" className="ml-2">
              Sign In
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
