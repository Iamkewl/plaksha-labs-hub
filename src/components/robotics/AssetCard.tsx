import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Wrench, User } from "lucide-react";
import type { RoboticsAsset, RoboticsAssetStatus } from "@/lib/placeholder/robotics";

const statusConfig: Record<
  RoboticsAssetStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  AVAILABLE: { label: "Available", variant: "default" },
  CHECKED_OUT: { label: "Checked Out", variant: "secondary" },
  MAINTENANCE: { label: "Maintenance", variant: "destructive" },
};

interface AssetCardProps {
  asset: RoboticsAsset;
  className?: string;
}

export function AssetCard({ asset, className }: AssetCardProps) {
  const { label, variant } = statusConfig[asset.status];

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-white/10 bg-card/60 p-4 transition-colors hover:bg-card/80",
        className
      )}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Wrench className="h-4 w-4 text-primary" aria-hidden="true" />
          </span>
          <p className="truncate text-sm font-medium text-foreground">{asset.name}</p>
        </div>
        <Badge variant={variant} className="shrink-0">
          {label}
        </Badge>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="rounded-md border border-white/10 bg-muted/40 px-2 py-0.5">
          {asset.category}
        </span>
        {asset.serial && (
          <span className="font-mono opacity-60">{asset.serial}</span>
        )}
      </div>

      {/* Assigned-to chip */}
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
    </div>
  );
}
