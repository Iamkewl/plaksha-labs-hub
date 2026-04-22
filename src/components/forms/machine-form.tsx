"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createMachine, updateMachine } from "@/app/actions/machines";
import type { Machine } from "@prisma/client";

interface MachineFormProps {
  machine?: Machine;
}

export function MachineForm({ machine }: MachineFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isEditing = !!machine;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      location: formData.get("location") as string,
      status: formData.get("status") as string,
      costPerHour: formData.get("costPerHour") as string,
      imageUrl: formData.get("imageUrl") as string,
      safetyRequirements: formData.get("safetyRequirements") as string,
      requiresTraining: formData.get("requiresTraining") === "true",
      requiresMentorSupport: formData.get("requiresMentorSupport") === "true",
    };

    try {
      if (isEditing) {
        await updateMachine(machine.id, data);
      } else {
        await createMachine(data);
      }
      router.push("/catalog/machines");
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
        <CardTitle>{isEditing ? "Edit Machine" : "Add New Machine"}</CardTitle>
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
                defaultValue={machine?.name ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                name="category"
                required
                placeholder="e.g., 3D Printing, Laser Cutting, Woodworking"
                defaultValue={machine?.category ?? ""}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={machine?.description ?? ""}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                name="location"
                required
                placeholder="e.g., Room 101, Bay 3"
                defaultValue={machine?.location ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                name="status"
                defaultValue={machine?.status ?? "AVAILABLE"}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AVAILABLE">Available</SelectItem>
                  <SelectItem value="IN_USE">In Use</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                  <SelectItem value="RETIRED">Retired</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="costPerHour">Cost per Hour (₹)</Label>
              <Input
                id="costPerHour"
                name="costPerHour"
                type="number"
                min="0"
                step="0.01"
                defaultValue={machine?.costPerHour ?? 0}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                type="url"
                placeholder="https://..."
                defaultValue={machine?.imageUrl ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="requiresTraining">Requires Training</Label>
              <Select
                name="requiresTraining"
                defaultValue={
                  machine?.requiresTraining !== false ? "true" : "false"
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="requiresMentorSupport">Requires Mentor Technical Support</Label>
            <Select
              name="requiresMentorSupport"
              defaultValue={machine?.requiresMentorSupport ? "true" : "false"}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">No</SelectItem>
                <SelectItem value="true">Yes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="safetyRequirements">Safety Requirements</Label>
            <Textarea
              id="safetyRequirements"
              name="safetyRequirements"
              rows={2}
              placeholder="e.g., Safety goggles required, no loose clothing..."
              defaultValue={machine?.safetyRequirements ?? ""}
            />
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
                ? "Update Machine"
                : "Create Machine"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
