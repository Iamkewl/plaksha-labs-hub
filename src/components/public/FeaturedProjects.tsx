import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  title: string;
  author: string;
  timeAgo: string;
  tag: string;
  tagColor: string;
  /** Primary gradient (shown at rest) */
  gradientStyle: string;
  /** Shifted gradient shown on hover — creates a living quality */
  gradientHover: string;
  delay?: number;
}

function ProjectCard({
  title,
  author,
  timeAgo,
  tag,
  tagColor,
  gradientStyle,
  gradientHover,
  delay = 0,
}: ProjectCardProps) {
  return (
    <ScrollReveal delay={delay}>
      <article
        className="
          group relative overflow-hidden rounded-lg border border-border bg-card
          transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]
          hover:-translate-y-1.5
          hover:border-border/70
          hover:shadow-[0_12px_40px_-10px_rgba(0,0,0,0.14)]
        "
        style={{ willChange: "transform" }}
      >
        {/* Visual panel */}
        <div
          className="relative h-52 w-full overflow-hidden"
          role="img"
          aria-label={`${title} cover`}
        >
          {/* Rest state gradient */}
          <div
            aria-hidden="true"
            className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-0"
            style={{ background: gradientStyle }}
          />
          {/* Hover state gradient — fades in, subtly shifted hue/direction */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: gradientHover }}
          />

          {/* Dot pattern overlay */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.13) 1px, transparent 1px)",
              backgroundSize: "18px 18px",
            }}
          />

          {/* Subtle diagonal shimmer — always present, soft */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, transparent 35%, rgba(255,255,255,0.18) 50%, transparent 65%)",
            }}
          />

          {/* Bottom gradient — blends panel into card body */}
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-0 right-0 h-16"
            style={{
              background:
                "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.25) 100%)",
            }}
          />

          {/* Tag badge */}
          <span
            className={cn(
              "absolute left-3 top-3 rounded-full px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-wide",
              tagColor
            )}
          >
            {tag}
          </span>

          {/* Title teaser inside the panel — adds richness at a glance */}
          <p className="absolute bottom-3 left-3 right-3 text-xs font-medium text-white/80 line-clamp-1">
            {title}
          </p>
        </div>

        {/* Card body */}
        <div className="px-4 pb-4 pt-3">
          <p className="text-sm font-semibold leading-snug text-foreground transition-colors duration-200 group-hover:text-primary">
            {title}
          </p>
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              Built by {author}&nbsp;&middot;&nbsp;{timeAgo}
            </p>
            <ArrowRight
              className="
                h-3.5 w-3.5 shrink-0 text-muted-foreground/50
                transition-all duration-300
                group-hover:translate-x-0.5 group-hover:text-primary
              "
              aria-hidden="true"
            />
          </div>
        </div>
      </article>
    </ScrollReveal>
  );
}

const PROJECTS: ProjectCardProps[] = [
  {
    title: "Autonomous Path Planner",
    author: "Aanya S.",
    timeAgo: "2 weeks ago",
    tag: "Robotics",
    tagColor:
      "bg-[hsl(225_80%_55%/0.20)] text-[hsl(225_80%_42%)] border border-[hsl(225_80%_55%/0.35)] backdrop-blur-sm",
    gradientStyle:
      "linear-gradient(145deg, hsl(225 70% 58%) 0%, hsl(225 80% 38%) 55%, hsl(182 80% 26%) 100%)",
    gradientHover:
      "linear-gradient(165deg, hsl(225 75% 52%) 0%, hsl(230 80% 35%) 50%, hsl(182 82% 22%) 100%)",
    delay: 0,
  },
  {
    title: "CNC Workflow Tooling",
    author: "Rohan M.",
    timeAgo: "3 weeks ago",
    tag: "Hardware",
    tagColor:
      "bg-[hsl(27_90%_45%/0.20)] text-[hsl(27_90%_35%)] border border-[hsl(27_90%_45%/0.35)] backdrop-blur-sm",
    gradientStyle:
      "linear-gradient(145deg, hsl(38 90% 60%) 0%, hsl(27 90% 44%) 55%, hsl(27 80% 28%) 100%)",
    gradientHover:
      "linear-gradient(165deg, hsl(42 92% 55%) 0%, hsl(28 92% 40%) 50%, hsl(27 82% 24%) 100%)",
    delay: 80,
  },
  {
    title: "Mycelium Composite Module",
    author: "Priya K.",
    timeAgo: "1 month ago",
    tag: "Bio-Materials",
    tagColor:
      "bg-[hsl(182_80%_32%/0.15)] text-[hsl(182_80%_26%)] border border-[hsl(182_80%_32%/0.32)] backdrop-blur-sm",
    gradientStyle:
      "linear-gradient(145deg, hsl(182 55% 55%) 0%, hsl(182 80% 30%) 55%, hsl(182 82% 18%) 100%)",
    gradientHover:
      "linear-gradient(165deg, hsl(182 60% 50%) 0%, hsl(184 82% 26%) 50%, hsl(182 84% 15%) 100%)",
    delay: 160,
  },
];

/**
 * FeaturedProjects — project cards with dual-gradient hover shift,
 * author metadata, tag badges, and title teaser in the visual panel.
 * "View all builds →" is placed top-right in the section header.
 */
export function FeaturedProjects() {
  return (
    <section
      aria-labelledby="featured-builds-heading"
      className="bg-background px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="section-kicker mb-2 text-primary">Featured Builds</p>
              <h2
                id="featured-builds-heading"
                className="text-3xl font-bold tracking-tight text-foreground"
              >
                Public Projects
              </h2>
            </div>
            <Link
              href="/projects"
              className="
                group inline-flex shrink-0 items-center gap-1.5
                rounded-sm text-sm font-medium text-primary
                transition-colors duration-150 hover:text-primary/75
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-ring focus-visible:ring-offset-2
              "
            >
              View all builds
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p) => (
            <ProjectCard key={p.title} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
}
