"use client";

/**
 * /demo/projects — single-project deep-dive.
 *
 * Mirrors the structure of the real /projects/[id] page but reads
 * entirely from the demo store.  Lets the visitor:
 *
 *   1. See team members and the BOM
 *   2. Toggle individual milestones (writes back to the store)
 *   3. Watch the project status automatically reflect milestone %
 *   4. Trigger the "track_milestones" guided-tour step on first
 *      milestone toggle.
 */

import { useEffect, useMemo } from "react";
import {
  CalendarRange,
  CheckCircle2,
  Circle,
  ClipboardList,
  Cpu,
  DollarSign,
  ExternalLink,
  Eye,
  EyeOff,
  Package,
  Users,
  Wrench,
} from "lucide-react";
import { useDemo } from "@/lib/demo/demo-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ReactiveReveal } from "@/components/once-ui/reactive-elements";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";

export default function DemoProjectsPage() {
  const { state, isActive, activate, toggleMilestone, markStep } = useDemo();
  const project = state.projects[0];

  // Mark the "explore_dashboard" checklist step on first visit.
  useEffect(() => {
    if (!isActive) activate();
    markStep("explore_dashboard");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Compute progress.
  const progress = useMemo(() => {
    if (!project) return { done: 0, total: 0, percent: 0 };
    const done = project.milestones.filter((m) => m.done).length;
    const total = project.milestones.length;
    return { done, total, percent: Math.round((done / total) * 100) };
  }, [project]);

  if (!project) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="No demo project loaded"
        description="Hit reset to restore the sample dataset."
        primaryAction={{ label: "Reset demo", onClick: () => location.reload() }}
      />
    );
  }

  const handleMilestoneToggle = (milestoneId: string, currentlyDone: boolean) => {
    toggleMilestone(project.id, milestoneId);
    // Mark the "track_milestones" step on the first toggle.
    markStep("track_milestones");
    toast({
      title: currentlyDone ? "Milestone reopened" : "Milestone complete",
      description: currentlyDone
        ? "Marked as incomplete. Project progress updated."
        : "Nice — project progress moved forward.",
    });
  };

  // Auto-derive project status from milestone percentage.
  const derivedStatus =
    progress.percent === 100
      ? "SHIPPED"
      : progress.percent >= 60
      ? "REVIEW"
      : progress.percent >= 25
      ? "BUILD"
      : "ACTIVE";

  return (
    <div className="space-y-6">
      {/* Header */}
      <ReactiveReveal translateY={0.35}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="section-kicker text-primary">Project</p>
            <h1 className="mt-1.5 truncate text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
              {project.name}
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {project.description}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <StatusBadge status={derivedStatus} />
              <Badge variant="secondary" className="gap-1">
                {project.isPublic ? (
                  <>
                    <Eye className="h-3.5 w-3.5" /> Public
                  </>
                ) : (
                  <>
                    <EyeOff className="h-3.5 w-3.5" /> Private
                  </>
                )}
              </Badge>
              <span className="text-xs text-muted-foreground">
                v{project.bom.version} BOM ·{" "}
                {new Date(project.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/demo/bookings">
              <Button variant="outline">
                <CalendarRange className="mr-1.5 h-4 w-4" />
                Book a machine
              </Button>
            </Link>
          </div>
        </div>
      </ReactiveReveal>

      {/* Progress + KPIs */}
      <ReactiveReveal delay={0.04} translateY={0.4}>
        <div className="grid gap-3 sm:grid-cols-3">
          <Card>
            <CardContent className="p-5">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.10em] text-muted-foreground">
                Milestones
              </p>
              <p className="mt-2 text-2xl font-bold leading-none">
                {progress.done} / {progress.total}
              </p>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-indigo-300 transition-all duration-700"
                  style={{ width: `${progress.percent}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {progress.percent}% complete
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.10em] text-muted-foreground">
                BOM cost
              </p>
              <p className="mt-2 text-2xl font-bold leading-none">
                ₹{project.bom.totalCost.toLocaleString("en-IN")}
              </p>
              <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <DollarSign className="h-3 w-3" />
                {project.bom.items.length} line items
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.10em] text-muted-foreground">
                Team
              </p>
              <p className="mt-2 text-2xl font-bold leading-none">
                {project.members.length}
              </p>
              <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                Mentored by {project.mentorName}
              </p>
            </CardContent>
          </Card>
        </div>
      </ReactiveReveal>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Milestones */}
        <ReactiveReveal delay={0.08} translateY={0.4}>
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Milestones</CardTitle>
              <p className="text-xs text-muted-foreground">
                Click a milestone to toggle its status. The project status
                updates automatically.
              </p>
            </CardHeader>
            <CardContent className="space-y-2">
              {project.milestones.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleMilestoneToggle(m.id, m.done)}
                  className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all ${
                    m.done
                      ? "border-emerald-500/30 bg-emerald-500/[0.04] hover:border-emerald-500/50"
                      : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
                  aria-pressed={m.done}
                >
                  {m.done ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                  ) : (
                    <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
                  )}
                  <span
                    className={`flex-1 text-sm font-medium ${
                      m.done
                        ? "text-muted-foreground line-through decoration-muted-foreground/40"
                        : "text-foreground"
                    }`}
                  >
                    {m.label}
                  </span>
                  <span
                    className={`text-[0.65rem] font-semibold uppercase tracking-[0.10em] ${
                      m.done ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
                    }`}
                  >
                    {m.done ? "Done" : "Pending"}
                  </span>
                </button>
              ))}
            </CardContent>
          </Card>
        </ReactiveReveal>

        {/* Team */}
        <ReactiveReveal delay={0.12} translateY={0.45}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Team</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {project.members.map((m) => (
                <div
                  key={m.userId}
                  className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-2.5"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                    {m.name
                      .split(" ")
                      .map((s) => s[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold leading-tight">
                      {m.name}
                    </p>
                    <p className="text-[0.7rem] text-muted-foreground">
                      {m.role === "LEAD" ? "Project Lead" : "Member"}
                    </p>
                  </div>
                  {m.role === "LEAD" && (
                    <span className="rounded-md bg-primary/15 px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-primary">
                      Lead
                    </span>
                  )}
                </div>
              ))}
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-dashed border-white/15 p-2.5 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                Mentored by{" "}
                <span className="font-semibold text-foreground">
                  {project.mentorName}
                </span>
              </div>
            </CardContent>
          </Card>
        </ReactiveReveal>
      </div>

      {/* BOM */}
      <ReactiveReveal delay={0.16} translateY={0.5}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle className="text-lg">
                  Bill of Materials — v{project.bom.version}
                </CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">
                  Approved by mentor ·{" "}
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  }).format(project.bom.totalCost)}{" "}
                  total
                </p>
              </div>
              <StatusBadge status={project.bom.status} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg border border-white/10">
              <table className="w-full text-sm">
                <thead className="bg-white/[0.04] text-[0.65rem] uppercase tracking-[0.10em] text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold">
                      Material
                    </th>
                    <th className="px-3 py-2 text-right font-semibold">Qty</th>
                    <th className="px-3 py-2 text-right font-semibold">
                      Unit cost
                    </th>
                    <th className="px-3 py-2 text-right font-semibold">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {project.bom.items.map((it) => (
                    <tr
                      key={it.materialId}
                      className="border-t border-white/5 transition-colors hover:bg-white/[0.03]"
                    >
                      <td className="px-3 py-2 font-medium">{it.materialName}</td>
                      <td className="px-3 py-2 text-right tabular-nums">
                        {it.quantity} {it.unit}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">
                        ₹{it.costSnapshot.toLocaleString("en-IN")}
                      </td>
                      <td className="px-3 py-2 text-right font-semibold tabular-nums">
                        ₹
                        {(it.quantity * it.costSnapshot).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t border-white/10 bg-white/[0.04]">
                  <tr>
                    <td colSpan={3} className="px-3 py-2 text-right text-sm font-semibold">
                      Total
                    </td>
                    <td className="px-3 py-2 text-right text-sm font-bold tabular-nums">
                      ₹{project.bom.totalCost.toLocaleString("en-IN")}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/demo/inventory">
                <Button variant="outline" size="sm">
                  <Package className="mr-1.5 h-3.5 w-3.5" />
                  Reserve from inventory
                </Button>
              </Link>
              <Link href="/demo/bookings">
                <Button variant="outline" size="sm">
                  <Wrench className="mr-1.5 h-3.5 w-3.5" />
                  Book a machine
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </ReactiveReveal>
    </div>
  );
}
