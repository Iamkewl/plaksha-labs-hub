"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * PublicNav — sticky navigation with scroll-aware backdrop lift.
 *
 * At rest (top of page): fully transparent border, minimal blur.
 * After scrolling >40px: border appears, backdrop intensifies, subtle shadow drops.
 *
 * This gives the hero section breathing room while maintaining clarity
 * as soon as content scrolls underneath.
 */
export function PublicNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 transition-all duration-300",
        scrolled
          ? "border-b border-border/40 bg-background/80 backdrop-blur-2xl shadow-[0_1px_24px_-12px_rgba(0,0,0,0.55)]"
          : "border-b border-transparent bg-background/20 backdrop-blur-sm"
      )}
    >
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
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-indigo-300 shadow-logo-glow transition-all duration-200 group-hover:shadow-logo-glow-strong group-hover:scale-[1.06]">
            <FlaskConical className="h-4 w-4 text-[hsl(245_78%_20%)]" aria-hidden="true" />
          </span>

          {/* Wordmark */}
          <span
            className="text-sm font-semibold uppercase text-foreground/80 transition-colors duration-150 group-hover:text-foreground"
            style={{ letterSpacing: "0.13em" }}
          >
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
            <Button
              size="sm"
              className="ml-2 shadow-[0_4px_16px_-6px_hsl(239_100%_88%/0.35)] transition-shadow duration-200 hover:shadow-[0_6px_20px_-6px_hsl(239_100%_88%/0.50)]"
            >
              Sign In
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
