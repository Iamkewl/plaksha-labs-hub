import { getMaterialById } from "@/app/actions/materials";
import { requireAuth } from "@/lib/auth-guard";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft, Edit, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { ReactiveMetric, ReactiveReveal } from "@/components/once-ui/reactive-elements";

export default async function MaterialDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await requireAuth();
  const material = await getMaterialById(params.id);

  if (!material) notFound();

  const isAdmin = session.user.role === "ADMIN";
  const isLow = material.currentStock <= material.lowStockThreshold;

  return (
    <div>
      <ReactiveReveal translateY={0.3}>
        <Link
          href="/catalog/materials"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Materials
        </Link>
      </ReactiveReveal>

      <ReactiveReveal delay={0.04} className="mt-4 flex items-start justify-between gap-3" translateY={0.4}>
        <div>
          <h1 className="text-3xl font-bold">{material.name}</h1>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="outline">{material.category}</Badge>
            {isLow && (
              <Badge variant="destructive">
                <AlertTriangle className="mr-1 h-3 w-3" />
                Low Stock
              </Badge>
            )}
          </div>
        </div>
        {isAdmin && (
          <Link href={`/admin/materials/${material.id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
        )}
      </ReactiveReveal>

      <ReactiveReveal delay={0.08} className="mt-8 grid gap-6 lg:grid-cols-2" translateY={0.5}>
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {material.description && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Description
                </h4>
                <p className="mt-1">{material.description}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Unit
                </h4>
                <p className="mt-1">{material.unit}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Cost per Unit
                </h4>
                <p className="mt-1">
                  {formatCurrency(material.costPerUnit)}/{material.unit}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stock Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Current Stock
                </h4>
                <p
                  className={`mt-1 text-2xl font-bold ${
                    isLow ? "text-orange-600" : "text-green-600"
                  }`}
                >
                  <ReactiveMetric value={material.currentStock} />{" "}
                  <span className="text-base font-normal text-muted-foreground">
                    {material.unit}
                  </span>
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Low Stock Threshold
                </h4>
                <p className="mt-1 text-2xl font-bold">
                  <ReactiveMetric value={material.lowStockThreshold} />{" "}
                  <span className="text-base font-normal text-muted-foreground">
                    {material.unit}
                  </span>
                </p>
              </div>
            </div>
            {isLow && (
              <div className="rounded-md bg-orange-50 p-3">
                <p className="text-sm text-orange-800">
                  <strong>Stock is below threshold.</strong> Consider reordering
                  this material.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </ReactiveReveal>
    </div>
  );
}
