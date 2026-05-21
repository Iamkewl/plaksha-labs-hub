import Link from "next/link";
import { FlaskConical } from "lucide-react";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

export function PublicFooter() {
  return (
    <footer className="border-t border-border/35 bg-background/55 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ScrollReveal threshold={0.05}>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">

            {/* Brand column */}
            <div className="col-span-1">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-indigo-300">
                  <FlaskConical className="h-3.5 w-3.5 text-[hsl(245_78%_20%)]" aria-hidden="true" />
                </span>
                <span
                  className="text-sm font-semibold uppercase text-foreground/75"
                  style={{ letterSpacing: "0.13em" }}
                >
                  Plaksha Labs Hub
                </span>
              </div>
              <p className="mt-3 max-w-[22ch] text-sm leading-relaxed text-muted-foreground">
                Unified operations for every lab at{" "}
                <span className="font-medium text-foreground/65">
                  Plaksha University
                </span>
                .
              </p>
            </div>

            {/* Labs column */}
            <div>
              <p className="section-kicker mb-4">Labs</p>
              <nav aria-label="Labs navigation" className="space-y-3">
                <Link
                  href="/labs/makerspace"
                  className="group block text-sm text-muted-foreground transition-all duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-0.5 w-3 origin-left scale-x-0 rounded-full bg-[hsl(var(--lab-makerspace))] transition-transform duration-200 group-hover:scale-x-100" aria-hidden="true" />
                    Plaksha Makerspace
                  </span>
                </Link>
                <Link
                  href="/labs/robotics"
                  className="group block text-sm text-muted-foreground transition-all duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-0.5 w-3 origin-left scale-x-0 rounded-full bg-[hsl(var(--lab-robotics))] transition-transform duration-200 group-hover:scale-x-100" aria-hidden="true" />
                    Robotics Lab
                  </span>
                </Link>
              </nav>
            </div>

            {/* Platform column */}
            <div>
              <p className="section-kicker mb-4">Platform</p>
              <nav aria-label="Platform navigation" className="space-y-3">
                <Link
                  href="/labs"
                  className="block text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                >
                  Explore Labs
                </Link>
                <Link
                  href="/auth/signin"
                  className="block text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                >
                  Sign In
                </Link>
              </nav>
            </div>
          </div>
        </ScrollReveal>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border/25 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground/45">
            Built for Plaksha University students and researchers.
          </p>
          <p className="text-xs text-muted-foreground/35">
            Next.js &middot; Tailwind CSS &middot; Prisma
          </p>
        </div>
      </div>
    </footer>
  );
}
