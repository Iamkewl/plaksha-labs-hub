// Server component — no "use client" needed.
import { LayoutGrid, FolderKanban, ShoppingCart, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProcurementRow } from "@/components/robotics/ProcurementRow";
import {
  PLACEHOLDER_PROCUREMENT,
  PLACEHOLDER_ROBOTICS_PROJECTS,
} from "@/lib/placeholder/robotics";
import { cn } from "@/lib/utils";

// ─── Equipment Availability Heatmap (7 days × 4 slots) ─────────────────────

type SlotState = "free" | "partial" | "full";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
const SLOTS = ["08–11", "11–14", "14–17", "17–20"] as const;

// Deterministic placeholder data — real data would come from a bookings query.
const HEATMAP_DATA: SlotState[][] = [
  ["free", "partial", "full", "partial"],    // Mon
  ["partial", "full", "full", "free"],       // Tue
  ["free", "free", "partial", "full"],       // Wed
  ["full", "partial", "free", "free"],       // Thu
  ["partial", "partial", "full", "partial"], // Fri
  ["free", "free", "free", "partial"],       // Sat
  ["free", "free", "free", "free"],          // Sun
];

const slotStyle: Record<SlotState, string> = {
  free: "bg-emerald-500/25 border-emerald-500/20 text-emerald-300",
  partial: "bg-amber-500/25 border-amber-500/20 text-amber-300",
  full: "bg-destructive/25 border-destructive/20 text-destructive",
};

const slotLabel: Record<SlotState, string> = {
  free: "Free",
  partial: "Partial",
  full: "Full",
};

function EquipmentHeatmap() {
  return (
    <div className="overflow-x-auto">
      {/* Column headers — time slots */}
      <div className="grid min-w-[480px] gap-1">
        <div className="grid grid-cols-[64px_repeat(4,1fr)] gap-1">
          <div />
          {SLOTS.map((slot) => (
            <div
              key={slot}
              className="py-1 text-center text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground"
            >
              {slot}
            </div>
          ))}
        </div>

        {/* Row per day */}
        {DAYS.map((day, di) => (
          <div key={day} className="grid grid-cols-[64px_repeat(4,1fr)] gap-1">
            <div className="flex items-center text-xs font-medium text-muted-foreground">
              {day}
            </div>
            {SLOTS.map((slot, si) => {
              const state = HEATMAP_DATA[di][si];
              return (
                <div
                  key={slot}
                  role="cell"
                  aria-label={`${day} ${slot}: ${slotLabel[state]}`}
                  title={`${day} ${slot}: ${slotLabel[state]}`}
                  className={cn(
                    "h-9 rounded-lg border text-center text-[0.6rem] font-medium leading-9 transition-colors",
                    slotStyle[state]
                  )}
                >
                  {slotLabel[state]}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center gap-3 text-[0.7rem] text-muted-foreground">
        {(["free", "partial", "full"] as SlotState[]).map((s) => (
          <span key={s} className="flex items-center gap-1.5">
            <span
              className={cn("inline-block h-3 w-3 rounded border", slotStyle[s])}
            />
            {slotLabel[s]}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Project → Personnel Mapping ───────────────────────────────────────────

function SectionEmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-10 text-center">
      <FolderKanban className="h-8 w-8 text-muted-foreground/40" aria-hidden="true" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

const divisionBadge: Record<string, "default" | "secondary" | "outline"> = {
  mechanical: "secondary",
  electronics: "default",
  shared: "outline",
};

// ─── Main Component ─────────────────────────────────────────────────────────

export function SharedSection() {
  return (
    <section aria-labelledby="shared-heading" className="space-y-10">
      {/* ── Availability Heatmap ──────────────────────── */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <LayoutGrid className="h-4 w-4 text-primary" aria-hidden="true" />
          <h2
            id="shared-heading"
            className="text-base font-semibold text-foreground"
          >
            Shared Equipment Availability
          </h2>
          <span className="ml-auto text-[0.72rem] text-muted-foreground">
            This week
          </span>
        </div>
        <EquipmentHeatmap />
      </div>

      {/* ── Project ↔ Personnel ───────────────────────── */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <FolderKanban className="h-4 w-4 text-primary" aria-hidden="true" />
          <h2
            id="projects-heading"
            className="text-base font-semibold text-foreground"
          >
            Project — Personnel
          </h2>
        </div>

        {PLACEHOLDER_ROBOTICS_PROJECTS.length === 0 ? (
          <SectionEmptyState message="No active projects." />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {PLACEHOLDER_ROBOTICS_PROJECTS.map((project) => (
              <article
                key={project.id}
                className="rounded-xl border border-white/10 bg-card/60 p-4 hover:bg-card/80 transition-colors"
                aria-labelledby={`proj-${project.id}-name`}
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <p
                    id={`proj-${project.id}-name`}
                    className="text-sm font-medium text-foreground"
                  >
                    {project.name}
                  </p>
                  <Badge variant={divisionBadge[project.division]} className="shrink-0">
                    {project.division}
                  </Badge>
                </div>

                <p className="mb-3 text-[0.72rem] text-muted-foreground">
                  Lead: <span className="text-foreground/80">{project.lead}</span>
                </p>

                {/* Member chips */}
                <div
                  className="flex flex-wrap gap-1.5"
                  aria-label={`Members of ${project.name}`}
                >
                  {project.members.map((member) => (
                    <span
                      key={member}
                      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-muted/40 px-2 py-0.5 text-[0.65rem] text-foreground/70"
                    >
                      <Users className="h-2.5 w-2.5" aria-hidden="true" />
                      {member}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* ── Procurement Tickets ───────────────────────── */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <ShoppingCart className="h-4 w-4 text-primary" aria-hidden="true" />
          <h2
            id="procurement-heading"
            className="text-base font-semibold text-foreground"
          >
            Procurement Tickets
          </h2>
          <span className="ml-auto text-[0.72rem] text-muted-foreground">
            Sorted by arrival
          </span>
        </div>

        {PLACEHOLDER_PROCUREMENT.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <ShoppingCart className="h-8 w-8 text-muted-foreground/40" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">No procurement requests.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {PLACEHOLDER_PROCUREMENT.map((item) => (
              <ProcurementRow key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
