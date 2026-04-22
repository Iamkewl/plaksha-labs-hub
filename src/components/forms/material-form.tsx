"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createMaterial, updateMaterial } from "@/app/actions/materials";
import type { Material } from "@prisma/client";

interface MaterialFormProps {
  material?: Material;
}

export function MaterialForm({ material }: MaterialFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isEditing = !!material;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      unit: formData.get("unit") as string,
      costPerUnit: formData.get("costPerUnit") as string,
      currentStock: formData.get("currentStock") as string,
      lowStockThreshold: formData.get("lowStockThreshold") as string,
      imageUrl: formData.get("imageUrl") as string,
    };

    try {
      if (isEditing) {
        await updateMaterial(material.id, data);
      } else {
        await createMaterial(data);
      }
      router.push("/catalog/materials");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing ? "Edit Material" : "Add New Material"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                required
                defaultValue={material?.name ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                name="category"
                required
                placeholder="e.g., Filaments, Adhesives, Wood"
                defaultValue={material?.category ?? ""}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={material?.description ?? ""}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Input
                id="unit"
                name="unit"
                required
                placeholder="e.g., kg, meters, pieces"
                defaultValue={material?.unit ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="costPerUnit">Cost per Unit (₹)</Label>
              <Input
                id="costPerUnit"
                name="costPerUnit"
                type="number"
                min="0"
                step="0.01"
                defaultValue={material?.costPerUnit ?? 0}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                type="url"
                placeholder="https://..."
                defaultValue={material?.imageUrl ?? ""}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="currentStock">Current Stock</Label>
              <Input
                id="currentStock"
                name="currentStock"
                type="number"
                min="0"
                step="0.01"
                defaultValue={material?.currentStock ?? 0}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
              <Input
                id="lowStockThreshold"
                name="lowStockThreshold"
                type="number"
                min="0"
                step="0.01"
                defaultValue={material?.lowStockThreshold ?? 10}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : isEditing
                ? "Update Material"
                : "Create Material"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
