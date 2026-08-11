"use client";

/**
 * DemoProvider
 *
 * Mounted once at the root of the app inside <Providers>. Responsibilities:
 *
 *   1. Hydrate the in-memory demo store from localStorage on first mount
 *      so the toggle persists across refreshes.
 *   2. Render the floating "Try Demo" pill / "Demo Mode" panel in the
 *      bottom-right corner of every page.
 *   3. Render the optional <DemoBanner> across the top of the app
 *      when demo mode is on, so users always know they're in the sandbox.
 *
 * The provider itself is purely a side-effect host — it does not add
 * any wrapping DOM, so server components in the public route group
 * remain unaffected.
 */

import { useEffect, useState, type ReactNode } from "react";
import {
  hydrateDemoFromStorage,
  useDemo,
} from "@/lib/demo/demo-store";
import { DemoFloatingPanel } from "./DemoFloatingPanel";
import { DemoBanner } from "./DemoBanner";

export function DemoProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { isActive } = useDemo();

  // Hydrate once after first client render.
  useEffect(() => {
    hydrateDemoFromStorage();
    setMounted(true);
  }, []);

  // Avoid hydration mismatches — render the floating UI only after mount.
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <>
      {children}

      {/* Top banner — only visible while demo mode is on. */}
      {isActive && <DemoBanner />}

      {/* Floating control panel — always present, collapses to a pill. */}
      <DemoFloatingPanel />
    </>
  );
}
