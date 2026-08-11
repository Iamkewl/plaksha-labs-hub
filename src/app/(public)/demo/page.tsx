/**
 * /demo — landing page for the on-site sandbox.
 *
 * Doubles as:
 *   1. Marketing for the demo itself (when arriving without demo mode
 *      already on, we explain what it is and offer a single CTA).
 *   2. A live overview once demo mode is active — KPI cards, the
 *      sample project's progress, and quick actions to jump into
 *      the next step of the guided tour.
 *
 * Pure client component because every visible bit reads from the
 * demo store.  The route is still SSR-friendly: the store falls back
 * to the canonical seed before hydration so the first paint matches.
 */

"use client";

import Link from "next/link";
import {
  Beaker,
  Calendar,
  ChevronRight,
  ClipboardList,
  FlaskConical,
  FolderKanban,
  Package,
  PlayCircle,
  Users,
  Wrench,
} from "lucide-react";
import { useDemo } from "@/lib/demo/demo-store";
import { DEMO_CHECKLIST } from "@/lib/demo/demo-types";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReactiveReveal } from "@/components/once-ui/reactive-elements";
import { toast } from "@/hooks/use-toast";

export default function DemoLandingPage() {
  const { state, isActive, activate, reset } = useDemo();
  const project = state.projects[0];
  const milestonesDone =
    project?.milestones.filter((m) => m.done).length ?? 0;
  const milestonesTotal = project?.milestones.length ?? 1;
  const milestonePercent = Math.round(
    (milestonesDone / milestonesTotal) * 100
  );

  return (
    <div className="space-y-6">
      {/* ── Header / hero ───────────────────────────────────────────── */}
      <ReactiveReveal translateY={0.35}>
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-primary/[0.08] via-card/85 to-card/60 p-6 backdrop-blur-md sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="section-kicker text-primary">Sandbox</p>
              <h1 className="mt-2 text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
                {isActive
                  ? "You're in Demo Mode"
                  : "Try the Plaksha Labs Hub demo"}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {isActive
                  ? "Click around, book a machine, reserve a material, mark a milestone. Nothing you do leaves this browser — refresh to come back, or hit reset to start over."
                  : "Explore the platform with a pre-populated project, machines, and inventory. No signup. No database writes. Your changes live entirely in your browser."}
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:items-end">
              {!isActive ? (
                <Button onClick={activate} size="lg">
                  <PlayCircle className="mr-1.5 h-4 w-4" />
                  Start demo tour
                </Button>
              ) : (
                <Button onClick={reset} size="lg" variant="outline">
                  Reset demo data
                </Button>
              )}
              <Link
                href="/auth/signin"
                className="text-xs font-semibold text-primary hover:underline"
              >
                Or sign in to use the live app →
              </Link>
            </div>
          </div>
        </div>
      </ReactiveReveal>

      {/* ── KPI cards ───────────────────────────────────────────────── */}
      <ReactiveReveal delay={0.04} translateY={0.4}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            icon={<FolderKanban className="h-4 w-4 text-emerald-500" />}
            label="Active project"
            value={project?.name.split(" ").slice(0, 3).join(" ") ?? "—"}
            sub={`${milestonesDone}/${milestonesTotal} milestones`}
            href="/demo/projects"
          />
          <KpiCard
            icon={<Calendar className="h-4 w-4 text-sky-500" />}
            label="Bookings"
            value={String(state.bookings.length)}
            sub="across all machines"
            href="/demo/bookings"
          />
          <KpiCard
            icon={<Wrench className="h-4 w-4 text-amber-500" />}
            label="Machines"
            value={String(state.machines.length)}
            sub={`${
              state.machines.filter((m) => m.status === "AVAILABLE").length
            } available now`}
            href="/demo/catalog"
          />
          <KpiCard
            icon={<Package className="h-4 w-4 text-violet-500" />}
            label="Materials"
            value={String(state.materials.length)}
            sub={`${
              state.materials.filter((m) => m.currentStock <= m.lowStockThreshold)
                .length
            } low-stock`}
            href="/demo/inventory"
          />
        </div>
      </ReactiveReveal>

      {/* ── Two-column: project preview + checklist ─────────────────── */}
      <ReactiveReveal delay={0.08} translateY={0.45}>
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Project preview */}
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="section-kicker text-primary">
                    Demo project
                  </p>
                  <h2 className="mt-1.5 text-xl font-bold tracking-tight">
                    {project?.name ?? "Autonomous Robotics Prototype"}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    {project?.description}
                  </p>
                </div>
                {project && <StatusBadge status={project.status} />}
              </div>

              {/* Milestone progress */}
              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">
                    Project progress
                  </span>
                  <span className="text-muted-foreground">
                    {milestonesDone} of {milestonesTotal} milestones ·{" "}
                    {milestonePercent}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-indigo-300 transition-all duration-700"
                    style={{ width: `${milestonePercent}%` }}
                  />
                </div>
                <ul className="mt-3 space-y-1.5">
                  {project?.milestones.map((m) => (
                    <li
                      key={m.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                          m.done
                            ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                            : "border-white/20 bg-white/[0.04] text-muted-foreground"
                        }`}
                      >
                        {m.done ? "✓" : ""}
                      </span>
                      <span
                        className={
                          m.done
                            ? "text-muted-foreground line-through decoration-muted-foreground/40"
                            : "text-foreground"
                        }
                      >
                        {m.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Team avatars */}
              {project && (
                <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
                  <div className="flex -space-x-2">
                    {project.members.slice(0, 4).map((m) => (
                      <span
                        key={m.userId}
                        title={m.name}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-primary/15 text-[0.65rem] font-bold text-primary"
                      >
                        {m.name
                          .split(" ")
                          .map((s) => s[0])
                          .slice(0, 2)
                          .join("")}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {project.members.length} team members ·{" "}
                    <span className="font-medium text-foreground">
                      Mentored by {project.mentorName}
                    </span>
                  </p>
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-2">
                <Link href="/demo/projects">
                  <Button>
                    Open project
                    <ChevronRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/demo/bookings">
                  <Button variant="outline">
                    <Calendar className="mr-1.5 h-4 w-4" />
                    Book a machine
                  </Button>
                </Link>
                <Link href="/demo/inventory">
                  <Button variant="outline">
                    <Package className="mr-1.5 h-4 w-4" />
                    Reserve material
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Checklist card */}
          <Card>
            <CardContent className="p-6">
              <p className="section-kicker text-primary">Walkthrough</p>
              <h3 className="mt-1.5 text-lg font-bold tracking-tight">
                Four steps, four minutes
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Each step opens the relevant page and shows you around.
              </p>
              <ol className="mt-4 space-y-2.5">
                {DEMO_CHECKLIST.map((step, idx) => {
                  const done = state.checklist[step.key];
                  return (
                    <li
                      key={step.key}
                      className="flex items-start gap-2.5 rounded-lg border border-white/10 bg-white/[0.02] p-2.5"
                    >
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[0.6rem] font-bold ${
                          done
                            ? "bg-emerald-500 text-white"
                            : "border border-white/30 bg-background text-muted-foreground"
                        }`}
                      >
                        {done ? "✓" : idx + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold leading-snug">
                          {step.title}
                        </p>
                        <Link
                          href={step.href}
                          className="mt-0.5 inline-flex items-center gap-0.5 text-[0.7rem] font-semibold text-primary hover:underline"
                        >
                          {step.cta} →
                        </Link>
                      </div>
                    </li>
                  );
                })}
              </ol>
              <Button
                onClick={() => {
                  if (!isActive) activate();
                  toast({
                    title: "Demo tour started",
                    description:
                      "Follow the four steps — your progress is saved to this browser.",
                  });
                }}
                className="mt-4 w-full"
                variant={isActive ? "outline" : "default"}
              >
                <FlaskConical className="mr-1.5 h-4 w-4" />
                {isActive ? "Resume tour" : "Start tour"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </ReactiveReveal>

      {/* ── "Why try the demo" — only when not yet activated ─────────── */}
      {!isActive && (
        <ReactiveReveal delay={0.12} translateY={0.5}>
          <Card>
            <CardContent className="p-6">
              <p className="section-kicker text-primary">Why try it</p>
              <h3 className="mt-1.5 text-lg font-bold tracking-tight">
                See the whole flow without the paperwork
              </h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <ReasonCard
                  icon={<Beaker className="h-4 w-4" />}
                  title="Sandbox state"
                  copy="Every change lives in your browser. Refreshing keeps it. Reset wipes it."
                />
                <ReasonCard
                  icon={<ClipboardList className="h-4 w-4" />}
                  title="Guided walkthrough"
                  copy="Four curated steps cover the main flows: project, inventory, booking, milestones."
                />
                <ReasonCard
                  icon={<Users className="h-4 w-4" />}
                  title="No signup"
                  copy="Skip auth entirely. When you're ready, sign in to use the live app."
                />
              </div>
            </CardContent>
          </Card>
        </ReactiveReveal>
      )}
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
  sub,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-white/10 bg-card/75 p-4 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-tile-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <div className="flex items-center justify-between">
        <p
          className="text-[0.65rem] font-semibold uppercase tracking-[0.10em] text-muted-foreground"
        >
          {label}
        </p>
        {icon}
      </div>
      <p className="mt-2 truncate text-lg font-bold leading-tight tracking-tight text-foreground">
        {value}
      </p>
      <p className="mt-0.5 text-[0.7rem] text-muted-foreground">{sub}</p>
    </Link>
  );
}

function ReasonCard({
  icon,
  title,
  copy,
}: {
  icon: React.ReactNode;
  title: string;
  copy: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </span>
      <p className="mt-3 text-sm font-semibold">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        {copy}
      </p>
    </div>
  );
}
