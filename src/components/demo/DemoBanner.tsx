"use client";

/**
 * DemoBanner
 *
 * Slim top banner shown when the user is in Demo Mode. Communicates
 * that mutations are sandboxed and offers a one-click "Exit Demo" CTA.
 *
 * Implementation note:
 *   The banner is rendered with `position: fixed` (NOT sticky) so it
 *   always sits at the very top of the viewport, *above* any sticky
 *   page nav (e.g. the public <PublicNav> at z-30).  z-60 places it
 *   above all other app chrome while remaining below the floating
 *   demo panel (z-50).  This avoids the trap of rendering the banner
 *   inside <main>, where it would be limited to the main content
 *   region and overlap with the page heading.
 */

import Link from "next/link";
import { FlaskConical, X } from "lucide-react";
import { useDemo } from "@/lib/demo/demo-store";

export function DemoBanner() {
  const { deactivate } = useDemo();

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 top-0 z-[60] w-full border-b border-amber-400/30 bg-amber-400/95 text-amber-950 shadow-sm backdrop-blur-sm"
    >
      <div className="mx-auto flex h-9 max-w-7xl items-center gap-3 px-4 text-xs sm:text-sm">
        <FlaskConical className="h-4 w-4 shrink-0" aria-hidden="true" />
        <p className="font-medium">
          <span className="font-semibold">Demo Mode</span>
          <span className="mx-1.5 hidden text-amber-900/60 sm:inline">·</span>
          <span className="hidden text-amber-900/80 sm:inline">
            All changes are sandboxed to your browser. Nothing is saved to
            the live database.
          </span>
        </p>
        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/demo"
            className="rounded-md px-2 py-0.5 text-xs font-semibold underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-900/40"
          >
            Open demo
          </Link>
          <button
            type="button"
            onClick={deactivate}
            className="inline-flex items-center gap-1 rounded-md bg-amber-950/10 px-2 py-0.5 text-xs font-semibold text-amber-950 transition-colors hover:bg-amber-950/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-900/40"
            aria-label="Exit Demo Mode"
          >
            <X className="h-3 w-3" />
            Exit demo
          </button>
        </div>
      </div>
    </div>
  );
}
