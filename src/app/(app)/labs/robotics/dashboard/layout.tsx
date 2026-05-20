// Server component — renders the lab banner above the tabbed dashboard.
import type { ReactNode } from "react";
import { Cpu, Wrench, Share2 } from "lucide-react";

const DIVISION_CHIPS = [
  { label: "Mechanical", icon: Wrench, class: "border-amber-500/30 bg-amber-500/10 text-amber-300" },
  { label: "Electronics", icon: Cpu, class: "border-violet-500/30 bg-violet-500/10 text-violet-300" },
  { label: "Shared", icon: Share2, class: "border-primary/30 bg-primary/10 text-primary" },
] as const;

export default function RoboticsDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="space-y-6">
      {/* ── Lab Header Banner ─────────────────────────── */}
      <header
        aria-label="Robotics Lab header"
        className="rounded-2xl border border-white/10 bg-card/60 px-6 py-5 backdrop-blur-xl"
      >
        {/* Kicker */}
        <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Plaksha Labs
        </p>

        {/* Lab name */}
        <h1 className="text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl">
          Robotics Lab
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Autonomous systems, built here &mdash; Engineering Block A, Room A-112
        </p>

        {/* Division chips */}
        <div
          className="mt-4 flex flex-wrap gap-2"
          aria-label="Lab divisions"
        >
          {DIVISION_CHIPS.map(({ label, icon: Icon, class: cls }) => (
            <span
              key={label}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.72rem] font-semibold ${cls}`}
            >
              <Icon className="h-3 w-3" aria-hidden="true" />
              {label}
            </span>
          ))}
        </div>

        {/* Quick stats */}
        <div className="mt-4 flex flex-wrap gap-4">
          <Stat label="Assets" value="6" />
          <Stat label="Active Users" value="6" />
          <Stat label="Procurement" value="6 tickets" />
          <Stat label="Open Projects" value="6" />
        </div>
      </header>

      {/* ── Tab content ──────────────────────────────── */}
      <main>{children}</main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
        {label}
      </span>
      <span className="text-lg font-bold text-foreground leading-tight">
        {value}
      </span>
    </div>
  );
}
