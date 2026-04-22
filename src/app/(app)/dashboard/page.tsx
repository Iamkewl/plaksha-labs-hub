import { auth } from "@/lib/auth";
import { getDashboardStats } from "@/app/actions/analytics";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  FolderKanban,
  AlertTriangle,
  Users,
  Bell,
  Clock,
  ArrowRight,
  BarChart3,
  ClipboardList,
  FileText,
  CheckCircle2,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { formatDateShort } from "@/lib/utils";
import { ReactiveMetric, ReactiveReveal } from "@/components/once-ui/reactive-elements";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");

  const data = await getDashboardStats();

  if (data.role === "STUDENT") {
    return <StudentDashboard data={data} userName={session.user.name} />;
  }
  if (data.role === "MENTOR") {
    return <MentorDashboard data={data} userName={session.user.name} />;
  }
  return <AdminDashboard data={data} userName={session.user.name} />;
}

// ─── Student Dashboard ──────────────────────────────────

type StudentData = Extract<Awaited<ReturnType<typeof getDashboardStats>>, { role: "STUDENT" }>;

function StudentDashboard({ data, userName }: { data: StudentData; userName?: string | null }) {
  return (
    <div className="space-y-6">
      <ReactiveReveal className="space-y-1" translateY={0.35}>
        <h1 className="text-3xl font-bold">
          Welcome back, {userName?.split(" ")[0] ?? "there"}!
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here&apos;s your makerspace overview.
        </p>
      </ReactiveReveal>

      {/* KPI Cards */}
      <ReactiveReveal delay={0.04} translateY={0.45}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/bookings">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Upcoming Bookings
                </CardTitle>
                <CalendarDays className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <ReactiveMetric value={data.upcomingBookings.length} className="text-2xl font-bold" />
                <p className="text-xs text-muted-foreground">scheduled sessions</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/projects">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Projects
                </CardTitle>
                <FolderKanban className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <ReactiveMetric value={data.activeProjects.length} className="text-2xl font-bold" />
                <p className="text-xs text-muted-foreground">team projects</p>
              </CardContent>
            </Card>
          </Link>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Requests
              </CardTitle>
              <ClipboardList className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <ReactiveMetric value={data.pendingRequests} className="text-2xl font-bold" />
              <p className="text-xs text-muted-foreground">material requests</p>
            </CardContent>
          </Card>

          <Link href="/notifications">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Notifications
                </CardTitle>
                <Bell className="h-4 w-4 text-violet-500" />
              </CardHeader>
              <CardContent>
                <ReactiveMetric
                  value={data.recentNotifications.filter((n) => !n.read).length}
                  className="text-2xl font-bold"
                />
                <p className="text-xs text-muted-foreground">unread</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </ReactiveReveal>

      <ReactiveReveal delay={0.08} translateY={0.55}>
        <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Bookings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Upcoming Bookings</CardTitle>
            <Link href="/bookings">
              <Button variant="ghost" size="sm">
                View all <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {data.upcomingBookings.length === 0 ? (
              <div className="py-6 text-center">
                <CalendarDays className="mx-auto h-8 w-8 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">No upcoming bookings</p>
                <Link href="/bookings/new">
                  <Button variant="outline" size="sm" className="mt-3">
                    Book a session
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {data.upcomingBookings.slice(0, 3).map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50">
                      {b.machine ? (
                        <Wrench className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Users className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {b.machine?.name ?? b.mentor?.name ?? "Session"}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDateShort(b.startTime)}
                        {b.machine?.location && (
                          <>
                            <MapPin className="h-3 w-3 ml-1" />
                            {b.machine.location}
                          </>
                        )}
                      </div>
                    </div>
                    <Badge
                      variant={b.status === "CONFIRMED" ? "default" : "outline"}
                      className="text-xs"
                    >
                      {b.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">My Projects</CardTitle>
            <Link href="/projects">
              <Button variant="ghost" size="sm">
                View all <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {data.activeProjects.length === 0 ? (
              <div className="py-6 text-center">
                <FolderKanban className="mx-auto h-8 w-8 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">No projects yet</p>
                <Link href="/projects/new">
                  <Button variant="outline" size="sm" className="mt-3">
                    Create a project
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {data.activeProjects.slice(0, 4).map((p) => (
                  <Link key={p.id} href={`/projects/${p.id}`}>
                    <div className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{p.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {p.members.length} member{p.members.length !== 1 ? "s" : ""}
                          {" · "}
                          {p._count.boms} BOM{p._count.boms !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        </div>
      </ReactiveReveal>

      {/* Recent Notifications */}
      {data.recentNotifications.length > 0 && (
        <ReactiveReveal delay={0.12} translateY={0.45}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Recent Notifications</CardTitle>
              <Link href="/notifications">
                <Button variant="ghost" size="sm">
                  View all <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {data.recentNotifications.slice(0, 4).map((n) => (
                  <div
                    key={n.id}
                    className={`flex items-start gap-3 rounded-md p-2 text-sm ${
                      !n.read ? "bg-blue-50/50" : ""
                    }`}
                  >
                    <Bell className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className={`truncate ${!n.read ? "font-medium" : ""}`}>{n.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateShort(n.createdAt)}
                      </p>
                    </div>
                    {!n.read && (
                      <span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </ReactiveReveal>
      )}
    </div>
  );
}

// ─── Mentor Dashboard ───────────────────────────────────

type MentorData = Extract<Awaited<ReturnType<typeof getDashboardStats>>, { role: "MENTOR" }>;

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function MentorDashboard({ data, userName }: { data: MentorData; userName?: string | null }) {
  return (
    <div className="space-y-6">
      <ReactiveReveal className="space-y-1" translateY={0.35}>
        <h1 className="text-3xl font-bold">
          Hello, {userName?.split(" ")[0] ?? "Mentor"}!
        </h1>
        <p className="mt-1 text-muted-foreground">
          Your mentoring overview for today.
        </p>
      </ReactiveReveal>

      {/* KPI Cards */}
      <ReactiveReveal delay={0.04} translateY={0.45}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Today&apos;s Sessions
              </CardTitle>
              <CalendarDays className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <ReactiveMetric value={data.todaySessions.length} className="text-2xl font-bold" />
              <p className="text-xs text-muted-foreground">scheduled today</p>
            </CardContent>
          </Card>

          <Link href="/bookings">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Upcoming Sessions
                </CardTitle>
                <Clock className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <ReactiveMetric value={data.upcomingSessions.length} className="text-2xl font-bold" />
                <p className="text-xs text-muted-foreground">after today</p>
              </CardContent>
            </Card>
          </Link>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Projects Supervised
              </CardTitle>
              <FolderKanban className="h-4 w-4 text-violet-500" />
            </CardHeader>
            <CardContent>
              <ReactiveMetric value={data.supervisedProjects.length} className="text-2xl font-bold" />
              <p className="text-xs text-muted-foreground">active projects</p>
            </CardContent>
          </Card>

          <Link href="/mentor/availability">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Availability Slots
                </CardTitle>
                <CheckCircle2 className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <ReactiveMetric value={data.availabilitySlots.length} className="text-2xl font-bold" />
                <p className="text-xs text-muted-foreground">active slots</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </ReactiveReveal>

      <ReactiveReveal delay={0.08} translateY={0.55}>
        <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Today&apos;s Sessions</CardTitle>
            <CardDescription>Your mentoring sessions for today</CardDescription>
          </CardHeader>
          <CardContent>
            {data.todaySessions.length === 0 ? (
              <div className="py-6 text-center">
                <CalendarDays className="mx-auto h-8 w-8 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">No sessions today</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.todaySessions.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-50">
                      <Users className="h-4 w-4 text-violet-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {s.user.name ?? s.user.email}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDateShort(s.startTime)}
                        {s.machine && (
                          <span className="ml-2 text-muted-foreground">
                            on {s.machine.name}
                          </span>
                        )}
                      </div>
                    </div>
                    <Badge
                      variant={s.status === "CONFIRMED" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {s.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Sessions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Upcoming Sessions</CardTitle>
              <CardDescription>Your next mentoring sessions</CardDescription>
            </div>
            <Link href="/bookings">
              <Button variant="ghost" size="sm">
                View all <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {data.upcomingSessions.length === 0 ? (
              <div className="py-6 text-center">
                <Clock className="mx-auto h-8 w-8 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">
                  No upcoming sessions
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.upcomingSessions.slice(0, 4).map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50">
                      <Users className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {s.user.name ?? s.user.email}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDateShort(s.startTime)}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {s.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Supervised Projects */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">My Mentee Projects</CardTitle>
            <CardDescription>Projects you supervise</CardDescription>
          </CardHeader>
          <CardContent>
            {data.supervisedProjects.length === 0 ? (
              <div className="py-6 text-center">
                <FolderKanban className="mx-auto h-8 w-8 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">
                  No projects assigned
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.supervisedProjects.map((p) => (
                  <Link key={p.id} href={`/projects/${p.id}`}>
                    <div className="rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                      <p className="text-sm font-medium">{p.name}</p>
                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {p.members.length} member{p.members.length !== 1 ? "s" : ""}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {p._count.boms} BOM{p._count.boms !== 1 ? "s" : ""}
                        </span>
                      </div>
                      {p.members.length > 0 && (
                        <p className="mt-1.5 text-xs text-muted-foreground">
                          {p.members.map((m) => m.user.name).filter(Boolean).join(", ")}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Availability Summary */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Availability</CardTitle>
              <CardDescription>Your recurring slots</CardDescription>
            </div>
            <Link href="/mentor/availability">
              <Button variant="ghost" size="sm">
                Manage <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {data.availabilitySlots.length === 0 ? (
              <div className="py-6 text-center">
                <Clock className="mx-auto h-8 w-8 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">
                  No availability set
                </p>
                <Link href="/mentor/availability">
                  <Button variant="outline" size="sm" className="mt-3">
                    Set availability
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {data.availabilitySlots
                  .filter((s) => s.dayOfWeek !== null)
                  .map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2 text-sm"
                    >
                      <span className="font-medium">{DAYS[s.dayOfWeek!]}</span>
                      <span className="text-muted-foreground">
                        {s.startTime} – {s.endTime}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
        </div>
      </ReactiveReveal>
    </div>
  );
}

// ─── Admin Dashboard ────────────────────────────────────

type AdminData = Extract<Awaited<ReturnType<typeof getDashboardStats>>, { role: "ADMIN" }>;

function AdminDashboard({ data, userName }: { data: AdminData; userName?: string | null }) {
  return (
    <div className="space-y-6">
      <ReactiveReveal translateY={0.35}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-muted-foreground">
              Welcome back, {userName?.split(" ")[0] ?? "Admin"}. Here&apos;s the makerspace at a glance.
            </p>
          </div>
          <Link href="/admin/analytics">
            <Button>
              <BarChart3 className="mr-2 h-4 w-4" />
              View Analytics
            </Button>
          </Link>
        </div>
      </ReactiveReveal>

      {/* KPI Cards */}
      <ReactiveReveal delay={0.04} translateY={0.45}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Link href="/admin/users">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <ReactiveMetric value={data.totalUsers} className="text-2xl font-bold" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/catalog/machines">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Machines
                </CardTitle>
                <Wrench className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <ReactiveMetric value={data.totalMachines} className="text-2xl font-bold" />
              </CardContent>
            </Card>
          </Link>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Bookings Today
              </CardTitle>
              <CalendarDays className="h-4 w-4 text-violet-500" />
            </CardHeader>
            <CardContent>
              <ReactiveMetric value={data.bookingsToday} className="text-2xl font-bold" />
            </CardContent>
          </Card>

          <Link href="/admin/material-requests">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending Requests
                </CardTitle>
                <ClipboardList className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <ReactiveMetric
                  value={data.pendingMaterialRequests + data.pendingBoms}
                  className="text-2xl font-bold"
                />
                <p className="text-xs text-muted-foreground">
                  {data.pendingMaterialRequests} material · {data.pendingBoms} BOM
                </p>
              </CardContent>
            </Card>
          </Link>

          <Card className={data.lowStockCount > 0 ? "border-orange-200" : ""}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Low Stock
              </CardTitle>
              <AlertTriangle
                className={`h-4 w-4 ${data.lowStockCount > 0 ? "text-orange-500" : "text-muted-foreground"}`}
              />
            </CardHeader>
            <CardContent>
              <ReactiveMetric
                value={data.lowStockCount}
                className={`text-2xl font-bold ${data.lowStockCount > 0 ? "text-orange-600" : ""}`}
              />
              <p className="text-xs text-muted-foreground">items below threshold</p>
            </CardContent>
          </Card>
        </div>
      </ReactiveReveal>

      <ReactiveReveal delay={0.08} translateY={0.55}>
        <div className="grid gap-6 lg:grid-cols-2">
        {/* Low Stock Alert */}
        {data.lowStockItems.length > 0 && (
          <Card className="border-orange-200 bg-orange-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base text-orange-800">
                <AlertTriangle className="h-4 w-4" />
                Low Stock Alert
              </CardTitle>
              <CardDescription className="text-orange-700/70">
                Materials below their restock threshold
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead className="text-right">Threshold</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.lowStockItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-muted-foreground">{item.category}</TableCell>
                      <TableCell className="text-right font-mono text-orange-700">
                        {item.currentStock} {item.unit}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {item.lowStockThreshold} {item.unit}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Recent Activity</CardTitle>
              <CardDescription>Latest booking activity</CardDescription>
            </div>
            <Link href="/bookings">
              <Button variant="ghost" size="sm">
                View all <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {data.recentActivity.length === 0 ? (
              <div className="py-6 text-center">
                <CalendarDays className="mx-auto h-8 w-8 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">
                  No recent activity
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.recentActivity.slice(0, 6).map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center gap-3 rounded-md p-2 text-sm"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      {b.machine ? (
                        <Wrench className="h-3.5 w-3.5 text-muted-foreground" />
                      ) : (
                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate">
                        <span className="font-medium">{b.user.name ?? "User"}</span>{" "}
                        booked{" "}
                        <span className="text-muted-foreground">
                          {b.machine?.name ?? b.mentor?.name ?? "a session"}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateShort(b.createdAt)}
                      </p>
                    </div>
                    <Badge
                      variant={
                        b.status === "CONFIRMED"
                          ? "default"
                          : b.status === "CANCELLED"
                            ? "destructive"
                            : "outline"
                      }
                      className="text-xs shrink-0"
                    >
                      {b.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        </div>
      </ReactiveReveal>

      {/* Quick Actions */}
      <ReactiveReveal delay={0.12} translateY={0.4}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Link href="/admin/machines/new">
                <Button variant="outline" className="w-full justify-start">
                  <Wrench className="mr-2 h-4 w-4" />
                  Add Machine
                </Button>
              </Link>
              <Link href="/admin/materials/new">
                <Button variant="outline" className="w-full justify-start">
                  <Package className="mr-2 h-4 w-4" />
                  Add Material
                </Button>
              </Link>
              <Link href="/admin/material-requests">
                <Button variant="outline" className="w-full justify-start">
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Review Requests
                </Button>
              </Link>
              <Link href="/admin/analytics">
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Analytics
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </ReactiveReveal>
    </div>
  );
}
