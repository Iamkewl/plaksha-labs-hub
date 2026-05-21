import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * CTAStrip — two pill buttons just below the hero band.
 * "Book Journey" (solid teal) + "Operational Flow" (muted gray).
 */
export function CTAStrip({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-3 bg-background px-4 py-6",
        className
      )}
    >
      <Link
        href="/labs"
        className="inline-flex items-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-teal-glow transition-all duration-200 hover:-translate-y-px hover:shadow-teal-glow-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        Book Journey
      </Link>
      <Link
        href="/labs"
        className="inline-flex items-center rounded-full border border-border bg-card px-6 py-2.5 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:border-border hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        Operational Flow
      </Link>
    </div>
  );
}
