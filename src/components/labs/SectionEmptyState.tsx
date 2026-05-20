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
      className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/50 bg-muted/20 px-6 py-16 text-center"
    >
      <span
        className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/50"
        aria-hidden="true"
      >
        <InboxIcon className="h-5 w-5 text-muted-foreground/60" />
      </span>
      <p className="mt-4 text-sm font-semibold text-foreground">{heading}</p>
      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {message}
      </p>
    </div>
  );
}
