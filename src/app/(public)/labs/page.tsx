import { PLACEHOLDER_LABS, type PlaceholderLab } from "@/lib/placeholder/labs";
import { LabCard } from "@/components/labs/LabCard";
import { getLabs } from "@/app/actions/labs";
import { StaggerGrid } from "@/components/motion/StaggerGrid";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

export const metadata = {
  title: "Explore Labs — Plaksha Labs Hub",
  description: "Discover the Makerspace and Robotics Lab at Plaksha University.",
};

const FILTER_CHIPS = [
  { label: "All", value: "all" },
  { label: "Open now", value: "open" },
  { label: "Has divisions", value: "divisions" },
];

/**
 * Map a Prisma Lab row to the PlaceholderLab shape expected by LabCard/LabHeader.
 * Fields not stored in DB (tagline, hours, highlights) fall back to placeholder values
 * or sensible defaults.
 */
function dbLabToPlaceholder(
  dbLab: Awaited<ReturnType<typeof getLabs>>[number]
): PlaceholderLab {
  // Try to find a matching placeholder for richer data
  const ph = PLACEHOLDER_LABS.find((p) => p.slug === dbLab.slug);
  return {
    slug: dbLab.slug as PlaceholderLab["slug"],
    name: dbLab.name,
    tagline: ph?.tagline ?? dbLab.description ?? "",
    description: dbLab.description ?? ph?.description ?? "",
    location: dbLab.location ?? ph?.location ?? "",
    contactEmail: dbLab.contactEmail ?? ph?.contactEmail ?? "",
    hours: ph?.hours ?? [],
    divisions: dbLab.divisions.map((d) => ({
      slug: d.slug,
      name: d.name,
      description: d.description ?? "",
    })),
    highlights: ph?.highlights ?? [],
  };
}

export default async function LabsPage() {
  let labs: PlaceholderLab[];

  try {
    const fromDb = await getLabs();
    labs = fromDb.length
      ? fromDb.map(dbLabToPlaceholder)
      : PLACEHOLDER_LABS;
  } catch {
    labs = PLACEHOLDER_LABS;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      {/* Page header */}
      <ScrollReveal threshold={0.05}>
        <header className="max-w-2xl">
          <p className="section-kicker fade-slide-x">Facilities</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
            Explore Labs
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Plaksha hosts two primary labs — a full-spectrum Makerspace for
            fabrication and prototyping, and a Robotics Lab with dedicated
            Mechanical and Electronics divisions. Sign in to book time, check out
            tools, and manage your projects.
          </p>
        </header>
      </ScrollReveal>

      {/* Filter chips — static until client-side filtering lands */}
      <div
        className="mt-8 flex flex-wrap gap-2"
        role="group"
        aria-label="Filter labs (coming soon)"
      >
        {FILTER_CHIPS.map((chip) => (
          <span
            key={chip.value}
            className="rounded-lg border border-border/50 bg-muted/20 px-3.5 py-1.5 text-sm text-muted-foreground cursor-default select-none"
            aria-disabled="true"
            title="Filters are coming soon"
          >
            {chip.label}
          </span>
        ))}
      </div>

      {/* Lab grid — StaggerGrid handles scroll-driven entrance with 60ms stagger */}
      <section aria-labelledby="labs-list-heading" className="mt-10">
        <h2 id="labs-list-heading" className="sr-only">
          Available labs
        </h2>
        <StaggerGrid
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          staggerDelay={60}
          baseDelay={80}
        >
          {labs.map((lab) => (
            <LabCard key={lab.slug} lab={lab} />
          ))}
        </StaggerGrid>
      </section>

      {/* Coming soon note */}
      <p className="mt-12 text-center text-sm text-muted-foreground/50">
        More labs will appear here as they come online.
      </p>
    </div>
  );
}
