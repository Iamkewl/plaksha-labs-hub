"use client";

/**
 * /demo/bookings — interactive machine-booking table.
 *
 * Shows every demo booking in a sortable table and lets the visitor
 * add a new booking against any available machine.  The "New booking"
 * flow is intentionally a single-screen drawer (no multi-step form)
 * so the demo stays approachable.
 *
 * Triggers the "book_machine" checklist step on successful create.
 */

import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  CalendarPlus,
  CheckCircle2,
  Clock,
  Filter,
  MapPin,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useDemo } from "@/lib/demo/demo-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ReactiveReveal } from "@/components/once-ui/reactive-elements";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type StatusFilter = "ALL" | "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED";

export default function DemoBookingsPage() {
  const {
    state,
    isActive,
    activate,
    addBooking,
    markStep,
  } = useDemo();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!isActive) activate();
    markStep("book_machine");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    return state.bookings.filter((b) => {
      if (status !== "ALL" && b.status !== status) return false;
      if (
        search &&
        !`${b.userName} ${b.machineName} ${b.purpose}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [state.bookings, search, status]);

  const upcoming = filtered.filter(
    (b) => new Date(b.endTime) >= new Date() && b.status !== "CANCELLED"
  );
  const past = filtered.filter(
    (b) => new Date(b.endTime) < new Date() || b.status === "CANCELLED"
  );

  return (
    <div className="space-y-6">
      <ReactiveReveal translateY={0.35}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="section-kicker text-primary">Bookings</p>
            <h1 className="mt-1.5 text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
              Machine bookings
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Reserve a time slot on a makerspace machine. Cancellations,
              approvals, and conflict checks are all in-app.
            </p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-1.5 h-4 w-4" />
            New booking
          </Button>
        </div>
      </ReactiveReveal>

      {/* Filters */}
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
                  placeholder="Search by name, machine, or purpose…"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] py-1.5 pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring/30"
                />
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                {(
                  [
                    { key: "ALL", label: "All" },
                    { key: "PENDING", label: "Pending" },
                    { key: "CONFIRMED", label: "Confirmed" },
                    { key: "IN_PROGRESS", label: "In progress" },
                    { key: "COMPLETED", label: "Completed" },
                  ] as { key: StatusFilter; label: string }[]
                ).map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setStatus(s.key)}
                    className={cn(
                      "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
                      status === s.key
                        ? "border-foreground/20 bg-foreground/10 text-foreground"
                        : "border-white/10 bg-white/[0.02] text-muted-foreground hover:border-white/20 hover:text-foreground"
                    )}
                    aria-pressed={status === s.key}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </ReactiveReveal>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No bookings match your filters"
          description="Try clearing the search box or pick a different status."
          primaryAction={{ label: "New booking", onClick: () => setShowForm(true) }}
        />
      ) : (
        <>
          {upcoming.length > 0 && (
            <ReactiveReveal delay={0.08} translateY={0.45}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Upcoming ({upcoming.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <BookingsTable rows={upcoming} />
                </CardContent>
              </Card>
            </ReactiveReveal>
          )}
          {past.length > 0 && (
            <ReactiveReveal delay={0.12} translateY={0.5}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Past ({past.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <BookingsTable rows={past} dim />
                </CardContent>
              </Card>
            </ReactiveReveal>
          )}
        </>
      )}

      {showForm && (
        <NewBookingDrawer
          onClose={() => setShowForm(false)}
          onSubmit={(input) => {
            addBooking(input);
            setShowForm(false);
            markStep("book_machine");
            toast({
              title: "Booking requested",
              description: `${input.machineName} · ${new Date(input.startTime).toLocaleString()}`,
            });
          }}
        />
      )}
    </div>
  );
}

function BookingsTable({
  rows,
  dim = false,
}: {
  rows: ReturnType<typeof useDemo>["state"]["bookings"];
  dim?: boolean;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-[0.65rem] uppercase tracking-[0.10em] text-muted-foreground">
          <tr>
            <th className="px-4 py-2 text-left font-semibold">User</th>
            <th className="px-4 py-2 text-left font-semibold">Machine</th>
            <th className="px-4 py-2 text-left font-semibold">When</th>
            <th className="px-4 py-2 text-left font-semibold">Purpose</th>
            <th className="px-4 py-2 text-left font-semibold">Status</th>
          </tr>
        </thead>
        <tbody className={dim ? "opacity-60" : undefined}>
          {rows.map((b) => (
            <tr
              key={b.id}
              className="border-t border-white/5 transition-colors hover:bg-white/[0.03]"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-[0.65rem] font-bold text-primary">
                    {b.userName
                      .split(" ")
                      .map((s) => s[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                  <span className="font-medium">{b.userName}</span>
                </div>
              </td>
              <td className="px-4 py-3 font-medium">{b.machineName}</td>
              <td className="px-4 py-3">
                <div className="flex flex-col text-xs">
                  <span>
                    {new Date(b.startTime).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                  <span className="text-muted-foreground">
                    → {new Date(b.endTime).toLocaleTimeString("en-IN", { timeStyle: "short" })}
                  </span>
                </div>
              </td>
              <td className="max-w-[24ch] truncate px-4 py-3 text-muted-foreground">
                {b.purpose}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={b.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function NewBookingDrawer({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (input: {
    userId: string;
    userName: string;
    machineId: string;
    machineName: string;
    startTime: string;
    endTime: string;
    status: "PENDING";
    purpose: string;
  }) => void;
}) {
  const { state } = useDemo();
  const available = state.machines.filter((m) => m.status !== "MAINTENANCE");
  const [machineId, setMachineId] = useState(available[0]?.id ?? "");
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  });
  const [startHour, setStartHour] = useState("10");
  const [duration, setDuration] = useState("2");
  const [purpose, setPurpose] = useState("Print chassis brackets");
  const user = state.users[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!machineId) {
      toast({ title: "Pick a machine first", variant: "destructive" });
      return;
    }
    const machine = state.machines.find((m) => m.id === machineId);
    if (!machine) return;
    const start = new Date(`${date}T${startHour.padStart(2, "0")}:00:00`);
    const end = new Date(start.getTime() + Number(duration) * 3_600_000);
    onSubmit({
      userId: user.id,
      userName: user.name,
      machineId,
      machineName: machine.name,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      status: "PENDING",
      purpose,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-t-2xl border border-white/15 bg-popover p-6 shadow-2xl sm:rounded-2xl"
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight">New booking</h2>
            <p className="text-xs text-muted-foreground">
              Demo booking — nothing is written to the real database.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          <Field label="Machine">
            <select
              value={machineId}
              onChange={(e) => setMachineId(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring/30"
            >
              {available.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} · {m.location} · ₹{m.costPerHour}/hr
                </option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-3 gap-2">
            <Field label="Date">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </Field>
            <Field label="Starts at">
              <select
                value={startHour}
                onChange={(e) => setStartHour(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                {Array.from({ length: 11 }, (_, i) => i + 8).map((h) => (
                  <option key={h} value={h}>
                    {h.toString().padStart(2, "0")}:00
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Hours">
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                {[1, 2, 3, 4, 6, 8].map((h) => (
                  <option key={h} value={h}>
                    {h} hr
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Purpose">
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="What are you printing / cutting / testing?"
              className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
          </Field>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            <CalendarPlus className="mr-1.5 h-4 w-4" />
            Request booking
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[0.65rem] font-semibold uppercase tracking-[0.10em] text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
