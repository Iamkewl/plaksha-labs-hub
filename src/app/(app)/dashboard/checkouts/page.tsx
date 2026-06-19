import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CheckoutRow } from "@/components/dashboard/CheckoutRow";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { type PlaceholderCheckout } from "@/lib/placeholder/dashboard";
import { Package } from "lucide-react";
import { getMyCheckouts } from "@/app/actions/checkouts";

export const dynamic = "force-dynamic";

/**
 * Map a Prisma Checkout row to the PlaceholderCheckout shape expected by CheckoutRow.
 */
function dbCheckoutToPlaceholder(
  c: Awaited<ReturnType<typeof getMyCheckouts>>[number]
): PlaceholderCheckout {
  const itemName =
    c.asset?.name ?? c.inventoryItem?.name ?? "Unknown item";
  const division =
    c.asset?.division?.name ??
    c.inventoryItem?.division?.name ??
    c.asset?.lab?.name ??
    c.inventoryItem?.lab?.name ??
    "Lab";

  return {
    id: c.id,
    assetId: c.assetId ?? c.inventoryItemId ?? c.id,
    assetName: itemName,
    labDivision: division,
    checkedOutAt: c.checkedOutAt,
    dueDate: c.dueAt ?? new Date(c.checkedOutAt.getTime() + 7 * 24 * 60 * 60 * 1000),
    returnedAt: c.returnedAt,
  };
}

export default async function DashboardCheckoutsPage() {
  let checkouts: PlaceholderCheckout[];

  try {
    const fromDb = await getMyCheckouts();
    checkouts = fromDb.map(dbCheckoutToPlaceholder);
  } catch {
    checkouts = [];
  }

  const checkedOut = checkouts.filter((c) => c.returnedAt === null);
  const returned = checkouts.filter((c) => c.returnedAt !== null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Equipment Checkouts</h1>
        <p className="mt-1 text-muted-foreground">
          Track all your checked-out lab equipment and assets
        </p>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="active">
            Currently Checked Out ({checkedOut.length})
          </TabsTrigger>
          <TabsTrigger value="history">History ({returned.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4 mt-6">
          {checkedOut.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <EmptyState
                  icon={Package}
                  title="No active checkouts"
                  description="You don't have any equipment checked out"
                />
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {checkedOut.map((checkout) => (
                <CheckoutRow key={checkout.id} checkout={checkout} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4 mt-6">
          {returned.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <EmptyState
                  icon={Package}
                  title="No history"
                  description="Your returned equipment will appear here"
                />
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {returned.map((checkout) => (
                <CheckoutRow key={checkout.id} checkout={checkout} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
