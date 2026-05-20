import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FlaskConical } from "lucide-react";

export function PublicNav() {
  return (
    <header className="border-b border-border/60 bg-background/80 backdrop-blur-xl sticky top-0 z-30">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <Link
          href="/"
          className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
          aria-label="Plaksha Labs Hub home"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-indigo-300 text-[0.65rem] font-bold tracking-wide text-[#101220]">
            <FlaskConical className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold uppercase tracking-[0.14em] text-foreground/90">
            Plaksha Labs Hub
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/labs"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md px-2 py-1"
          >
            Explore Labs
          </Link>
          <Link href="/auth/signin">
            <Button size="sm">Sign In</Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
