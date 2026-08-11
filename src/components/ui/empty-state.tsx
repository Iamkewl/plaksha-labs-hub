/**
 * EmptyState — reusable, accessible empty state for any list view.
 *
 * Use it whenever a server returns zero results: no bookings yet, no
 * projects, no inventory items, etc.  Designed to be visually warm
 * and immediately actionable — every empty state should answer the
 * user's next question without making them hunt for the CTA.
 *
 * Variants:
 *   - default: white card on tinted background
 *   - ghost:   borderless, more compact (for inline use)
 *   - dashed:  dashed border, feels like a "drop zone" (good for
 *              "create your first X" states)
 */

import Link from "next/link";
import { type LucideIcon, Plus } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "ghost" | "dashed";

export interface EmptyStateAction {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: LucideIcon;
  variant?: "primary" | "outline";
}

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  variant?: Variant;
  /** Optional small content slot (e.g. inline filter chips, tips). */
  footer?: ReactNode;
  className?: string;
}

const variantClasses: Record<Variant, string> = {
  default:
    "rounded-2xl border border-white/10 bg-card/60 p-10 text-center shadow-[0_18px_42px_-32px_rgba(0,0,0,0.6)]",
  ghost: "rounded-2xl bg-transparent p-6 text-center",
  dashed:
    "rounded-2xl border-2 border-dashed border-white/15 bg-white/[0.02] p-10 text-center hover:border-white/25 transition-colors",
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  variant = "default",
  footer,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn(variantClasses[variant], className)} role="status">
      {/* Icon bubble */}
      <div
        className={cn(
          "mx-auto flex h-12 w-12 items-center justify-center rounded-2xl",
          "bg-primary/10 text-primary ring-1 ring-primary/20"
        )}
        aria-hidden="true"
      >
        <Icon className="h-6 w-6" />
      </div>

      {/* Title + description */}
      <h3 className="mt-4 text-base font-semibold tracking-tight text-foreground">
        {title}
      </h3>
      {description && (
        <p className="mx-auto mt-1.5 max-w-md text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}

      {/* Actions */}
      {(primaryAction || secondaryAction) && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {primaryAction && <EmptyStateActionButton action={primaryAction} />}
          {secondaryAction && (
            <EmptyStateActionButton action={secondaryAction} />
          )}
        </div>
      )}

      {/* Optional footer (tips, links, etc.) */}
      {footer && <div className="mt-5 text-xs text-muted-foreground">{footer}</div>}
    </div>
  );
}

function EmptyStateActionButton({ action }: { action: EmptyStateAction }) {
  const Icon = action.icon ?? Plus;
  const base =
    "inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

  const variantClasses = {
    primary:
      "bg-gradient-to-br from-primary to-indigo-300 text-[#111226] shadow-[0_14px_30px_-16px_rgba(128,131,255,0.8)] hover:-translate-y-px hover:brightness-105",
    outline:
      "border border-white/15 bg-card/70 text-foreground hover:border-white/30 hover:bg-card",
  };

  const classes = cn(base, variantClasses[action.variant ?? "primary"]);

  if (action.href) {
    return (
      <Link href={action.href} className={classes}>
        <Icon className="h-4 w-4" />
        {action.label}
      </Link>
    );
  }
  return (
    <button type="button" onClick={action.onClick} className={classes}>
      <Icon className="h-4 w-4" />
      {action.label}
    </button>
  );
}
