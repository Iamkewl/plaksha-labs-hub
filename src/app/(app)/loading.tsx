import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading skeleton for the (app) segment root.
 * Reflects the AppShell layout: sidebar + main content area with a dashboard rhythm.
 */
export default function AppRootLoading() {
  return (
    <div className="flex min-h-screen bg-background" aria-busy="true" aria-label="Loading">
      {/* Sidebar skeleton */}
      <aside className="hidden w-56 shrink-0 border-r border-border/50 bg-card/40 lg:block">
        <div className="p-4 space-y-6">
          {/* Logo */}
          <Skeleton className="h-8 w-32" />
          {/* Nav items */}
          <nav className="space-y-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-full rounded-md" />
            ))}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <div className="flex h-14 items-center justify-between border-b border-border/50 bg-card/30 px-4 lg:px-6">
          <Skeleton className="h-5 w-40" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>

        {/* Dashboard content area */}
        <main className="flex-1 p-4 lg:p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Page title */}
            <div className="space-y-1">
              <Skeleton className="h-8 w-56" />
              <Skeleton className="h-4 w-80" />
            </div>
            {/* Stat cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border/50 bg-card p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-4 rounded" />
                  </div>
                  <Skeleton className="h-7 w-16" />
                  <Skeleton className="h-3 w-24" />
                </div>
              ))}
            </div>
            {/* Content cards */}
            <div className="grid gap-6 lg:grid-cols-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border/50 bg-card p-6 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-36" />
                    <Skeleton className="h-8 w-20 rounded-md" />
                  </div>
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <Skeleton key={j} className="h-14 w-full rounded-lg" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
