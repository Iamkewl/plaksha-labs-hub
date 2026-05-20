import { Mail, MapPin } from "lucide-react";
import { PLACEHOLDER_LABS, type PlaceholderLab } from "@/lib/placeholder/labs";
import { LabHeader } from "@/components/labs/LabHeader";
import { LabTabs } from "@/components/labs/LabTabs";
import { LabSection } from "@/components/labs/LabSection";
import { DivisionToggle } from "@/components/labs/DivisionToggle";
import { SectionEmptyState } from "@/components/labs/SectionEmptyState";
import { getLabs, getLabBySlug } from "@/app/actions/labs";

interface PageProps {
  params: { slug: string };
}

/**
 * Map a Prisma Lab row to the PlaceholderLab shape.
 * Merges rich placeholder data (tagline, hours, highlights) with live DB fields.
 */
function dbLabToPlaceholder(
  dbLab: Awaited<ReturnType<typeof getLabBySlug>>,
  ph?: PlaceholderLab
): PlaceholderLab | null {
  if (!dbLab) return null;
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

export async function generateStaticParams() {
  // Seed with placeholder slugs so the page builds even without a DB connection
  try {
    const fromDb = await getLabs();
    if (fromDb.length) {
      return fromDb.map((lab) => ({ slug: lab.slug }));
    }
  } catch {
    // DB not available at build time — fall back to placeholder slugs
  }
  return PLACEHOLDER_LABS.map((lab) => ({ slug: lab.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const ph = PLACEHOLDER_LABS.find((l) => l.slug === params.slug);
  try {
    const dbLab = await getLabBySlug(params.slug);
    if (dbLab) {
      return {
        title: `${dbLab.name} — Plaksha Labs Hub`,
        description: dbLab.description ?? ph?.tagline ?? "",
      };
    }
  } catch {
    // fall through to placeholder
  }
  if (!ph) return { title: "Lab not found — Plaksha Labs Hub" };
  return {
    title: `${ph.name} — Plaksha Labs Hub`,
    description: ph.tagline,
  };
}

export default async function LabDetailPage({ params }: PageProps) {
  const ph = PLACEHOLDER_LABS.find((l) => l.slug === params.slug);

  let lab: PlaceholderLab | null = null;
  try {
    const dbLab = await getLabBySlug(params.slug);
    lab = dbLabToPlaceholder(dbLab, ph);
  } catch {
    lab = ph ?? null;
  }

  // Final fallback to placeholder if DB returned nothing
  if (!lab && ph) {
    lab = ph;
  }

  if (!lab) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionEmptyState
          heading="Lab not found"
          message={`No lab exists at "${params.slug}". Check the URL or browse all available labs.`}
        />
      </div>
    );
  }

  const overviewContent = (
    <LabSection id="overview" heading="About this lab">
      {lab.highlights.length > 0 ? (
        <ul className="space-y-3" aria-label="Lab highlights">
          {lab.highlights.map((highlight) => (
            <li
              key={highlight}
              className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"
            >
              <span
                className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70"
                aria-hidden="true"
              />
              {highlight}
            </li>
          ))}
        </ul>
      ) : (
        <SectionEmptyState message="Highlights for this lab haven't been added yet." />
      )}
      <p className="mt-8 text-base leading-relaxed text-muted-foreground">
        {lab.description}
      </p>
    </LabSection>
  );

  const divisionsContent =
    lab.divisions.length > 0 ? (
      <LabSection id="divisions" heading="Divisions">
        <DivisionToggle divisions={lab.divisions} />
      </LabSection>
    ) : (
      <SectionEmptyState message="This lab has no sub-divisions." />
    );

  const hoursContent = (
    <LabSection
      id="hours"
      heading="Opening hours"
      description="Times are local to Plaksha University campus."
    >
      {lab.hours.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-border/50">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30">
                <th
                  scope="col"
                  className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Day
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Opens
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Closes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {lab.hours.map((row) => {
                const isClosed = row.open === "Closed";
                return (
                  <tr
                    key={row.day}
                    className="transition-colors hover:bg-muted/20"
                  >
                    <td className="px-5 py-3.5 font-medium text-foreground">
                      {row.day}
                    </td>
                    <td
                      className={
                        isClosed
                          ? "px-5 py-3.5 text-muted-foreground/50"
                          : "px-5 py-3.5 tabular-nums text-muted-foreground"
                      }
                    >
                      {isClosed ? "—" : row.open}
                    </td>
                    <td
                      className={
                        isClosed
                          ? "px-5 py-3.5 text-muted-foreground/50"
                          : "px-5 py-3.5 tabular-nums text-muted-foreground"
                      }
                    >
                      {isClosed ? "Closed" : row.close}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <SectionEmptyState message="Hours information for this lab hasn't been added yet." />
      )}
    </LabSection>
  );

  const contactContent = (
    <LabSection id="contact" heading="Contact & location">
      <dl className="space-y-5">
        <div className="flex items-start gap-3">
          <dt className="sr-only">Email</dt>
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/50">
            <Mail className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </span>
          <dd className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground/60 uppercase tracking-widest">
              Email
            </span>
            <a
              href={`mailto:${lab.contactEmail}`}
              className="text-sm text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
            >
              {lab.contactEmail}
            </a>
          </dd>
        </div>
        <div className="flex items-start gap-3">
          <dt className="sr-only">Location</dt>
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/50">
            <MapPin className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </span>
          <dd className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground/60 uppercase tracking-widest">
              Location
            </span>
            <span className="text-sm text-muted-foreground">{lab.location}</span>
          </dd>
        </div>
      </dl>
    </LabSection>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <LabHeader lab={lab} />
      <LabTabs
        lab={lab}
        overviewContent={overviewContent}
        divisionsContent={divisionsContent}
        hoursContent={hoursContent}
        contactContent={contactContent}
      />
    </div>
  );
}
