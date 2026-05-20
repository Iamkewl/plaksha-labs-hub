// Async server component — fetches electronics assets/inventory from DB with placeholder fallback.
import { Cpu } from "lucide-react";
import { ElectronicsInventoryClient } from "@/components/robotics/ElectronicsInventoryClient";
import {
  PLACEHOLDER_ASSETS,
  PLACEHOLDER_INVENTORY,
  PLACEHOLDER_PROCUREMENT,
  type RoboticsAsset,
  type RoboticsInventoryItem,
  type RoboticsProcurement,
} from "@/lib/placeholder/robotics";
import { getAssets } from "@/app/actions/assets";
import { getInventory } from "@/app/actions/inventory";

/**
 * Map a Prisma Asset to RoboticsAsset shape.
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
    division: "electronics",
    category: a.kind.charAt(0) + a.kind.slice(1).toLowerCase(),
    status,
    serial: a.serialNo ?? undefined,
  };
}

/**
 * Map a Prisma InventoryItem to RoboticsInventoryItem shape.
 */
function dbInventoryToRobotics(
  i: Awaited<ReturnType<typeof getInventory>>[number]
): RoboticsInventoryItem {
  return {
    id: i.id,
    name: i.name,
    category: i.sku ?? "General",
    qtyOnHand: i.qtyOnHand,
    reorderLevel: i.reorderLevel,
    location: i.location ?? undefined,
  };
}

export async function ElectronicsSection() {
  let electronicsAssets: RoboticsAsset[];
  let inventory: RoboticsInventoryItem[];
  // Procurement tickets still from placeholder — Agent G scope
  const procurement: RoboticsProcurement[] = PLACEHOLDER_PROCUREMENT;

  try {
    const { assets: assetsFromDb } = await getAssets({
      labSlug: "robotics",
      divisionSlug: "electronics",
    });
    electronicsAssets = assetsFromDb.length
      ? assetsFromDb.map(dbAssetToRobotics)
      : PLACEHOLDER_ASSETS.filter((a) => a.division === "electronics");
  } catch {
    electronicsAssets = PLACEHOLDER_ASSETS.filter((a) => a.division === "electronics");
  }

  try {
    const inventoryFromDb = await getInventory({ labSlug: "robotics", divisionSlug: "electronics" });
    inventory = inventoryFromDb.length
      ? inventoryFromDb.map(dbInventoryToRobotics)
      : PLACEHOLDER_INVENTORY;
  } catch {
    inventory = PLACEHOLDER_INVENTORY;
  }

  return (
    <section aria-labelledby="electronics-heading" className="space-y-6">
      <div className="flex items-center gap-2">
        <Cpu className="h-4 w-4 text-violet-400" aria-hidden="true" />
        <h2
          id="electronics-heading"
          className="text-base font-semibold text-foreground"
        >
          Electronics Inventory
        </h2>
      </div>

      <ElectronicsInventoryClient
        assets={electronicsAssets}
        inventory={inventory}
        procurement={procurement}
      />
    </section>
  );
}
