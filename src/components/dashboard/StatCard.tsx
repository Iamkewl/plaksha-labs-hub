import Link from "next/link";
import { cn } from "@/lib/utils";
import { ReactiveMetric } from "@/components/once-ui/reactive-elements";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  href?: string;
  variant?: "default" | "highlight" | "warning";
}

export function StatCard({
  title,
  value,
  description,
  icon,
  href,
  variant = "default",
}: StatCardProps) {
  const isNumeric = typeof value === "number";

  const card = (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-card/75 p-5 backdrop-blur-sm transition-all duration-200",
        href &&
          "cursor-pointer hover:border-white/20 hover:shadow-[0_16px_40px_-20px_rgba(0,0,0,0.5)]",
        variant === "highlight"
          ? "border-primary/25 bg-primary/5"
          : variant === "warning"
          ? "border-orange-500/25 bg-orange-500/5"
          : "border-white/10"
      )}
    >
      {/* Subtle top accent line for highlight variants */}
      {variant === "highlight" && (
        <div
          className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary/60 to-indigo-300/60"
          aria-hidden="true"
        />
      )}
      {variant === "warning" && (
        <div
          className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-orange-500/60 to-amber-400/60"
          aria-hidden="true"
        />
      )}

      {/* Header row */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
          {title}
        </p>
        {icon && (
          <span className="shrink-0 opacity-80" aria-hidden="true">
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
          <p className="mt-1.5 text-xs text-muted-foreground">{description}</p>
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
        {card}
      </Link>
    );
  }

  return card;
}
