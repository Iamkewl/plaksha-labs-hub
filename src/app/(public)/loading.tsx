import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading skeleton for the public home page.
 * Mirrors the Hero + feature strip + labs grid rhythm.
 */
export default function PublicRootLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Nav placeholder */}
      <div className="h-16 border-b border-border/50 bg-background" aria-hidden="true" />

      <main className="flex-1">
        {/* Hero skeleton */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-2xl text-center space-y-6">
            <Skeleton className="mx-auto h-4 w-24 rounded-full" />
            <Skeleton className="mx-auto h-12 w-3/4" />
            <Skeleton className="mx-auto h-12 w-1/2" />
            <Skeleton className="mx-auto h-5 w-full max-w-lg" />
            <Skeleton className="mx-auto h-5 w-4/5 max-w-lg" />
            <div className="flex justify-center gap-3 pt-2">
              <Skeleton className="h-11 w-36 rounded-xl" />
              <Skeleton className="h-11 w-28 rounded-xl" />
            </div>
          </div>
        </section>

        {/* Feature strip skeleton */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border/50 bg-card/60 p-8 space-y-4"
              >
                <Skeleton className="h-10 w-10 rounded-xl" />
                <Skeleton className="h-5 w-32" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Labs grid skeleton */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div className="space-y-2">
              <Skeleton className="h-3 w-16 rounded-full" />
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-4 w-72" />
            </div>
            <Skeleton className="h-9 w-28 rounded-xl" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-lg border border-border/50 bg-card p-6 space-y-4"
              >
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
                <Skeleton className="h-9 w-full rounded-xl" />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
