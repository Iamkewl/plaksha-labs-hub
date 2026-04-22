import { requireRole } from "@/lib/auth-guard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowLeft, Clock, FileText, Mail } from "lucide-react";
import Link from "next/link";
import { ReactiveReveal } from "@/components/once-ui/reactive-elements";

export default async function PurchaseOrdersPage() {
  await requireRole("ADMIN");

  return (
    <div className="space-y-6">
      <ReactiveReveal className="space-y-1" translateY={0.35}>
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="-ml-2 mb-1">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Purchase Orders</h1>
        <p className="text-muted-foreground">
          Manage material procurement and restock orders.
        </p>
      </ReactiveReveal>

      <ReactiveReveal delay={0.06} translateY={0.45}>
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <ShoppingCart className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardTitle className="text-xl mb-2">Coming Soon</CardTitle>
            <CardDescription className="max-w-md">
              Purchase order generation and tracking will be available in a future release.
              This feature will automatically generate purchase orders for low-stock materials
              and integrate with email notifications.
            </CardDescription>

            <div className="mt-8 grid gap-4 sm:grid-cols-3 max-w-lg">
              <ReactiveReveal delay={0.12} className="flex flex-col items-center gap-2 rounded-lg border border-dashed p-4" translateY={0.35}>
                <FileText className="h-5 w-5 text-muted-foreground" />
                <p className="text-xs text-muted-foreground text-center">
                  Auto-generate POs from low-stock alerts
                </p>
              </ReactiveReveal>
              <ReactiveReveal delay={0.16} className="flex flex-col items-center gap-2 rounded-lg border border-dashed p-4" translateY={0.35}>
                <Mail className="h-5 w-5 text-muted-foreground" />
                <p className="text-xs text-muted-foreground text-center">
                  Email POs to suppliers
                </p>
              </ReactiveReveal>
              <ReactiveReveal delay={0.2} className="flex flex-col items-center gap-2 rounded-lg border border-dashed p-4" translateY={0.35}>
                <Clock className="h-5 w-5 text-muted-foreground" />
                <p className="text-xs text-muted-foreground text-center">
                  Track order status and delivery
                </p>
              </ReactiveReveal>
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              Planned for Sprint 6
            </div>
          </CardContent>
        </Card>
      </ReactiveReveal>
    </div>
  );
}
