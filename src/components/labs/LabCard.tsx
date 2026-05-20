import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PlaceholderLab } from "@/lib/placeholder/labs";

interface LabCardProps {
  lab: PlaceholderLab;
}

export function LabCard({ lab }: LabCardProps) {
  return (
    <Link
      href={`/labs/${lab.slug}`}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl"
      aria-label={`View ${lab.name}`}
    >
      <Card className="h-full transition-shadow duration-200 group-hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-xl leading-tight">{lab.name}</CardTitle>
            {lab.divisions.length > 0 && (
              <Badge variant="secondary" className="shrink-0">
                {lab.divisions.length} divisions
              </Badge>
            )}
          </div>
          <p className="text-sm text-primary/80 font-medium">{lab.tagline}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
            {lab.description}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{lab.location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm font-medium text-primary group-hover:gap-2 transition-all duration-150">
            View lab <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
