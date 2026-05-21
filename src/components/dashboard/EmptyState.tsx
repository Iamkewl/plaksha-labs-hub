import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/45 bg-muted/12 px-6 py-14 text-center">
      {/* Icon container */}
      <span
        className="flex h-11 w-11 items-center justify-center rounded-full bg-muted/40"
        aria-hidden="true"
      >
        <Icon className="h-5 w-5 text-muted-foreground/50" />
      </span>
      <p className="mt-4 text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-muted-foreground">
        {description}
      </p>
      {action && (
        <Link href={action.href} className="mt-5">
          <Button variant="outline" size="sm">
            {action.label}
          </Button>
        </Link>
      )}
    </div>
  );
}
