"use client";

/**
 * DemoSideRail
 *
 * Vertical nav that lives on the left of every /demo/* page (≥ lg).
 * Highlights the active section, hides on mobile, and offers one-click
 * "Reset" / "Exit" actions at the bottom.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Beaker,
  CalendarDays,
  FolderKanban,
  LayoutDashboard,
  Package,
  Wrench,
  X,
} from "lucide-react";
import { useDemo } from "@/lib/demo/demo-store";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const links = [
  { href: "/demo", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/demo/projects", label: "Project", icon: FolderKanban },
  { href: "/demo/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/demo/catalog", label: "Machines", icon: Wrench },
  { href: "/demo/inventory", label: "Inventory", icon: Package },
];

export function DemoSideRail() {
  const pathname = usePathname();
  const { deactivate, reset, isActive: demoActive } = useDemo();

  const isLinkActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname?.startsWith(href + "/");
  };

  const handleReset = () => {
    reset();
    toast({ title: "Demo data restored", description: "Sample state reset." });
  };

  const handleExit = () => {
    deactivate();
    toast({
      title: "Exited Demo Mode",
      description: "Visit /demo anytime to come back.",
    });
  };

  return (
    <aside
      aria-label="Demo navigation"
      className="hidden lg:block lg:sticky lg:top-20 lg:self-start"
    >
      <div className="rounded-2xl border border-white/10 bg-card/60 p-3 backdrop-blur-md">
        <div className="flex items-center gap-2 px-2 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-400/20 text-amber-700 dark:text-amber-300">
            <Beaker className="h-3.5 w-3.5" />
          </span>
          <div className="leading-tight">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Demo sandbox
            </p>
            <p className="text-xs font-semibold">
              {demoActive ? "Demo Mode is on" : "Click \"Try Demo\""}
            </p>
          </div>
        </div>

        <nav className="mt-1 space-y-0.5" aria-label="Demo pages">
          {links.map((l) => {
            const Icon = l.icon;
            const active = isLinkActive(l.href, l.exact);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-3 flex flex-col gap-1 border-t border-white/10 pt-3">
          <button
            type="button"
            onClick={handleReset}
            className="rounded-md px-2 py-1.5 text-left text-[0.7rem] font-semibold text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            ↺ Reset demo data
          </button>
          <button
            type="button"
            onClick={handleExit}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-[0.7rem] font-semibold text-rose-600 transition-colors hover:bg-rose-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:text-rose-300"
          >
            <X className="h-3 w-3" />
            Exit Demo Mode
          </button>
        </div>
      </div>

      <p className="mt-3 px-2 text-[0.65rem] leading-relaxed text-muted-foreground/70">
        All demo data lives in your browser. Refreshing keeps it; &quot;Reset demo data&quot;
        wipes your changes.
      </p>
    </aside>
  );
}
