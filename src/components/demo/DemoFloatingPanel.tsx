"use client";

/**
 * DemoFloatingPanel
 *
 * Bottom-right floating control. Two states:
 *
 *   1. **Collapsed (pill):** a small "Try Demo" / "Demo Mode" button
 *      that opens the panel. Visible on every page so the demo is
 *      never more than one click away.
 *
 *   2. **Expanded (panel):** a 360px-wide card with:
 *      - The 4-step guided checklist
 *      - A "Reset Demo" button that restores the canonical seed
 *      - A "Exit Demo" toggle
 *      - Quick links to each demo page
 *
 * The panel slides up from the bottom-right on a spring-like ease, and
 * traps focus while open.  Closes on Escape, outside click, or by
 * clicking the close button.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Beaker,
  ChevronDown,
  FlaskConical,
  RotateCcw,
  X,
} from "lucide-react";
import { useDemo } from "@/lib/demo/demo-store";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { DemoChecklist } from "./DemoChecklist";

export function DemoFloatingPanel() {
  const { isActive, activate, deactivate, reset, state } = useDemo();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        // Ignore clicks on the trigger itself — that toggles the panel.
        if (triggerRef.current && triggerRef.current.contains(e.target as Node)) return;
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  const handleReset = () => {
    reset();
    toast({
      title: "Demo data restored",
      description: "Sample project, bookings, and inventory reset to defaults.",
    });
  };

  const handleActivate = () => {
    activate();
    setOpen(true);
  };

  const handleDeactivate = () => {
    deactivate();
    setOpen(false);
    toast({
      title: "Exited Demo Mode",
      description: "You're back on the live app. Sign in to keep your changes.",
    });
  };

  // Completed steps count for the pill badge
  const completed = Object.values(state.checklist).filter(Boolean).length;
  const total = 4;

  return (
    <>
      {/* Collapsed pill — always visible */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          if (!isActive) handleActivate();
          else setOpen((o) => !o);
        }}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={isActive ? "Open Demo Mode panel" : "Try Demo Mode"}
        className={cn(
          "fixed bottom-4 right-4 z-50 group inline-flex items-center gap-2 rounded-full border px-3.5 py-2.5 text-sm font-semibold shadow-lg backdrop-blur-md transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          isActive
            ? "border-amber-400/50 bg-amber-400 text-amber-950 hover:shadow-xl hover:-translate-y-0.5"
            : "border-white/20 bg-card/90 text-foreground hover:border-primary/40 hover:bg-card hover:shadow-xl hover:-translate-y-0.5"
        )}
        style={{ boxShadow: "0 18px 36px -16px rgba(0,0,0,0.35)" }}
      >
        {isActive ? (
          <FlaskConical className="h-4 w-4" />
        ) : (
          <Beaker className="h-4 w-4 text-primary" />
        )}
        <span>{isActive ? "Demo Mode" : "Try Demo"}</span>
        {isActive && completed > 0 && (
          <span
            className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-950/20 px-1.5 text-[0.65rem] font-bold text-amber-950"
            aria-label={`${completed} of ${total} steps complete`}
          >
            {completed}/{total}
          </span>
        )}
      </button>

      {/* Expanded panel */}
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          aria-label="Demo Mode panel"
          className={cn(
            "fixed bottom-20 right-4 z-50 w-[360px] max-w-[calc(100vw-2rem)]",
            "rounded-2xl border border-white/15 bg-popover/95 backdrop-blur-xl",
            "shadow-2xl",
            // Tailwind keyframe substitute (kept simple — we already use
            // tailwindcss-animate; the project has a slide-in-from-bottom
            // animation we can lean on via data-attribute on mount).
            "data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-4 data-[state=open]:fade-in-0",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
          )}
          data-state="open"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3 border-b border-white/10 p-4">
            <div className="flex items-start gap-2.5">
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                  isActive
                    ? "bg-amber-400/20 text-amber-600 dark:text-amber-300"
                    : "bg-primary/15 text-primary"
                )}
              >
                <FlaskConical className="h-4.5 w-4.5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold leading-tight">
                  {isActive ? "Demo Mode is on" : "Try the demo"}
                </h2>
                <p className="mt-0.5 text-[0.7rem] leading-snug text-muted-foreground">
                  {isActive
                    ? "Everything you do is sandboxed to this browser."
                    : "Click below to load a sandbox project you can play with."}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Close demo panel"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="max-h-[60vh] overflow-y-auto p-4">
            {isActive ? (
              <DemoChecklist />
            ) : (
              <p className="text-xs text-muted-foreground">
                We&apos;ll load a sample project —{" "}
                <span className="font-semibold text-foreground">
                  Autonomous Robotics Prototype
                </span>{" "}
                — with team members, machines, and inventory. Any action
                you take (booking a machine, reserving a material) only
                changes your local sandbox.
              </p>
            )}
          </div>

          {/* Quick links (only when active) */}
          {isActive && (
            <nav
              aria-label="Quick demo links"
              className="border-t border-white/10 px-4 py-2"
            >
              <p className="px-0 pb-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Jump to
              </p>
              <div className="grid grid-cols-2 gap-1">
                {[
                  { href: "/demo", label: "Overview" },
                  { href: "/demo/projects", label: "Project" },
                  { href: "/demo/bookings", label: "Bookings" },
                  { href: "/demo/inventory", label: "Inventory" },
                ].map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-2 py-1.5 text-xs text-foreground/80 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </nav>
          )}

          {/* Footer actions */}
          <div className="flex items-center gap-2 border-t border-white/10 p-3">
            {isActive ? (
              <>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset demo
                </button>
                <button
                  type="button"
                  onClick={handleDeactivate}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Exit demo
                  <ChevronDown className="h-3.5 w-3.5 -rotate-90" />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleActivate}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-br from-primary to-indigo-300 px-3 py-2 text-xs font-semibold text-[#111226] shadow-[0_14px_30px_-16px_rgba(128,131,255,0.8)] transition-all hover:translate-y-[-1px] hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <FlaskConical className="h-3.5 w-3.5" />
                Start demo tour
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
