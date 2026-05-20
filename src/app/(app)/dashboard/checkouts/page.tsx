import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CheckoutRow } from "@/components/dashboard/CheckoutRow";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { PLACEHOLDER_CHECKOUTS } from "@/lib/placeholder/dashboard";
import { Package } from "lucide-react";

export default function DashboardCheckoutsPage() {
  const checkedOut = PLACEHOLDER_CHECKOUTS.filter((c) => c.returnedAt === null);
  const returned = PLACEHOLDER_CHECKOUTS.filter((c) => c.returnedAt !== null);

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
