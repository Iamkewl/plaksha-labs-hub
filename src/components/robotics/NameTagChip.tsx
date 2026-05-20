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

// Division accent classes — aligned with global lab tokens where possible
const divisionColor: Record<
  RoboticsActiveUser["division"],
  { avatar: string; badge: string }
> = {
  mechanical: {
    avatar: "bg-amber-500/18 text-amber-300 border-amber-500/30",
    badge: "border-amber-500/25 bg-amber-500/10 text-amber-300",
  },
  electronics: {
    avatar: "bg-violet-500/18 text-violet-300 border-violet-500/30",
    badge: "border-violet-500/25 bg-violet-500/10 text-violet-300",
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
        "flex flex-col items-center gap-2.5 rounded-xl border border-white/10 bg-card/70 p-5 text-center transition-all duration-200 hover:border-white/18 hover:bg-card/85",
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
      <p className="text-sm font-semibold text-foreground leading-tight">
        {user.name}
      </p>

      {/* Division chip */}
      <span
        className={cn(
          "rounded-full border px-2.5 py-0.5 text-[0.64rem] font-semibold uppercase tracking-wider",
          colors.badge
        )}
      >
        {user.division}
      </span>

      {/* Current tool */}
      {user.currentToolName ? (
        <p className="text-[0.72rem] leading-snug text-muted-foreground">
          Using:{" "}
          <span className="text-foreground/80">{user.currentToolName}</span>
        </p>
      ) : (
        <p className="text-[0.72rem] text-muted-foreground/60">
          No tool checked out
        </p>
      )}
    </div>
  );
}
