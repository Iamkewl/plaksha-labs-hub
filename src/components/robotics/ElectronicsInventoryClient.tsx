"use client";

import { useState, useMemo } from "react";
import { Search, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ProcurementRow } from "@/components/robotics/ProcurementRow";
import type { RoboticsAsset, RoboticsInventoryItem, RoboticsProcurement } from "@/lib/placeholder/robotics";

function SectionEmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-10 text-center">
      <Package className="h-8 w-8 text-muted-foreground/40" aria-hidden="true" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

interface ElectronicsInventoryClientProps {
  assets: RoboticsAsset[];
  inventory: RoboticsInventoryItem[];
  procurement: RoboticsProcurement[];
}

export function ElectronicsInventoryClient({
  assets: _assets,
  inventory,
  procurement,
}: ElectronicsInventoryClientProps) {
  const ALL_CATEGORIES = useMemo(
    () => Array.from(new Set(inventory.map((i) => i.category))).sort(),
    [inventory]
  );

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return inventory.filter((item) => {
      const matchesQuery =
        query.trim() === "" ||
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase());
      const matchesCategory =
        activeCategory === null || item.category === activeCategory;
      return matchesQuery && matchesCategory;
    });
  }, [inventory, query, activeCategory]);

  return (
    <div className="space-y-8">
      {/* ── Search + Filters ──────────────────────────── */}
      <div className="space-y-3">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Search inventory…"
            aria-label="Search inventory"
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div
          role="group"
          aria-label="Filter by category"
          className="flex flex-wrap gap-2"
        >
          <Button
            variant={activeCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(null)}
            aria-pressed={activeCategory === null}
            className="h-7 rounded-full px-3 text-xs"
          >
            All
          </Button>
          {ALL_CATEGORIES.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
              aria-pressed={activeCategory === cat}
              className="h-7 rounded-full px-3 text-xs"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* ── Inventory Table + Procurement Queue ─────── */}
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Table */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">
            Inventory Items
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
          </h3>

          {filtered.length === 0 ? (
            <SectionEmptyState message="No items match your search or filter." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead scope="col">Item</TableHead>
                  <TableHead scope="col">Category</TableHead>
                  <TableHead scope="col">Location</TableHead>
                  <TableHead scope="col" className="text-right">
                    Qty on Hand
                  </TableHead>
                  <TableHead scope="col" className="text-right">
                    Reorder At
                  </TableHead>
                  <TableHead scope="col" className="w-24" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item) => {
                  const isLow = item.qtyOnHand <= item.reorderLevel;
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[0.65rem]">
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {item.location ?? "—"}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "text-right font-mono text-sm",
                          isLow ? "text-destructive font-semibold" : "text-foreground"
                        )}
                      >
                        {item.qtyOnHand}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs text-muted-foreground">
                        {item.reorderLevel}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          aria-label={`Checkout ${item.name}`}
                        >
                          Checkout
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Procurement Queue side panel */}
        <aside
          aria-labelledby="procurement-queue-heading"
          className="space-y-3"
        >
          <h3
            id="procurement-queue-heading"
            className="text-sm font-semibold text-foreground"
          >
            Procurement Queue
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              by expected arrival
            </span>
          </h3>

          {procurement.length === 0 ? (
            <SectionEmptyState message="No procurement requests." />
          ) : (
            <div className="space-y-2">
              {procurement.map((item) => (
                <ProcurementRow key={item.id} item={item} />
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
