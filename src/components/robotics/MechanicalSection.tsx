// Async server component — fetches mechanical assets from DB with placeholder fallback.
import type { ElementType } from "react";
import { Wrench, Users } from "lucide-react";
import { AssetCard } from "@/components/robotics/AssetCard";
import { CheckoutAssetButton } from "@/components/robotics/CheckoutAssetButton";
import { NameTagChip } from "@/components/robotics/NameTagChip";
import {
  PLACEHOLDER_ASSETS,
  PLACEHOLDER_ACTIVE_USERS,
  type RoboticsAsset,
} from "@/lib/placeholder/robotics";
import { getAssets } from "@/app/actions/assets";

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

/**
 * Map a Prisma Asset to RoboticsAsset shape expected by AssetCard.
 */
function dbAssetToRobotics(
  a: Awaited<ReturnType<typeof getAssets>>["assets"][number]
): RoboticsAsset {
  const status =
    a.status === "AVAILABLE"
      ? "AVAILABLE"
      : a.status === "CHECKED_OUT" || a.status === "IN_USE"
        ? "CHECKED_OUT"
        : "MAINTENANCE";

  return {
    id: a.id,
    name: a.name,
    division: "mechanical",
    category: a.kind.charAt(0) + a.kind.slice(1).toLowerCase(),
    status,
    serial: a.serialNo ?? undefined,
  };
}

export async function MechanicalSection() {
  let mechanicalAssets: RoboticsAsset[];

  try {
    const { assets: fromDb } = await getAssets({
      labSlug: "robotics",
      divisionSlug: "mechanical",
    });
    mechanicalAssets = fromDb.length
      ? fromDb.map(dbAssetToRobotics)
      : PLACEHOLDER_ASSETS.filter((a) => a.division === "mechanical");
  } catch {
    mechanicalAssets = PLACEHOLDER_ASSETS.filter((a) => a.division === "mechanical");
  }

  // Active users still from placeholder — requires Checkout → User join (Agent G scope)
  const mechanicalUsers = PLACEHOLDER_ACTIVE_USERS.filter(
    (u) => u.division === "mechanical"
  );

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
              <AssetCard
                key={asset.id}
                asset={asset}
                action={
                  asset.status === "AVAILABLE" ? (
                    <CheckoutAssetButton
                      assetId={asset.id}
                      assetName={asset.name}
                    />
                  ) : undefined
                }
              />
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
