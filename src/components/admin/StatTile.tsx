import Link from "next/link";
import { cn } from "@/lib/utils";
import { ReactiveMetric } from "@/components/once-ui/reactive-elements";

interface StatTileProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  href?: string;
  variant?: "default" | "warning";
}

export function StatTile({
  title,
  value,
  description,
  icon,
  href,
  variant = "default",
}: StatTileProps) {
  const isNumeric = typeof value === "number";

  const tile = (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-card/75 p-5 backdrop-blur-sm",
        "transition-all duration-200 ease-snap",
        href && "hover:border-white/[0.18] hover:shadow-tile-lift hover:-translate-y-0.5",
        variant === "warning"
          ? "border-orange-500/22 bg-orange-500/[0.04]"
          : "border-white/[0.09]"
      )}
    >
      {/* Top accent line for warning variant */}
      {variant === "warning" && (
        <div
          className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-orange-500/55 to-amber-400/55"
          aria-hidden="true"
        />
      )}

      {/* Header row: label + icon */}
      <div className="flex items-center justify-between gap-3">
        <p
          className="text-[0.67rem] font-semibold uppercase text-muted-foreground"
          style={{ letterSpacing: "0.10em" }}
        >
          {title}
        </p>
        {icon && (
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted/40 opacity-70"
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
      </div>

      {/* Value */}
      <div className="mt-3">
        {isNumeric ? (
          <ReactiveMetric
            value={value}
            className={cn(
              "text-3xl font-bold tabular-nums leading-none",
              variant === "warning" && value > 0 && "text-orange-400"
            )}
          />
        ) : (
          <p className="text-3xl font-bold leading-none">{value}</p>
        )}
        {description && (
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl"
        aria-label={`${title}: ${value}${description ? ` — ${description}` : ""}`}
      >
        {tile}
      </Link>
    );
  }

  return tile;
}
