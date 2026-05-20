import Link from "next/link";
import { MapPin, Mail, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PlaceholderLab } from "@/lib/placeholder/labs";

interface LabHeaderProps {
  lab: PlaceholderLab;
}

export function LabHeader({ lab }: LabHeaderProps) {
  const todayLabel = (() => {
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;
    const today = dayNames[new Date().getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6];
    const todayHours = lab.hours.find((h) => h.day === today);
    if (!todayHours || todayHours.open === "Closed") return "Closed today";
    return `Open today · ${todayHours.open}–${todayHours.close}`;
  })();

  return (
    <div className="border-b border-border/60 pb-8">
      <p className="section-kicker">{lab.slug === "makerspace" ? "Fabrication & Making" : "Robotics & Automation"}</p>
      <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
        {lab.name}
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">{lab.tagline}</p>

      {lab.divisions.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2" aria-label="Lab divisions">
          {lab.divisions.map((div) => (
            <Badge key={div.slug} variant="secondary">
              {div.name}
            </Badge>
          ))}
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
          {lab.location}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
          {todayLabel}
        </span>
        <a
          href={`mailto:${lab.contactEmail}`}
          className="flex items-center gap-1.5 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
        >
          <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
          {lab.contactEmail}
        </a>
      </div>

      <div className="mt-6">
        <Link href="/auth/signin">
          <Button className="gap-2">Sign in to access this lab</Button>
        </Link>
      </div>
    </div>
  );
}
