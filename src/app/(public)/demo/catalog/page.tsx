"use client";

/**
 * /demo/catalog — interactive machine catalog.
 *
 * Lists every demo machine with a status badge, "next available"
 * timestamp, and per-card quick-action: book (opens the booking
 * drawer) or view details.  The drawer is shared with the bookings
 * page via the demo store.
 */

import { useEffect, useMemo, useState } from "react";
import {
  Clock,
  Filter,
  MapPin,
  Search,
  Wrench,
} from "lucide-react";
import { useDemo } from "@/lib/demo/demo-store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ReactiveReveal } from "@/components/once-ui/reactive-elements";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";

const CATEGORIES = [
  "All",
  "3D Printing",
  "Resin Printing",
  "Laser Cutting",
  "CNC Machining",
  "Electronics",
  "Robotics",
] as const;

type CategoryFilter = (typeof CATEGORIES)[number];

export default function DemoCatalogPage() {
  const { state, isActive, activate, addBooking, markStep } = useDemo();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [bookingFor, setBookingFor] = useState<string | null>(null);

  useEffect(() => {
    if (!isActive) activate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    return state.machines.filter((m) => {
      if (category !== "All" && m.category !== category) return false;
      if (showOnlyAvailable && m.status !== "AVAILABLE") return false;
      if (
        search &&
        !`${m.name} ${m.location} ${m.description}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [state.machines, search, category, showOnlyAvailable]);

  const machine = state.machines.find((m) => m.id === bookingFor);

  return (
    <div className="space-y-6">
      <ReactiveReveal translateY={0.35}>
        <div>
          <p className="section-kicker text-primary">Catalog</p>
          <h1 className="mt-1.5 text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
            Machine catalog
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {state.machines.length} machines across {CATEGORIES.length - 1}{" "}
            categories. Click <span className="font-semibold">Book</span> on any
            card to reserve a time slot — your booking lands in the sandbox.
          </p>
        </div>
      </ReactiveReveal>

      <ReactiveReveal delay={0.04} translateY={0.4}>
        <Card>
          <CardContent className="p-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search machines, locations, descriptions…"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] py-1.5 pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring/30"
                />
              </div>
              <label className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={showOnlyAvailable}
                  onChange={(e) => setShowOnlyAvailable(e.target.checked)}
                  className="h-3.5 w-3.5 accent-primary"
                />
                Available now
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
          icon={Wrench}
          title="No machines match your filters"
          description="Try clearing the search or pick a different category."
          primaryAction={{
            label: "Clear filters",
            onClick: () => {
              setSearch("");
              setCategory("All");
              setShowOnlyAvailable(false);
            },
          }}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m, idx) => (
            <ReactiveReveal
              key={m.id}
              delay={0.05 + idx * 0.03}
              translateY={0.4}
            >
              <article
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-card/75 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-tile-lift"
                style={{
                  backgroundImage: `linear-gradient(180deg, ${m.accent}10 0%, transparent 50%)`,
                }}
              >
                {/* Accent header */}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1.5"
                  style={{ background: m.accent }}
                />
                <div className="flex flex-1 flex-col p-5 pt-6">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
                    >
                      {m.category}
                    </p>
                    <StatusBadge status={m.status} />
                  </div>
                  <h3 className="mt-1.5 text-base font-semibold leading-tight tracking-tight">
                    {m.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {m.description}
                  </p>

                  <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                    <p className="flex items-center gap-1.5">
                      <MapPin className="h-3 w-3 shrink-0" />
                      {m.location}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3 shrink-0" />
                      {m.status === "AVAILABLE"
                        ? "Available now"
                        : `Next: ${new Date(m.nextAvailable).toLocaleString(
                            "en-IN",
                            { dateStyle: "medium", timeStyle: "short" }
                          )}`}
                    </p>
                    <p className="flex items-center gap-1.5 font-medium text-foreground">
                      ₹{m.costPerHour}/hr
                    </p>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        if (m.status === "MAINTENANCE") {
                          toast({
                            title: "Machine under maintenance",
                            description: `${m.name} is unavailable until ${new Date(
                              m.nextAvailable
                            ).toLocaleDateString()}.`,
                            variant: "destructive",
                          });
                          return;
                        }
                        setBookingFor(m.id);
                      }}
                      disabled={m.status === "MAINTENANCE"}
                    >
                      Book
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/demo/bookings">View</Link>
                    </Button>
                  </div>
                </div>
              </article>
            </ReactiveReveal>
          ))}
        </div>
      )}

      {/* Inline booking confirmation */}
      {bookingFor && machine && (
        <QuickBookDialog
          machineName={machine.name}
          machineId={machine.id}
          onCancel={() => setBookingFor(null)}
          onConfirm={(start, end) => {
            addBooking({
              userId: state.users[0].id,
              userName: state.users[0].name,
              machineId: machine.id,
              machineName: machine.name,
              startTime: start,
              endTime: end,
              status: "PENDING",
              purpose: "Quick demo booking",
            });
            markStep("book_machine");
            setBookingFor(null);
            toast({
              title: "Booking requested",
              description: `${machine.name} · ${new Date(start).toLocaleString()}`,
            });
          }}
        />
      )}
    </div>
  );
}

function QuickBookDialog({
  machineName,
  machineId,
  onCancel,
  onConfirm,
}: {
  machineName: string;
  machineId: string;
  onCancel: () => void;
  onConfirm: (start: string, end: string) => void;
}) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);
  const startISO = tomorrow.toISOString().slice(0, 16);
  const [start, setStart] = useState(startISO);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="w-full max-w-md rounded-2xl border border-white/15 bg-popover p-6 shadow-2xl">
        <h2 className="text-lg font-bold tracking-tight">Book {machineName}</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Pick a start time — default is tomorrow at 10:00.
        </p>
        <label className="mt-4 block">
          <span className="mb-1 block text-[0.65rem] font-semibold uppercase tracking-[0.10em] text-muted-foreground">
            Start
          </span>
          <input
            type="datetime-local"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring/30"
          />
        </label>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              const s = new Date(start);
              const e = new Date(s.getTime() + 2 * 3_600_000);
              onConfirm(s.toISOString(), e.toISOString());
            }}
          >
            Confirm booking
          </Button>
        </div>
      </div>
    </div>
  );
}
