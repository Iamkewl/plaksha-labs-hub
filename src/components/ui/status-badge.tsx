/**
 * StatusBadge — single source of truth for status pills.
 *
 * Replaces the ad-hoc `statusColors` Record<string, BadgeVariant> pattern
 * that was duplicated across `bookings/page.tsx`, `bookings/new`, admin
 * pages, and the catalog.  Each domain enum maps to a specific Tailwind
 * colour palette so the same status reads consistently everywhere.
 *
 * Variants:
 *   - success  → emerald  (CONFIRMED, COMPLETED, APPROVED, ISSUED, RETURNED)
 *   - info     → sky      (IN_PROGRESS, PENDING_BOM_APPROVAL, ORDERED)
 *   - warning  → amber    (PENDING, MAINTENANCE, DRAFT, LOW_STOCK_ALERT)
 *   - danger   → rose     (CANCELLED, REJECTED, OVERDUE, LOST, RETIRED)
 *   - neutral  → slate    (PENDING_ADMIN_APPROVAL, default)
 *   - brand    → primary  (highlight statuses, e.g. RECEIVED, BOM_APPROVED)
 *
 * Icons are optional but auto-injected for common cases to keep
 * status reading fast.
 */

import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Circle,
  CircleDashed,
  Clock,
  Hourglass,
  Package,
  PackageCheck,
  PackageX,
  RotateCcw,
  Truck,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type StatusVariant =
  | "success"
  | "info"
  | "warning"
  | "danger"
  | "neutral"
  | "brand";

const variantClasses: Record<StatusVariant, string> = {
  success:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  info: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  warning:
    "border-amber-500/35 bg-amber-500/12 text-amber-700 dark:text-amber-300",
  danger: "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300",
  neutral:
    "border-white/15 bg-white/5 text-muted-foreground",
  brand: "border-primary/30 bg-primary/10 text-primary",
};

/**
 * Maps every status enum from the Prisma schema to its visual variant +
 * an optional Lucide icon + a friendly label.  Unknown values fall back
 * to neutral + raw text.
 */
const STATUS_MAP: Record<string, { variant: StatusVariant; icon?: LucideIcon; label?: string }> = {
  // Bookings
  PENDING: { variant: "warning", icon: Clock },
  CONFIRMED: { variant: "success", icon: CheckCircle2 },
  IN_PROGRESS: { variant: "info", icon: Hourglass },
  COMPLETED: { variant: "success", icon: CheckCircle2 },
  CANCELLED: { variant: "danger", icon: X },

  // BOMs
  DRAFT: { variant: "neutral", icon: CircleDashed },
  SUBMITTED: { variant: "info", icon: Truck },
  APPROVED: { variant: "success", icon: CheckCircle2 },
  REJECTED: { variant: "danger", icon: X },

  // Material requests
  PENDING_BOM_APPROVAL: { variant: "warning", icon: Clock },
  PENDING_ADMIN_APPROVAL: { variant: "warning", icon: Clock },
  BOM_REJECTED: { variant: "danger", icon: X },
  PARTIALLY_ISSUED: { variant: "info", icon: Package },
  ISSUED: { variant: "success", icon: PackageCheck },

  // Machine status
  AVAILABLE: { variant: "success", icon: CheckCircle2 },
  IN_USE: { variant: "info", icon: Hourglass },
  MAINTENANCE: { variant: "warning", icon: Wrench },
  RETIRED: { variant: "neutral", icon: Circle },

  // Asset / checkout
  CHECKED_OUT: { variant: "info", icon: Package },
  OUT: { variant: "info", icon: Package },
  RETURNED: { variant: "success", icon: RotateCcw },
  OVERDUE: { variant: "danger", icon: AlertTriangle },
  LOST: { variant: "danger", icon: PackageX },

  // Procurement
  NEW: { variant: "info", icon: CircleDashed },
  ORDERED: { variant: "info", icon: Truck },
  RECEIVED: { variant: "success", icon: PackageCheck },

  // Projects (demo + future)
  ACTIVE: { variant: "info", icon: Hourglass },
  BUILD: { variant: "warning", icon: Wrench },
  REVIEW: { variant: "info", icon: AlertCircle },
  SHIPPED: { variant: "success", icon: CheckCircle2 },
};

export interface StatusBadgeProps {
  status: string;
  /** Override the variant from the default mapping. */
  variant?: StatusVariant;
  /** Override the icon (pass `null` to suppress the default icon). */
  icon?: LucideIcon | null;
  /** Override the human label. */
  label?: string;
  className?: string;
}

export function StatusBadge({
  status,
  variant,
  icon,
  label,
  className,
}: StatusBadgeProps) {
  const entry = STATUS_MAP[status] ?? { variant: "neutral" as StatusVariant };
  const finalVariant = variant ?? entry.variant;
  const Icon = icon === null ? undefined : icon ?? entry.icon;
  const finalLabel = label ?? entry.label ?? prettify(status);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[0.68rem] font-semibold uppercase tracking-[0.06em] transition-colors",
        variantClasses[finalVariant],
        className
      )}
    >
      {Icon && <Icon className="h-3 w-3" aria-hidden="true" />}
      {finalLabel}
    </span>
  );
}

/** Convert "IN_PROGRESS" → "In progress" without a third-party library. */
export function prettify(value: string): string {
  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/^./, (c) => c.toUpperCase());
}

export { STATUS_MAP };
