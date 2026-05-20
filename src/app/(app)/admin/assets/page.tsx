import { requireRole } from "@/lib/auth-guard";
import { getAssets } from "@/app/actions/assets";
import { PLACEHOLDER_ASSETS_ADMIN } from "@/lib/placeholder/admin";
import { AssetsClient } from "@/components/admin/AssetsClient";

export const dynamic = "force-dynamic";

export default async function AssetsPage() {
  await requireRole("ADMIN");

  let assets: Array<{
    id: string;
    name: string;
    lab: string;
    division: string;
    kind: string;
    status: string;
    lastActivity: Date;
  }> = PLACEHOLDER_ASSETS_ADMIN;

  try {
    const { assets: fromDb } = await getAssets({ page: 1 });
    if (fromDb.length) {
      assets = fromDb.map((a) => ({
        id: a.id,
        name: a.name,
        lab: a.lab.name,
        division: a.division?.name ?? "—",
        kind: a.kind.charAt(0) + a.kind.slice(1).toLowerCase(),
        status: a.status.toLowerCase().replace("_", "-"),
        lastActivity: a.updatedAt,
      }));
    }
  } catch {
    // DB unavailable — keep placeholder
  }

  return <AssetsClient assets={assets} />;
}
