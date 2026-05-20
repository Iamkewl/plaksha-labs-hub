import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LabSectionProps {
  id: string;
  heading: string;
  children: ReactNode;
  className?: string;
}

export function LabSection({ id, heading, children, className }: LabSectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn("py-8", className)}
    >
      <h2
        id={headingId}
        className="text-2xl font-semibold leading-tight tracking-tight text-foreground"
      >
        {heading}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}
