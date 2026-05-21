import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading skeleton for /admin.
 * Mirrors: AdminSubNav + 6-col stat tiles + 2x2 quick-link cards.
 */
export default function AdminLoading() {
  return (
    <div className="p-4 lg:p-6">
      <div className="mx-auto w-full max-w-[1480px] space-y-6">
        {/* Page title */}
        <div className="space-y-1">
          <Skeleton className="h-9 w-52" />
          <Skeleton className="h-4 w-96" />
        </div>

        {/* 6-column stat tiles — matches lg:grid-cols-6 */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border border-border/50 bg-card p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-4 rounded" />
              </div>
              <Skeleton className="h-7 w-12" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>

        {/* 2x2 quick-link cards — matches lg:grid-cols-2 */}
        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border border-border/50 bg-card p-6 space-y-3"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-8 w-20 rounded-lg" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-9 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
