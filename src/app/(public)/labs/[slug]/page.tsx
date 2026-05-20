import { Mail, MapPin } from "lucide-react";
import { PLACEHOLDER_LABS } from "@/lib/placeholder/labs";
import { LabHeader } from "@/components/labs/LabHeader";
import { LabTabs } from "@/components/labs/LabTabs";
import { LabSection } from "@/components/labs/LabSection";
import { DivisionToggle } from "@/components/labs/DivisionToggle";
import { SectionEmptyState } from "@/components/labs/SectionEmptyState";

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return PLACEHOLDER_LABS.map((lab) => ({ slug: lab.slug }));
}

export function generateMetadata({ params }: PageProps) {
  const lab = PLACEHOLDER_LABS.find((l) => l.slug === params.slug);
  if (!lab) return { title: "Lab not found — Plaksha Labs Hub" };
  return {
    title: `${lab.name} — Plaksha Labs Hub`,
    description: lab.tagline,
  };
}

export default function LabDetailPage({ params }: PageProps) {
  const lab = PLACEHOLDER_LABS.find((l) => l.slug === params.slug);

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
            <li key={highlight} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
              <span
                className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
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
    <LabSection id="hours" heading="Opening hours">
      {lab.hours.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-muted/40">
                <th
                  scope="col"
                  className="px-4 py-3 text-left font-medium text-foreground"
                >
                  Day
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left font-medium text-foreground"
                >
                  Opens
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left font-medium text-foreground"
                >
                  Closes
                </th>
              </tr>
            </thead>
            <tbody>
              {lab.hours.map((row, i) => {
                const isClosed = row.open === "Closed";
                return (
                  <tr
                    key={row.day}
                    className={i % 2 === 0 ? "bg-card/40" : "bg-transparent"}
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {row.day}
                    </td>
                    <td
                      className={
                        isClosed
                          ? "px-4 py-3 text-muted-foreground/60"
                          : "px-4 py-3 text-muted-foreground"
                      }
                    >
                      {isClosed ? "—" : row.open}
                    </td>
                    <td
                      className={
                        isClosed
                          ? "px-4 py-3 text-muted-foreground/60"
                          : "px-4 py-3 text-muted-foreground"
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
      <dl className="space-y-4">
        <div className="flex items-start gap-3">
          <dt className="sr-only">Email</dt>
          <Mail className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <dd>
            <a
              href={`mailto:${lab.contactEmail}`}
              className="text-sm text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
            >
              {lab.contactEmail}
            </a>
          </dd>
        </div>
        <div className="flex items-start gap-3">
          <dt className="sr-only">Location</dt>
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <dd className="text-sm text-muted-foreground">{lab.location}</dd>
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
