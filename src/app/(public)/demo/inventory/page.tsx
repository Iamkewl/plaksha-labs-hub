"use client";

/**
 * /demo/inventory — material catalog with reservation action.
 *
 * Renders every material in the demo store, color-coded by category,
 * with a stock progress bar and an inline "Reserve" action.  Triggers
 * the "reserve_inventory" guided-tour step on first successful reserve.
 */

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Filter,
  Package,
  Search,
} from "lucide-react";
import { useDemo } from "@/lib/demo/demo-store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ReactiveReveal } from "@/components/once-ui/reactive-elements";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "All",
  "3D Printing",
  "Resin",
  "Sheet Goods",
  "Hardware",
  "Electronics",
] as const;
type CategoryFilter = (typeof CATEGORIES)[number];

export default function DemoInventoryPage() {
  const { state, isActive, activate, reserveMaterial, markStep } = useDemo();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [showLowOnly, setShowLowOnly] = useState(false);

  useEffect(() => {
    if (!isActive) activate();
    markStep("reserve_inventory");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    return state.materials.filter((m) => {
      if (category !== "All" && m.category !== category) return false;
      if (showLowOnly && m.currentStock > m.lowStockThreshold) return false;
      if (
        search &&
        !`${m.name} ${m.category}`.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [state.materials, search, category, showLowOnly]);

  const lowStock = state.materials.filter(
    (m) => m.currentStock <= m.lowStockThreshold
  );

  const handleReserve = (materialId: string, name: string) => {
    reserveMaterial(materialId, 1);
    markStep("reserve_inventory");
    toast({
      title: "Material reserved",
      description: `1 unit of ${name} moved to your project.`,
    });
  };

  return (
    <div className="space-y-6">
      <ReactiveReveal translateY={0.35}>
        <div>
          <p className="section-kicker text-primary">Inventory</p>
          <h1 className="mt-1.5 text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
            Materials &amp; consumables
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {state.materials.length} SKUs · {lowStock.length} low-stock
            {lowStock.length > 0 ? " — request restock from admin" : ""}.
          </p>
        </div>
      </ReactiveReveal>

      {/* Low-stock banner */}
      {lowStock.length > 0 && (
        <ReactiveReveal delay={0.04} translateY={0.4}>
          <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/[0.06] p-4">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-300" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                {lowStock.length} item{lowStock.length === 1 ? "" : "s"} below
                the low-stock threshold
              </p>
              <p className="mt-0.5 text-xs text-amber-700/80 dark:text-amber-300/80">
                {lowStock.map((m) => m.name).join(", ")}
              </p>
            </div>
          </div>
        </ReactiveReveal>
      )}

      <ReactiveReveal delay={0.06} translateY={0.45}>
        <Card>
          <CardContent className="p-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search materials…"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] py-1.5 pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring/30"
                />
              </div>
              <label className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={showLowOnly}
                  onChange={(e) => setShowLowOnly(e.target.checked)}
                  className="h-3.5 w-3.5 accent-primary"
                />
                Low stock only
              </label>
              <div className="flex flex-wrap items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className={cn(
                      "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
                      category === c
                        ? "border-foreground/20 bg-foreground/10 text-foreground"
                        : "border-white/10 bg-white/[0.02] text-muted-foreground hover:border-white/20 hover:text-foreground"
                    )}
                    aria-pressed={category === c}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </ReactiveReveal>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No materials match your filters"
          description="Try clearing search or pick a different category."
          primaryAction={{
            label: "Clear filters",
            onClick: () => {
              setSearch("");
              setCategory("All");
              setShowLowOnly(false);
            },
          }}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m, idx) => {
            const lowStock = m.currentStock <= m.lowStockThreshold;
            const stockPercent = Math.min(
              100,
              Math.max(
                5,
                (m.currentStock / Math.max(m.lowStockThreshold * 3, 1)) * 100
              )
            );
            return (
              <ReactiveReveal
                key={m.id}
                delay={0.04 + idx * 0.025}
                translateY={0.4}
              >
                <article
                  className={cn(
                    "group flex flex-col gap-3 rounded-2xl border bg-card/75 p-4 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-tile-lift",
                    lowStock
                      ? "border-amber-500/30 hover:border-amber-500/50"
                      : "border-white/10 hover:border-white/20"
                  )}
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-1 rounded-t-2xl"
                    style={{ background: m.accent, opacity: 0.7 }}
                  />
                  <div className="flex items-start justify-between gap-2 pt-1">
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      {m.category}
                    </p>
                    {lowStock && (
                      <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                        <AlertTriangle className="h-2.5 w-2.5" />
                        Low
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold leading-snug">
                    {m.name}
                  </h3>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {m.currentStock} {m.unit} in stock
                      </span>
                      <span className="font-semibold text-foreground">
                        ₹{m.costPerUnit}/{m.unit}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          lowStock
                            ? "bg-amber-500"
                            : "bg-gradient-to-r from-primary to-indigo-300"
                        )}
                        style={{ width: `${stockPercent}%` }}
                      />
                    </div>
                    <p className="text-[0.65rem] text-muted-foreground">
                      Reorder below {m.lowStockThreshold} {m.unit}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleReserve(m.id, m.name)}
                    disabled={m.currentStock <= 0}
                    className="mt-auto"
                  >
                    {m.currentStock <= 0 ? "Out of stock" : "Reserve 1 unit"}
                  </Button>
                </article>
              </ReactiveReveal>
            );
          })}
        </div>
      )}
    </div>
  );
}
