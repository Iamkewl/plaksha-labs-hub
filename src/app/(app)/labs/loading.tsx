import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading skeleton for the (app)/labs segment.
 * Reflects the lab hub page: header + tab-based navigation + content area.
 */
export default function AppLabsLoading() {
  return (
    <div className="p-4 lg:p-6">
      <div className="mx-auto w-full max-w-[1480px] space-y-6">
        {/* Page header */}
        <div className="space-y-1">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>

        {/* Tab list */}
        <div className="flex gap-1 border-b border-border/50">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-28 rounded-t-md" />
          ))}
        </div>

        {/* Lab content cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border border-border/50 bg-card p-6 space-y-4"
            >
              <Skeleton className="h-6 w-40" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
              <Skeleton className="h-9 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
