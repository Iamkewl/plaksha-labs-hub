import { cn } from "@/lib/utils";
import type { RoboticsActiveUser } from "@/lib/placeholder/robotics";

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

// Deterministic pastel accent per division
const divisionColor: Record<RoboticsActiveUser["division"], string> = {
  mechanical: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  electronics: "bg-violet-500/20 text-violet-300 border-violet-500/30",
};

interface NameTagChipProps {
  user: RoboticsActiveUser;
  className?: string;
}

export function NameTagChip({ user, className }: NameTagChipProps) {
  const initials = getInitials(user.name);
  const accentClass = divisionColor[user.division];

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-card/60 p-4 text-center hover:bg-card/80 transition-colors",
        className
      )}
    >
      {/* Avatar */}
      <span
        aria-hidden="true"
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full border text-sm font-semibold",
          accentClass
        )}
      >
        {initials}
      </span>

      {/* Name */}
      <p className="text-sm font-medium text-foreground leading-tight">{user.name}</p>

      {/* Division chip */}
      <span
        className={cn(
          "rounded-md border px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide",
          accentClass
        )}
      >
        {user.division}
      </span>

      {/* Current tool */}
      {user.currentToolName ? (
        <p className="text-[0.72rem] text-muted-foreground leading-snug">
          Using:{" "}
          <span className="text-foreground/80">{user.currentToolName}</span>
        </p>
      ) : (
        <p className="text-[0.72rem] text-muted-foreground">No tool checked out</p>
      )}
    </div>
  );
}
