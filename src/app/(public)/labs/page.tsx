import { PLACEHOLDER_LABS } from "@/lib/placeholder/labs";
import { LabCard } from "@/components/labs/LabCard";

export const metadata = {
  title: "Explore Labs — Plaksha Labs Hub",
  description: "Discover the Makerspace and Robotics Lab at Plaksha University.",
};

const FILTER_CHIPS = [
  { label: "All", value: "all" },
  { label: "Open now", value: "open" },
  { label: "Has divisions", value: "divisions" },
];

export default function LabsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <header>
        <p className="section-kicker">Facilities</p>
        <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
          Explore Labs
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Plaksha hosts two primary labs — a full-spectrum Makerspace for fabrication and
          prototyping, and a Robotics Lab with dedicated Mechanical and Electronics
          divisions. Sign in to book time, check out tools, and manage your projects.
        </p>
      </header>

      <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter labs">
        {FILTER_CHIPS.map((chip) => (
          <span
            key={chip.value}
            className="rounded-lg border border-border/60 px-3 py-1.5 text-sm text-muted-foreground cursor-default select-none"
            aria-disabled="true"
            title="Filters are coming soon"
          >
            {chip.label}
          </span>
        ))}
      </div>

      <section aria-labelledby="labs-list-heading" className="mt-8">
        <h2 id="labs-list-heading" className="sr-only">
          Available labs
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PLACEHOLDER_LABS.map((lab) => (
            <LabCard key={lab.slug} lab={lab} />
          ))}
        </div>
      </section>
    </div>
  );
}
