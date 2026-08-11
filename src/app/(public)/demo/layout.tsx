/**
 * /demo layout
 *
 * The demo surface lives under (public) so the existing PublicNav /
 * PublicFooter wrap it for free, but we override the chrome a bit so
 * the experience feels sandboxed and self-contained.
 *
 *   - Top: a thin teal "Demo Sandbox" header (replaces the public nav
 *     effect with a more compact one) — kept via the route group's
 *     inherited layout, but we add a side rail of quick links on lg+.
 *   - Background: same `app-canvas` surface as the public site, but
 *     with a very faint dotted overlay to communicate "sandbox".
 *
 * Children are rendered inside a max-w container to keep reading lines
 * comfortable at every viewport.
 */

import type { ReactNode } from "react";
import { DemoSideRail } from "@/components/demo/DemoSideRail";

export const metadata = {
  title: "Try the Demo — Plaksha Labs Hub",
  description:
    "Sandboxed walkthrough of Plaksha Labs Hub: explore a sample project, reserve materials, and book machine time — no signup required.",
};

export default function DemoLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      {/* Faint sandbox overlay — communicates "this is a demo" without
          being visually noisy.  Pure CSS, no JS. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(15,142,146,0.07) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
          <DemoSideRail />
          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
