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

// Division accent palette — warm/cool contrast matches DivisionToggle
const divisionColor: Record<
  RoboticsActiveUser["division"],
  { avatar: string; badge: string }
> = {
  mechanical: {
    avatar: "bg-amber-500/15 text-amber-300 border-amber-500/28",
    badge: "border-amber-500/22 bg-amber-500/[0.09] text-amber-300",
  },
  electronics: {
    avatar: "bg-violet-500/15 text-violet-300 border-violet-500/28",
    badge: "border-violet-500/22 bg-violet-500/[0.09] text-violet-300",
  },
};

interface NameTagChipProps {
  user: RoboticsActiveUser;
  className?: string;
}

export function NameTagChip({ user, className }: NameTagChipProps) {
  const initials = getInitials(user.name);
  const colors = divisionColor[user.division];

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2.5 rounded-xl border border-white/[0.09] bg-card/70 p-5 text-center",
        "transition-all duration-200 ease-snap hover:border-white/[0.17] hover:bg-card/85",
        className
      )}
    >
      {/* Avatar */}
      <span
        aria-hidden="true"
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full border text-sm font-semibold",
          colors.avatar
        )}
      >
        {initials}
      </span>

      {/* Name */}
      <p className="text-sm font-semibold leading-tight text-foreground">
        {user.name}
      </p>

      {/* Division badge */}
      <span
        className={cn(
          "rounded-full border px-2.5 py-0.5 text-[0.63rem] font-semibold uppercase",
          colors.badge
        )}
        style={{ letterSpacing: "0.08em" }}
      >
        {user.division}
      </span>

      {/* Current tool */}
      {user.currentToolName ? (
        <p className="text-[0.72rem] leading-snug text-muted-foreground">
          Using:{" "}
          <span className="text-foreground/75">{user.currentToolName}</span>
        </p>
      ) : (
        <p className="text-[0.72rem] text-muted-foreground/50">
          No tool checked out
        </p>
      )}
    </div>
  );
}
