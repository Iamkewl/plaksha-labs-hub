import { requireRole } from "@/lib/auth-guard";
import {
  getMachineUtilization,
  getMaterialConsumption,
  getBookingTrends,
  getUserActivity,
} from "@/app/actions/analytics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Wrench,
  Package,
  CalendarDays,
  Users,
  AlertTriangle,
  ArrowLeft,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ReactiveMetric, ReactiveReveal } from "@/components/once-ui/reactive-elements";

const STATUS_COLORS: Record<string, string> = {
  AVAILABLE: "bg-emerald-500",
  IN_USE: "bg-blue-500",
  MAINTENANCE: "bg-amber-500",
  RETIRED: "bg-gray-400",
};

const STATUS_TEXT_COLORS: Record<string, string> = {
  AVAILABLE: "text-emerald-700",
  IN_USE: "text-blue-700",
  MAINTENANCE: "text-amber-700",
  RETIRED: "text-gray-500",
};

const BOOKING_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-400",
  CONFIRMED: "bg-blue-500",
  IN_PROGRESS: "bg-violet-500",
  COMPLETED: "bg-emerald-500",
  CANCELLED: "bg-red-400",
};

const ROLE_COLORS: Record<string, string> = {
  STUDENT: "bg-blue-500",
  MENTOR: "bg-violet-500",
  ADMIN: "bg-emerald-500",
};

export default async function AnalyticsPage() {
  await requireRole("ADMIN");

  const [machineData, materialData, bookingData, userData] = await Promise.all([
    getMachineUtilization(),
    getMaterialConsumption(),
    getBookingTrends(),
    getUserActivity(),
  ]);

  const maxBookingCount = Math.max(
    ...machineData.bookingsByMachine.map((m) => m.bookingCount),
    1
  );
  const maxDailyCount = Math.max(...bookingData.dailyCounts.map((d) => d.count), 1);
  const totalMachineStatuses = machineData.statusBreakdown.reduce(
    (sum, s) => sum + s.count,
    0
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <ReactiveReveal className="flex items-center justify-between" translateY={0.3}>
        <div className="space-y-1">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="-ml-2 mb-1">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Makerspace utilization, consumption, and activity insights.
          </p>
        </div>
      </ReactiveReveal>

      {/* ─── Machine Utilization ──────────────────────── */}
      <ReactiveReveal delay={0.04} translateY={0.45}>
        <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Wrench className="h-5 w-5 text-emerald-600" />
          <h2 className="text-xl font-semibold">Machine Utilization</h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Booking counts per machine */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Bookings by Machine</CardTitle>
              <CardDescription>Total booking count per machine</CardDescription>
            </CardHeader>
            <CardContent>
              {machineData.bookingsByMachine.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No booking data yet
                </div>
              ) : (
                <div className="space-y-3">
                  {machineData.bookingsByMachine.map((item, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium truncate max-w-[200px]">
                          {item.machine?.name ?? "Unknown"}
                        </span>
                        <span className="text-muted-foreground tabular-nums">
                          <ReactiveMetric value={item.bookingCount} /> booking{item.bookingCount !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-500"
                          style={{
                            width: `${(item.bookingCount / maxBookingCount) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Machine status breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Status Breakdown</CardTitle>
              <CardDescription>Current machine statuses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Visual bar */}
              <div className="flex h-6 w-full overflow-hidden rounded-full">
                {machineData.statusBreakdown.map((s) => (
                  <div
                    key={s.status}
                    className={`${STATUS_COLORS[s.status] ?? "bg-gray-300"} transition-all`}
                    style={{
                      width: `${(s.count / totalMachineStatuses) * 100}%`,
                    }}
                    title={`${s.status}: ${s.count}`}
                  />
                ))}
              </div>

              {/* Legend */}
              <div className="grid grid-cols-2 gap-2">
                {machineData.statusBreakdown.map((s) => (
                  <div key={s.status} className="flex items-center gap-2">
                    <span
                      className={`inline-block h-3 w-3 rounded-full ${STATUS_COLORS[s.status] ?? "bg-gray-300"}`}
                    />
                    <span className={`text-sm ${STATUS_TEXT_COLORS[s.status] ?? "text-muted-foreground"}`}>
                      {s.status.replace("_", " ")}
                    </span>
                    <span className="ml-auto text-sm font-semibold"><ReactiveMetric value={s.count} /></span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        </section>
      </ReactiveReveal>

      {/* ─── Material Consumption ─────────────────────── */}
      <ReactiveReveal delay={0.08} translateY={0.45}>
        <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold">Material Consumption</h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Top consumed */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Top Consumed Materials</CardTitle>
              <CardDescription>Materials with highest issued quantities</CardDescription>
            </CardHeader>
            <CardContent>
              {materialData.topIssued.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No materials issued yet
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Material</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Issued</TableHead>
                      <TableHead className="text-right">In Stock</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {materialData.topIssued.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">
                          {item.material?.name ?? "Unknown"}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {item.material?.category}
                        </TableCell>
                        <TableCell className="text-right tabular-nums font-semibold">
                          {item.totalIssued} {item.material?.unit}
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-muted-foreground">
                          {item.material?.currentStock} {item.material?.unit}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Low stock */}
          <Card className={materialData.lowStockItems.length > 0 ? "border-orange-200" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                {materialData.lowStockItems.length > 0 && (
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                )}
                Low Stock Items
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                <ReactiveMetric value={materialData.lowStockItems.length} /> item{materialData.lowStockItems.length !== 1 ? "s" : ""} below threshold
              </div>
            </CardHeader>
            <CardContent>
              {materialData.lowStockItems.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  All materials above threshold ✓
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Material</TableHead>
                      <TableHead className="text-right">Stock</TableHead>
                      <TableHead className="text-right">Threshold</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {materialData.lowStockItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.category}</p>
                        </TableCell>
                        <TableCell className="text-right tabular-nums font-semibold text-orange-600">
                          {item.currentStock} {item.unit}
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-muted-foreground">
                          {item.lowStockThreshold} {item.unit}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
        </section>
      </ReactiveReveal>

      {/* ─── Booking Trends ───────────────────────────── */}
      <ReactiveReveal delay={0.12} translateY={0.45}>
        <section className="space-y-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-violet-600" />
          <h2 className="text-xl font-semibold">Booking Overview</h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Status counts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">By Status</CardTitle>
              <CardDescription>All-time booking status breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              {bookingData.statusCounts.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No bookings yet
                </div>
              ) : (
                <div className="space-y-3">
                  {bookingData.statusCounts.map((s) => (
                    <div key={s.status} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-block h-3 w-3 rounded-full ${BOOKING_STATUS_COLORS[s.status] ?? "bg-gray-300"}`}
                        />
                        <span className="text-sm">{s.status.replace("_", " ")}</span>
                      </div>
                      <span className="text-sm font-bold tabular-nums"><ReactiveMetric value={s.count} /></span>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex items-center justify-between">
                    <span className="text-sm font-medium">Total</span>
                    <span className="text-sm font-bold tabular-nums">
                      <ReactiveMetric value={bookingData.statusCounts.reduce((sum, s) => sum + s.count, 0)} />
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Daily chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4" />
                Last 7 Days
              </CardTitle>
              <CardDescription>Bookings created per day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2 h-40">
                {bookingData.dailyCounts.map((d) => {
                  const heightPct = maxDailyCount > 0 ? (d.count / maxDailyCount) * 100 : 0;
                  const dateLabel = new Date(d.date + "T00:00:00").toLocaleDateString("en-IN", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  });
                  return (
                    <div
                      key={d.date}
                      className="flex flex-1 flex-col items-center gap-1"
                    >
                      <span className="text-xs font-semibold tabular-nums"><ReactiveMetric value={d.count} /></span>
                      <div className="w-full flex-1 flex items-end">
                        <div
                          className="w-full rounded-t-md bg-gradient-to-t from-violet-500 to-violet-400 transition-all duration-500"
                          style={{
                            height: `${Math.max(heightPct, 4)}%`,
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground text-center leading-tight">
                        {dateLabel.split(", ").map((part, idx) => (
                          <span key={idx} className="block">{part}</span>
                        ))}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
        </section>
      </ReactiveReveal>

      {/* ─── User Activity ────────────────────────────── */}
      <ReactiveReveal delay={0.16} translateY={0.45}>
        <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-amber-600" />
          <h2 className="text-xl font-semibold">User Activity</h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Role breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Users by Role</CardTitle>
              <div className="text-sm text-muted-foreground">
                <ReactiveMetric value={userData.totalUsers} /> total registered user{userData.totalUsers !== 1 ? "s" : ""}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Visual bar */}
              <div className="flex h-6 w-full overflow-hidden rounded-full">
                {userData.roleBreakdown.map((r) => (
                  <div
                    key={r.role}
                    className={`${ROLE_COLORS[r.role] ?? "bg-gray-300"} transition-all`}
                    style={{
                      width: `${(r.count / Math.max(userData.totalUsers, 1)) * 100}%`,
                    }}
                    title={`${r.role}: ${r.count}`}
                  />
                ))}
              </div>

              <div className="space-y-2">
                {userData.roleBreakdown.map((r) => (
                  <div key={r.role} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block h-3 w-3 rounded-full ${ROLE_COLORS[r.role] ?? "bg-gray-300"}`}
                      />
                      <span className="text-sm">{r.role}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold tabular-nums"><ReactiveMetric value={r.count} /></span>
                      <span className="text-xs text-muted-foreground">
                        ({Math.round((r.count / Math.max(userData.totalUsers, 1)) * 100)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top bookers */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Top Users by Bookings</CardTitle>
              <CardDescription>Users with the most bookings</CardDescription>
            </CardHeader>
            <CardContent>
              {userData.topBookers.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No booking data yet
                </div>
              ) : (
                <div className="space-y-3">
                  {userData.topBookers.map((t, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-md p-2"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-amber-200 text-sm font-bold text-amber-700">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {t.user?.name ?? t.user?.email ?? "Unknown"}
                        </p>
                        <p className="text-xs text-muted-foreground">{t.user?.role}</p>
                      </div>
                      <Badge variant="secondary" className="tabular-nums">
                        <ReactiveMetric value={t.bookingCount} /> booking{t.bookingCount !== 1 ? "s" : ""}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        </section>
      </ReactiveReveal>
    </div>
  );
}
