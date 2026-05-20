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

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="py-8 text-center">
      <Icon className="mx-auto h-8 w-8 text-muted-foreground/50" />
      <p className="mt-2 text-sm font-medium">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      {action && (
        <Link href={action.href}>
          <Button variant="outline" size="sm" className="mt-4">
            {action.label}
          </Button>
        </Link>
      )}
    </div>
  );
}
