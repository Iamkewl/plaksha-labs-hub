import { requireRole } from "@/lib/auth-guard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QueueRow } from "@/components/admin/QueueRow";
import { getMaterialRequests } from "@/app/actions/boms";
import { getProcurementRequests } from "@/app/actions/procurement";
import { Package, ShoppingCart } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function RequestsPage() {
  await requireRole("ADMIN");

  // Material requests: wired to real DB
  type MatRow = {
    id: string;
    title: string;
    requestedBy?: string;
    quantity: number;
    unit: string;
    requestedAt: Date;
    status: string;
  };

  let materialRequests: MatRow[] = [];

  try {
    const fromDb = await getMaterialRequests({ queue: "admin" });
    materialRequests = fromDb.map((r) => ({
      id: r.id,
      title: r.material.name,
      requestedBy: r.requester?.name ?? undefined,
      quantity: Number(r.quantity),
      unit: r.material.unit,
      requestedAt: r.requestedAt,
      status: r.status.toLowerCase().replace(/_/g, "-"),
    }));
  } catch {
    // DB unavailable — show empty state
  }

  // Procurement requests: wired to DB
  type ProcRow = {
    id: string;
    itemName: string;
    vendor?: string;
    quantity: number;
    estimatedCost?: number;
    requestedAt: Date;
    status: string;
  };

  let procurementRequests: ProcRow[] = [];

  try {
    const fromDb = await getProcurementRequests();
    procurementRequests = fromDb.map((r) => ({
      id: r.id,
      itemName: r.itemName,
      vendor: r.vendor ?? undefined,
      quantity: r.quantity,
      estimatedCost: undefined,
      requestedAt: r.createdAt,
      status: r.status.toLowerCase(),
    }));
  } catch {
    // DB unavailable — show empty state
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Requests Management</h1>
        <p className="text-muted-foreground">
          Review and approve material and procurement requests.
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="material" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-sm">
          <TabsTrigger value="material">Material Requests</TabsTrigger>
          <TabsTrigger value="procurement">Procurement</TabsTrigger>
        </TabsList>

        {/* Material Requests Tab */}
        <TabsContent value="material" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Material Requests ({materialRequests.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {materialRequests.length === 0 ? (
                <div className="py-8 text-center">
                  <Package className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No material requests pending.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Material</TableHead>
                        <TableHead>Requested By</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {materialRequests.map((req) => (
                        <QueueRow
                          key={req.id}
                          id={req.id}
                          title={req.title}
                          requestedBy={req.requestedBy}
                          quantity={req.quantity}
                          unit={req.unit}
                          requestedAt={req.requestedAt}
                          status={req.status}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Procurement Requests Tab */}
        <TabsContent value="procurement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Procurement Requests ({procurementRequests.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {procurementRequests.length === 0 ? (
                <div className="py-8 text-center">
                  <ShoppingCart className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No procurement requests pending.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Est. Cost</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {procurementRequests.map((req) => (
                        <QueueRow
                          key={req.id}
                          id={req.id}
                          title={req.itemName}
                          vendor={req.vendor}
                          quantity={req.quantity}
                          unit="unit"
                          cost={req.estimatedCost}
                          requestedAt={req.requestedAt}
                          status={req.status}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
