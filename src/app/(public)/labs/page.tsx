import { PLACEHOLDER_LABS, type PlaceholderLab } from "@/lib/placeholder/labs";
import { getLabs } from "@/app/actions/labs";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { LabsFilterGrid } from "@/components/labs/LabsFilterGrid";

export const metadata = {
  title: "Explore Labs — Plaksha Labs Hub",
  description: "Discover the Makerspace and Robotics Lab at Plaksha University.",
};

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

      {/* Filter chips + lab grid — client component owns interactivity */}
      <LabsFilterGrid labs={labs} />

      {/* Coming soon note */}
      <p className="mt-12 text-center text-sm text-muted-foreground/50">
        More labs will appear here as they come online.
      </p>
    </div>
  );
}
