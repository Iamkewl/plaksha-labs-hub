// Server component — no "use client" needed here.
import type { ElementType } from "react";
import { Wrench, Users } from "lucide-react";
import { AssetCard } from "@/components/robotics/AssetCard";
import { NameTagChip } from "@/components/robotics/NameTagChip";
import {
  PLACEHOLDER_ASSETS,
  PLACEHOLDER_ACTIVE_USERS,
} from "@/lib/placeholder/robotics";

const mechanicalAssets = PLACEHOLDER_ASSETS.filter(
  (a) => a.division === "mechanical"
);
const mechanicalUsers = PLACEHOLDER_ACTIVE_USERS.filter(
  (u) => u.division === "mechanical"
);

function SectionEmptyState({
  icon: Icon,
  message,
}: {
  icon: ElementType;
  message: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 py-10 text-center">
      <Icon className="h-8 w-8 text-muted-foreground/40" aria-hidden="true" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

export function MechanicalSection() {
  return (
    <section aria-labelledby="mechanical-heading" className="space-y-8">
      {/* ── Tool Checkout List ─────────────────────────── */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Wrench className="h-4 w-4 text-amber-400" aria-hidden="true" />
          <h2
            id="mechanical-heading"
            className="text-base font-semibold text-foreground"
          >
            Mechanical Assets
          </h2>
          <span className="ml-auto text-[0.72rem] text-muted-foreground">
            {mechanicalAssets.length} asset
            {mechanicalAssets.length !== 1 ? "s" : ""}
          </span>
        </div>

        {mechanicalAssets.length === 0 ? (
          <SectionEmptyState
            icon={Wrench}
            message="No mechanical assets registered."
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {mechanicalAssets.map((asset) => (
              <AssetCard key={asset.id} asset={asset} />
            ))}
          </div>
        )}
      </div>

      {/* ── Digital Name Tag Grid ──────────────────────── */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Users className="h-4 w-4 text-amber-400" aria-hidden="true" />
          <h2
            id="mechanical-users-heading"
            className="text-base font-semibold text-foreground"
          >
            Active Members
          </h2>
          <span className="ml-auto text-[0.72rem] text-muted-foreground">
            {mechanicalUsers.length} present
          </span>
        </div>

        {mechanicalUsers.length === 0 ? (
          <SectionEmptyState
            icon={Users}
            message="No members currently active in the mechanical division."
          />
        ) : (
          <div
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            aria-label="Active mechanical division members"
          >
            {mechanicalUsers.map((user) => (
              <NameTagChip key={user.userId} user={user} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
