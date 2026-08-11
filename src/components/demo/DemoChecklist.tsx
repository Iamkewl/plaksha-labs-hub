"use client";

/**
 * DemoChecklist
 *
 * The 4-step guided walkthrough shown inside the floating Demo Mode
 * panel. Steps mark themselves complete as the user visits /demo/*
 * routes, and can be reset individually.
 *
 * Steps and copy live in `lib/demo/demo-types.ts` so they stay in
 * sync between the public surface and the panel.
 */

import Link from "next/link";
import { Check, Circle, RotateCcw, Sparkles } from "lucide-react";
import { DEMO_CHECKLIST, type DemoChecklistKey } from "@/lib/demo/demo-types";
import { useDemo } from "@/lib/demo/demo-store";
import { cn } from "@/lib/utils";

export function DemoChecklist() {
  const { state, markStep, unmarkStep } = useDemo();
  const completed = Object.values(state.checklist).filter(Boolean).length;
  const total = DEMO_CHECKLIST.length;
  const percent = Math.round((completed / total) * 100);

  return (
    <div className="space-y-3">
      <header className="flex items-center justify-between gap-2">
        <div>
          <p className="text-[0.67rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Guided tour
          </p>
          <p className="text-sm font-semibold text-foreground">
            {completed} of {total} steps complete
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold leading-none text-primary">{percent}%</p>
        </div>
      </header>

      {/* Progress bar */}
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
        aria-hidden="true"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-indigo-300 transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Steps */}
      <ol className="mt-2 space-y-1.5">
        {DEMO_CHECKLIST.map((step, idx) => {
          const done = state.checklist[step.key];
          return (
            <li
              key={step.key}
              className={cn(
                "group relative flex items-start gap-2.5 rounded-lg border p-2.5 transition-colors",
                done
                  ? "border-emerald-500/25 bg-emerald-500/[0.04]"
                  : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
              )}
            >
              <button
                type="button"
                onClick={() =>
                  done ? unmarkStep(step.key as DemoChecklistKey) : markStep(step.key as DemoChecklistKey)
                }
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                  done
                    ? "bg-emerald-500 text-white"
                    : "border border-white/30 bg-background text-muted-foreground hover:border-primary hover:text-primary"
                )}
                aria-label={done ? `Mark "${step.title}" incomplete` : `Mark "${step.title}" complete`}
              >
                {done ? (
                  <Check className="h-3 w-3" strokeWidth={3} />
                ) : (
                  <span className="text-[0.6rem] font-bold">{idx + 1}</span>
                )}
              </button>
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "text-xs font-semibold leading-snug",
                    done ? "text-emerald-700 dark:text-emerald-300 line-through decoration-emerald-500/50" : "text-foreground"
                  )}
                >
                  {step.title}
                </p>
                <p className="mt-0.5 line-clamp-2 text-[0.7rem] leading-snug text-muted-foreground">
                  {step.description}
                </p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <Link
                    href={step.href}
                    className="inline-flex items-center gap-1 text-[0.7rem] font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded"
                  >
                    {step.cta}
                  </Link>
                  {done && (
                    <button
                      type="button"
                      onClick={() => unmarkStep(step.key as DemoChecklistKey)}
                      className="inline-flex items-center gap-0.5 text-[0.65rem] text-muted-foreground/70 hover:text-muted-foreground"
                      aria-label={`Reset "${step.title}"`}
                    >
                      <RotateCcw className="h-2.5 w-2.5" />
                      reset
                    </button>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Helper hint */}
      {completed === total ? (
        <div className="mt-2 flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/[0.06] p-2.5 text-[0.7rem] text-emerald-700 dark:text-emerald-300">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <p>
            <span className="font-semibold">Nice — you&apos;ve seen the full loop.</span>{" "}
            Ready to put it to work?{" "}
            <Link href="/auth/signin" className="font-semibold underline">
              Sign in
            </Link>{" "}
            to start your own project.
          </p>
        </div>
      ) : (
        <p className="mt-2 flex items-center gap-1.5 text-[0.65rem] text-muted-foreground/70">
          <Circle className="h-2 w-2" />
          Tip — clicking the circle marks a step done. Visit each step&apos;s page
          to see real-time demo data in action.
        </p>
      )}
    </div>
  );
}
