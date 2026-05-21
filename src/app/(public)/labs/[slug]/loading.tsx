import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading skeleton for /labs/[slug].
 * Mirrors: LabHeader (name + tagline + meta) + LabTabs (4 tabs) + tab panel content.
 */
export default function LabDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      {/* LabHeader skeleton */}
      <div className="space-y-4 pb-8 border-b border-border/50">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            {/* Kicker */}
            <Skeleton className="h-3 w-16 rounded-full" />
            {/* Lab name */}
            <Skeleton className="h-10 w-72 sm:h-12 sm:w-96" />
            {/* Tagline */}
            <Skeleton className="h-5 w-80" />
          </div>
          {/* CTA button */}
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
        {/* Meta row: location + email */}
        <div className="flex flex-wrap gap-4 pt-1">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>

      {/* LabTabs skeleton */}
      <div className="mt-8">
        {/* Tab list */}
        <div className="flex gap-1 border-b border-border/50 pb-0">
          {["Overview", "Divisions", "Hours", "Contact"].map((tab) => (
            <Skeleton key={tab} className="h-9 w-24 rounded-t-md" />
          ))}
        </div>

        {/* Tab panel — overview content */}
        <div className="mt-8 space-y-6 max-w-2xl">
          {/* Heading */}
          <Skeleton className="h-7 w-48" />
          {/* Highlight bullets */}
          <ul className="space-y-3" aria-hidden="true">
            {Array.from({ length: 4 }).map((_, i) => (
              <li key={i} className="flex items-start gap-3">
                <Skeleton className="mt-1.5 h-2 w-2 rounded-full shrink-0" />
                <Skeleton className="h-4 w-full" />
              </li>
            ))}
          </ul>
          {/* Description paragraph */}
          <div className="space-y-2 pt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    </div>
  );
}
