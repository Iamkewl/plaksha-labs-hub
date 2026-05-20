import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

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
      <div className="mb-6">
        <h2
          id={headingId}
          className="text-2xl font-semibold leading-tight tracking-tight text-foreground"
        >
          {heading}
        </h2>
        {description && (
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}
