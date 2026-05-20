import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FlaskConical } from "lucide-react";

export function PublicNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/40 bg-background/75 backdrop-blur-xl">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Plaksha Labs Hub home"
        >
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-indigo-300 shadow-[0_8px_20px_-8px_hsl(239_100%_88%/0.5)] transition-shadow duration-200 group-hover:shadow-[0_10px_24px_-8px_hsl(239_100%_88%/0.7)]">
            <FlaskConical className="h-4 w-4 text-[#101220]" aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold uppercase tracking-[0.14em] text-foreground/90 transition-colors group-hover:text-foreground">
            Plaksha Labs Hub
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-1">
          <Link
            href="/labs"
            className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Explore Labs
          </Link>
          <Link href="/auth/signin">
            <Button size="sm" className="ml-2">Sign In</Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
