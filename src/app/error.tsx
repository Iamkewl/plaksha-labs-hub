"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

/**
 * Root-level error boundary (src/app/error.tsx).
 * Catches errors that bubble past all nested error.tsx files.
 * Must be "use client" — Next.js requirement.
 */
export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[RootError]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-destructive/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-md space-y-5">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-destructive/20 bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" aria-hidden="true" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Something went wrong
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            An unexpected error occurred. Refreshing the page or returning home
            usually fixes it.
          </p>
          {error.digest && (
            <p className="font-mono text-xs text-muted-foreground/50">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex justify-center gap-3 pt-1">
          <Button variant="outline" onClick={() => reset()}>
            <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
            Try again
          </Button>
          <Link href="/">
            <Button>
              <Home className="mr-2 h-4 w-4" aria-hidden="true" />
              Go home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
