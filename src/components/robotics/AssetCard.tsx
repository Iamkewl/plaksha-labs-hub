import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Wrench, User } from "lucide-react";
import type { RoboticsAsset, RoboticsAssetStatus } from "@/lib/placeholder/robotics";
import type { ReactNode } from "react";

const statusConfig: Record<
  RoboticsAssetStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    dotClass: string;
  }
> = {
  AVAILABLE: {
    label: "Available",
    variant: "default",
    dotClass: "bg-emerald-400",
  },
  CHECKED_OUT: {
    label: "Checked Out",
    variant: "secondary",
    dotClass: "bg-amber-400",
  },
  MAINTENANCE: {
    label: "Maintenance",
    variant: "destructive",
    dotClass: "bg-red-400",
  },
};

interface AssetCardProps {
  asset: RoboticsAsset;
  className?: string;
  /** Optional action slot rendered at the bottom of the card */
  action?: ReactNode;
}

export function AssetCard({ asset, className, action }: AssetCardProps) {
  const { label, variant, dotClass } = statusConfig[asset.status];

  return (
    <div
      className={cn(
        "group flex flex-col gap-3.5 rounded-xl border border-white/[0.09] bg-card/70 p-4",
        "transition-all duration-200 ease-snap hover:border-white/[0.17] hover:bg-card/85",
        className
      )}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Icon container */}
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/[0.09]"
            aria-hidden="true"
          >
            <Wrench className="h-4 w-4 text-primary" />
          </span>
          <p className="truncate text-sm font-semibold text-foreground">
            {asset.name}
          </p>
        </div>
        <Badge variant={variant} className="shrink-0 gap-1.5">
          <span
            className={cn("h-1.5 w-1.5 rounded-full", dotClass)}
            aria-hidden="true"
          />
          {label}
        </Badge>
      </div>

      {/* Meta row — category + serial */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="rounded-md border border-white/[0.09] bg-muted/25 px-2 py-0.5">
          {asset.category}
        </span>
        {asset.serial && (
          <span className="font-mono opacity-45">#{asset.serial}</span>
        )}
      </div>

      {/* Checked-out-by row */}
      {asset.assignedTo && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <User className="h-3 w-3 shrink-0" aria-hidden="true" />
          <span>
            Checked out by{" "}
            <span className="font-medium text-foreground">
              {asset.assignedTo.name}
            </span>
          </span>
        </div>
      )}

      {/* Action slot */}
      {action && <div className="mt-1 flex justify-end">{action}</div>}
    </div>
  );
}
