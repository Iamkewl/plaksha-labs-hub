import { getMaterials, getLowStockMaterials, getMaterialCategories } from "@/app/actions/materials";
import { requireAuth } from "@/lib/auth-guard";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Plus, Package, AlertTriangle } from "lucide-react";
import { MaterialFilters } from "./material-filters";
import { ReactiveMetric, ReactiveReveal } from "@/components/once-ui/reactive-elements";

export default async function MaterialsPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string; filter?: string };
}) {
  const session = await requireAuth();
  const isLowStockFilter = searchParams.filter === "low-stock";
  const [materials, categories] = await Promise.all([
    isLowStockFilter
      ? getLowStockMaterials()
      : getMaterials({
          category: searchParams.category,
          search: searchParams.search,
        }),
    getMaterialCategories(),
  ]);

  const isAdmin = session.user.role === "ADMIN";

  return (
    <div>
      <ReactiveReveal className="flex items-center justify-between gap-3" translateY={0.35}>
        <div>
          <h1 className="text-3xl font-bold">Materials</h1>
          <p className="text-muted-foreground">
            Browse consumables and raw materials
          </p>
          <div className="mt-1 text-xs text-muted-foreground">
            Showing <ReactiveMetric value={materials.length} className="font-semibold text-foreground" /> item{materials.length === 1 ? "" : "s"}
          </div>
        </div>
        {isAdmin && (
          <Link href="/admin/materials/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Material
            </Button>
          </Link>
        )}
      </ReactiveReveal>

      <ReactiveReveal delay={0.04} translateY={0.4}>
        <MaterialFilters categories={categories} />
      </ReactiveReveal>

      {materials.length === 0 ? (
        <ReactiveReveal delay={0.08} translateY={0.45}>
          <div className="mt-12 text-center">
            <Package className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No materials found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filters.
            </p>
          </div>
        </ReactiveReveal>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {materials.map((material, index) => {
            const isLow = material.currentStock <= material.lowStockThreshold;
            return (
              <ReactiveReveal key={material.id} delay={0.06 + index * 0.02} translateY={0.35}>
                <Link
                  href={`/catalog/materials/${material.id}`}
                >
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">
                          {material.name}
                        </CardTitle>
                        {isLow && (
                          <AlertTriangle className="h-5 w-5 text-orange-500" />
                        )}
                      </div>
                      <Badge variant="outline">{material.category}</Badge>
                    </CardHeader>
                    <CardContent>
                      {material.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {material.description}
                        </p>
                      )}
                      <div className="mt-3 space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Stock</span>
                          <span
                            className={
                              isLow ? "font-medium text-orange-600" : ""
                            }
                          >
                            <ReactiveMetric value={material.currentStock} /> {material.unit}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Cost</span>
                          <span>
                            {formatCurrency(material.costPerUnit)}/{material.unit}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </ReactiveReveal>
            );
          })}
        </div>
      )}
    </div>
  );
}
