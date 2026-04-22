"use client";

import { useState } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { createBom } from "@/app/actions/boms";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";

type Material = {
  id: string;
  name: string;
  unit: string;
  costPerUnit: number;
  currentStock: number;
};

type BomLine = {
  materialId: string;
  materialName: string;
  unit: string;
  costPerUnit: number;
  quantity: number;
  notes: string;
};

export function BomBuilder({
  projectId,
  materials,
}: {
  projectId: string;
  materials: Material[];
}) {
  const [lines, setLines] = useState<BomLine[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [quantity, setQuantity] = useState("");
  const [lineNotes, setLineNotes] = useState("");
  const [bomNotes, setBomNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const totalCost = lines.reduce(
    (sum, l) => sum + l.costPerUnit * l.quantity,
    0
  );

  function addLine() {
    const mat = materials.find((m) => m.id === selectedMaterial);
    if (!mat || !quantity || parseFloat(quantity) <= 0) return;

    setLines((prev) => [
      ...prev,
      {
        materialId: mat.id,
        materialName: mat.name,
        unit: mat.unit,
        costPerUnit: mat.costPerUnit,
        quantity: parseFloat(quantity),
        notes: lineNotes,
      },
    ]);
    setSelectedMaterial("");
    setQuantity("");
    setLineNotes("");
  }

  function removeLine(index: number) {
    setLines((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit() {
    if (lines.length === 0) {
      setError("Add at least one item before creating the BOM");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const bom = await createBom(
        projectId,
        { notes: bomNotes || undefined },
        lines.map((l) => ({
          materialId: l.materialId,
          quantity: l.quantity,
          notes: l.notes || undefined,
        }))
      );
      router.push(`/projects/${projectId}/bom/${bom.id}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create BOM");
      setLoading(false);
    }
  }

  const usedMaterialIds = new Set(lines.map((l) => l.materialId));
  const availableMaterials = materials.filter((m) => !usedMaterialIds.has(m.id));

  return (
    <div className="space-y-6">
      {/* Add item row */}
      <div className="rounded-lg border p-4 space-y-4">
        <p className="text-sm font-medium">Add Item</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="space-y-1 sm:col-span-1">
            <Label className="text-xs">Material *</Label>
            <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
              <SelectTrigger>
                <SelectValue placeholder="Select material…" />
              </SelectTrigger>
              <SelectContent>
                {availableMaterials.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name} ({m.unit}) — {formatCurrency(m.costPerUnit)}/unit
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Quantity *</Label>
            <Input
              type="number"
              min="0.001"
              step="any"
              placeholder="e.g. 5"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Notes</Label>
            <Input
              placeholder="Optional notes"
              value={lineNotes}
              onChange={(e) => setLineNotes(e.target.value)}
            />
          </div>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={addLine}
          disabled={!selectedMaterial || !quantity || parseFloat(quantity) <= 0}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add to BOM
        </Button>
      </div>

      {/* BOM Items table */}
      {lines.length > 0 && (
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead className="text-right">Unit Cost</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {lines.map((line, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{line.materialName}</TableCell>
                  <TableCell className="text-right">{line.quantity}</TableCell>
                  <TableCell className="text-muted-foreground">{line.unit}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(line.costPerUnit)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(line.costPerUnit * line.quantity)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {line.notes || "—"}
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => removeLine(i)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/30">
                <TableCell colSpan={4} className="font-medium text-right">
                  Total
                </TableCell>
                <TableCell className="text-right font-bold">
                  {formatCurrency(totalCost)}
                </TableCell>
                <TableCell colSpan={2} />
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}

      {/* BOM notes */}
      <div className="space-y-2">
        <Label htmlFor="bom-notes">BOM Notes (optional)</Label>
        <Textarea
          id="bom-notes"
          placeholder="Any notes for the admin reviewing this BOM…"
          rows={2}
          value={bomNotes}
          onChange={(e) => setBomNotes(e.target.value)}
        />
      </div>

      {error && (
        <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <Button
        onClick={handleSubmit}
        disabled={loading || lines.length === 0}
        className="w-full sm:w-auto"
      >
        {loading ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating…</>
        ) : (
          `Create BOM (${lines.length} item${lines.length !== 1 ? "s" : ""})`
        )}
      </Button>
    </div>
  );
}
