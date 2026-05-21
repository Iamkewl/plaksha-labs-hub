import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

interface LabSectionProps {
  id: string;
  heading: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function LabSection({
  id,
  heading,
  description,
  children,
  className,
}: LabSectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn("py-2", className)}
    >
      {/* Heading — scroll-reveal on entry */}
      <ScrollReveal threshold={0.1} delay={0}>
        <div className="mb-6">
          <h2
            id={headingId}
            className="text-2xl font-semibold leading-tight tracking-tight text-foreground"
          >
            {heading}
          </h2>
          {description && (
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </ScrollReveal>

      {children}
    </section>
  );
}
