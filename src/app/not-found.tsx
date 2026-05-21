import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

/**
 * Root 404 page.
 * Kicker → big number → sentence → home link.
 * Uses design tokens only: bg-background, text-foreground, text-muted-foreground.
 */
export default function NotFoundPage() {
  return (
    <div className="app-canvas flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      {/* Ambient glow — purely decorative */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-64 w-80 rounded-full bg-primary/6 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-4">
        {/* Kicker */}
        <p className="section-kicker">Page not found</p>

        {/* Big number */}
        <p
          className="text-[8rem] font-bold leading-none tracking-tighter text-foreground/10 select-none sm:text-[11rem]"
          aria-hidden="true"
        >
          404
        </p>

        {/* Headline */}
        <h1 className="-mt-4 text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl">
          This page doesn&apos;t exist
        </h1>

        {/* Supporting copy */}
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          The URL may be misspelled, the page may have been moved, or you may
          not have access. Head back home to find what you need.
        </p>

        {/* CTA */}
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Link href="/">
            <Button size="lg">
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
              Back to home
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="lg">
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
