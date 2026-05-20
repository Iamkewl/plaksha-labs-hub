import { Badge } from "@/components/ui/badge";
import type { RoboticsProcurement } from "@/lib/placeholder/robotics";

type ProcurementStatus = RoboticsProcurement["status"];

const statusConfig: Record<
  ProcurementStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  NEW: { label: "New", variant: "outline" },
  APPROVED: { label: "Approved", variant: "default" },
  ORDERED: { label: "Ordered", variant: "secondary" },
  RECEIVED: { label: "Received", variant: "default" },
  REJECTED: { label: "Rejected", variant: "destructive" },
};

/** Formats an ISO date string as a relative label. */
function formatArrival(iso: string | undefined): string {
  if (!iso) return "TBD";

  const arrival = new Date(iso);
  const now = new Date();

  // Zero out time for day-diff calculation
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const arrDay = new Date(
    arrival.getFullYear(),
    arrival.getMonth(),
    arrival.getDate()
  );
  const diffDays = Math.round(
    (arrDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays < 0) return `${Math.abs(diffDays)}d ago`;
  if (diffDays <= 14) return `In ${diffDays} days`;

  return arrival.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
}

interface ProcurementRowProps {
  item: RoboticsProcurement;
}

export function ProcurementRow({ item }: ProcurementRowProps) {
  const { label, variant } = statusConfig[item.status];
  const arrivalLabel = formatArrival(item.expectedArrival);
  const isTBD = arrivalLabel === "TBD";

  return (
    <div className="flex flex-col gap-1 rounded-lg border border-white/10 bg-card/40 px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
      {/* Item name + requestedBy */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{item.itemName}</p>
        <p className="mt-0.5 text-[0.72rem] text-muted-foreground">
          Requested by {item.requestedBy}
          {item.vendor && <> &middot; {item.vendor}</>}
        </p>
      </div>

      {/* Qty */}
      <span className="text-sm font-mono text-foreground/70 shrink-0">
        ×{item.qty}
      </span>

      {/* Arrival */}
      <span
        className={
          isTBD
            ? "text-xs text-muted-foreground italic shrink-0"
            : "text-xs text-foreground/80 shrink-0 tabular-nums"
        }
        aria-label={`Expected arrival: ${isTBD ? "To be determined" : arrivalLabel}`}
      >
        {arrivalLabel}
      </span>

      {/* Status badge */}
      <Badge variant={variant} className="shrink-0 self-start sm:self-auto">
        {label}
      </Badge>
    </div>
  );
}
