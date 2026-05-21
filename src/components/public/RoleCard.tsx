import { ArrowRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RoleCardProps {
  icon: LucideIcon;
  role: string;
  blurb: string;
  className?: string;
}

/**
 * RoleCard — frosted glass card inside the hero teal band.
 *
 * Sizing: min-h-[210px], icon h-12 w-12 in a rounded-xl frosted container.
 * Hover: card lifts -6px, border brightens, icon bg flashes to white/40,
 *        inner top-edge accent line grows from scale-x-0 → 1.
 * Arrow: translates right on group-hover and brightens.
 * Role name: text-lg font-semibold (was text-base).
 */
export function RoleCard({ icon: Icon, role, blurb, className }: RoleCardProps) {
  return (
    <div
      className={cn(
        "group relative flex min-h-[210px] min-w-0 flex-col gap-3 overflow-hidden rounded-xl",
        "border border-white/20 bg-white/10 px-5 py-5 backdrop-blur-sm",
        "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "hover:-translate-y-1.5 hover:border-white/40 hover:bg-white/18",
        "hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.25)]",
        className
      )}
      style={{ willChange: "transform" }}
    >
      {/* Top-edge accent line — grows in on hover */}
      <span
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-x-0 top-0 h-px
          origin-left scale-x-0 rounded-full
          bg-gradient-to-r from-white/60 via-white/90 to-white/60
          transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          group-hover:scale-x-100
        "
      />

      {/* Icon container */}
      <span
        className="
          flex h-12 w-12 shrink-0 items-center justify-center rounded-xl
          bg-white/20
          ring-1 ring-white/10
          transition-all duration-300
          group-hover:bg-white/40 group-hover:ring-white/30
          group-hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.18)]
        "
      >
        <Icon className="h-6 w-6 text-white" aria-hidden="true" />
      </span>

      {/* Role name — upgraded to lg */}
      <p className="text-lg font-semibold leading-snug text-white">{role}</p>

      {/* Blurb — grows to fill */}
      <p className="flex-1 text-sm leading-relaxed text-white/72">{blurb}</p>

      {/* Arrow affordance */}
      <div className="flex justify-end">
        <ArrowRight
          className="
            h-4 w-4 text-white/40
            transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
            group-hover:translate-x-1.5 group-hover:text-white/90
          "
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
