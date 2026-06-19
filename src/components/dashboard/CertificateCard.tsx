import { Award, Calendar, User, Hash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface CertificateCardProps {
  id: string;
  trainedAt: Date;
  trainedBy: string | null;
  certificate: string | null;
  notes: string | null;
  machine: {
    id: string;
    name: string;
    category: string;
  };
}

export function CertificateCard({
  id,
  trainedAt,
  trainedBy,
  certificate,
  machine,
}: CertificateCardProps) {
  const certId = certificate
    ? certificate
    : `CERT-${id.slice(-6).toUpperCase()}`;
  const issuer = trainedBy && trainedBy.trim() ? trainedBy : "Plaksha Makerspace";

  return (
    <article
      className={cn(
        // Base card — matches the rest of the dashboard (rounded-2xl, backdrop glass)
        "relative flex flex-col overflow-hidden",
        "rounded-2xl border border-white/10 bg-card/85",
        "shadow-[0_22px_48px_-30px_rgba(0,0,0,0.75)] backdrop-blur-xl",
        // Hover lift to signal it is a "document" not just data
        "transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "hover:border-white/[0.18] hover:-translate-y-0.5 hover:shadow-md"
      )}
      aria-label={`Certification: ${machine.name}`}
    >
      {/* Top accent line — uses the primary brand colour, same pattern as StatCard highlight */}
      <div
        className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary/60 to-indigo-300/50"
        aria-hidden="true"
      />

      {/* Card body */}
      <div className="flex flex-col gap-4 p-5 pt-6">

        {/* Header row: seal icon + category badge */}
        <div className="flex items-start justify-between gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/12 ring-1 ring-primary/25"
            aria-hidden="true"
          >
            <Award className="h-5 w-5 text-primary" />
          </span>
          <Badge variant="secondary" className="mt-0.5 shrink-0">
            {machine.category}
          </Badge>
        </div>

        {/* Certified skill — the primary content */}
        <div>
          <p
            className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
          >
            Certified to operate
          </p>
          <h3 className="mt-0.5 text-lg font-semibold leading-tight text-foreground">
            {machine.name}
          </h3>
        </div>

        {/* Metadata rows */}
        <dl className="mt-auto flex flex-col gap-2 border-t border-white/[0.07] pt-4">
          {/* Date */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <dt className="sr-only">Date certified</dt>
            <dd>{formatDate(trainedAt)}</dd>
          </div>

          {/* Issuer */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <User className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <dt className="sr-only">Issued by</dt>
            <dd className="truncate">{issuer}</dd>
          </div>

          {/* Certificate ID */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Hash className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <dt className="sr-only">Certificate ID</dt>
            <dd className="font-mono tracking-wide">{certId}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
