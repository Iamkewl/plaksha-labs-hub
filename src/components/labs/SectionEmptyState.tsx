import { InboxIcon } from "lucide-react";

interface SectionEmptyStateProps {
  heading?: string;
  message: string;
}

export function SectionEmptyState({
  heading = "Nothing here yet",
  message,
}: SectionEmptyStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 py-14 text-center"
    >
      <InboxIcon className="h-8 w-8 text-muted-foreground/50" aria-hidden="true" />
      <p className="mt-3 text-sm font-medium text-foreground">{heading}</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
