import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading skeleton for /labs.
 * Mirrors: page header (kicker + h1 + description), filter chips, 3-col lab card grid.
 */
export default function LabsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      {/* Page header */}
      <header className="max-w-2xl space-y-3">
        <Skeleton className="h-3 w-20 rounded-full" />
        <Skeleton className="h-10 w-64 sm:h-12 sm:w-80" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full max-w-xl" />
          <Skeleton className="h-4 w-5/6 max-w-xl" />
          <Skeleton className="h-4 w-4/6 max-w-xl" />
        </div>
      </header>

      {/* Filter chips */}
      <div className="mt-8 flex flex-wrap gap-2" aria-hidden="true">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-lg" />
        ))}
      </div>

      {/* Lab card grid — 3 columns on lg, matches page output */}
      <section className="mt-10">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border border-border/50 bg-card p-6 space-y-4"
            >
              {/* Card header */}
              <div className="flex items-start justify-between">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              {/* Tagline */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
              {/* Meta row */}
              <div className="flex gap-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
              {/* Division chips */}
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              {/* CTA */}
              <Skeleton className="h-9 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
