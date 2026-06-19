import { getMachineById } from "@/app/actions/machines";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate, formatDateShort, formatStatus } from "@/lib/utils";
import {
  ArrowLeft,
  CalendarDays,
  Edit,
  Shield,
  MapPin,
  Clock,
  Cpu,
  CheckCircle2,
  XCircle,
  Users,
  Wrench,
  IndianRupee,
} from "lucide-react";
import Link from "next/link";
import { BookingCalendar } from "@/components/booking-calendar";
import { ReactiveMetric, ReactiveReveal } from "@/components/once-ui/reactive-elements";

const statusConfig: Record<string, { label: string; class: string; dotClass: string }> = {
  AVAILABLE: { label: "Available", class: "bg-emerald-50 text-emerald-700 border-emerald-200", dotClass: "bg-emerald-500" },
  IN_USE: { label: "In Use", class: "bg-blue-50 text-blue-700 border-blue-200", dotClass: "bg-blue-500" },
  MAINTENANCE: { label: "Under Maintenance", class: "bg-amber-50 text-amber-700 border-amber-200", dotClass: "bg-amber-500" },
  RETIRED: { label: "Retired", class: "bg-gray-50 text-gray-500 border-gray-200", dotClass: "bg-gray-400" },
};

export default async function MachineDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  const machine = await getMachineById(params.id);

  if (!machine) notFound();

  const isAdmin = session?.user.role === "ADMIN";
  const isTrained = session?.user
    ? machine.trainings.some((t) => t.user.id === session.user.id)
    : false;

  const statusInfo = statusConfig[machine.status] ?? statusConfig.AVAILABLE;

  // Parse specs JSON if present
  let specs: Record<string, string> = {};
  if (machine.specifications) {
    try {
      specs =
        typeof machine.specifications === "string"
          ? JSON.parse(machine.specifications)
          : (machine.specifications as Record<string, string>);
    } catch {
      // Invalid JSON — ignore
    }
  }

  return (
    <div className="space-y-6">
      {/* Back nav */}
      <ReactiveReveal translateY={0.3}>
        <Link href="/catalog/machines">
          <Button variant="ghost" size="sm" className="-ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Machines
          </Button>
        </Link>
      </ReactiveReveal>

      {/* Hero header */}
      <ReactiveReveal delay={0.04} className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between" translateY={0.4}>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{machine.name}</h1>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{machine.category}</Badge>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusInfo.class}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.dotClass}`} />
              {statusInfo.label}
            </span>
            {machine.requiresTraining && (
              <Badge variant="secondary" className="text-xs">
                Training Required
              </Badge>
            )}
            {machine.requiresMentorSupport && (
              <Badge variant="outline" className="text-xs">
                Mentor Support Required
              </Badge>
            )}
          </div>
        </div>

        <div className="flex gap-2 shrink-0">
          {isAdmin && (
            <Link href={`/admin/machines/${machine.id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </Link>
          )}
          {machine.status === "AVAILABLE" && (
            machine.requiresTraining && !isTrained ? (
              <Button
                size="sm"
                disabled
                title="Complete training before booking this machine"
              >
                <CalendarDays className="mr-2 h-4 w-4" />
                Book Now
              </Button>
            ) : (
              <Link href={`/bookings/new?machineId=${machine.id}`}>
                <Button size="sm">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Book Now
                </Button>
              </Link>
            )
          )}
        </div>
      </ReactiveReveal>

      {/* Quick info bar */}
      <ReactiveReveal delay={0.08} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" translateY={0.5}>
        <Card>
          <CardContent className="flex items-center gap-3 pt-4 pb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50">
              <MapPin className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="text-sm font-medium">{machine.location}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 pt-4 pb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50">
              <IndianRupee className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Cost</p>
              <p className="text-sm font-medium">{formatCurrency(machine.costPerHour)}/hr</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 pt-4 pb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-50">
              <Users className="h-4 w-4 text-violet-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Trained Users</p>
              <p className="text-sm font-medium"><ReactiveMetric value={machine.trainings.length} /></p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 pt-4 pb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-50">
              <CalendarDays className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Upcoming Bookings</p>
              <p className="text-sm font-medium"><ReactiveMetric value={machine.bookings.length} /></p>
            </div>
          </CardContent>
        </Card>
      </ReactiveReveal>

      {/* Training status banner */}
      {machine.requiresTraining && (
        <ReactiveReveal delay={0.11} translateY={0.4}>
          <Card
            className={
              isTrained
                ? "border-emerald-200 bg-emerald-50/50"
                : "border-amber-200 bg-amber-50/50"
            }
          >
            <CardContent className="flex items-center gap-3 py-3">
              {isTrained ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-emerald-800">
                      Training Completed
                    </p>
                    <p className="text-xs text-emerald-700/70">
                      You are certified to use this machine.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-amber-600 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">
                      Training Required
                    </p>
                    <p className="text-xs text-amber-700/70">
                      Contact an admin to complete training before booking this machine.
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </ReactiveReveal>
      )}

      {/* Main content grid */}
      <ReactiveReveal delay={0.14} className="grid gap-6 lg:grid-cols-3" translateY={0.55}>
        {/* Left column: Description + Safety + Specs */}
        <div className="space-y-6 lg:col-span-2">
          {/* Description */}
          {machine.description && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{machine.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Safety Requirements */}
          {machine.safetyRequirements && (
            <Card className="border-red-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-red-800">
                  <Shield className="h-4 w-4" />
                  Safety Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md bg-red-50 p-4">
                  <ul className="space-y-1.5 text-sm text-red-800">
                    {machine.safetyRequirements.split(/[.!]\s+/).filter(Boolean).map((req, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                        {req.trim().replace(/[.!]$/, "")}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Specifications */}
          {Object.keys(specs).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Cpu className="h-4 w-4" />
                  Specifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 sm:grid-cols-2">
                  {Object.entries(specs).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2"
                    >
                      <span className="text-sm text-muted-foreground">
                        {key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())}
                      </span>
                      <span className="text-sm font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Booking Calendar */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CalendarDays className="h-4 w-4" />
                    Booking Schedule
                  </CardTitle>
                  <CardDescription>This week&apos;s availability</CardDescription>
                </div>
                {machine.status === "AVAILABLE" && (
                  <Link href={`/bookings/new?machineId=${machine.id}`}>
                    <Button variant="outline" size="sm">
                      Book a Slot
                    </Button>
                  </Link>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <BookingCalendar
                bookings={machine.bookings.map((b) => ({
                  id: b.id,
                  startTime: b.startTime,
                  endTime: b.endTime,
                  status: b.status,
                  user: b.user,
                  purpose: b.purpose,
                }))}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Trained Users */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-4 w-4" />
                Trained Users
                <Badge variant="secondary" className="ml-auto">
                  <ReactiveMetric value={machine.trainings.length} />
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {machine.trainings.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No trained users yet
                </p>
              ) : (
                <div className="space-y-2">
                  {machine.trainings.slice(0, 15).map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-medium">
                        {(t.user.name ?? t.user.email ?? "?").charAt(0).toUpperCase()}
                      </div>
                      <span className="truncate">
                        {t.user.name ?? t.user.email}
                      </span>
                    </div>
                  ))}
                  {machine.trainings.length > 15 && (
                    <p className="text-xs text-muted-foreground pl-2">
                      +{machine.trainings.length - 15} more
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Bookings List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Upcoming Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {machine.bookings.length === 0 ? (
                <div className="py-4 text-center">
                  <CalendarDays className="mx-auto h-8 w-8 text-muted-foreground/50" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    No upcoming bookings
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {machine.bookings.slice(0, 8).map((b) => (
                    <div
                      key={b.id}
                      className="rounded-md border p-2.5 text-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {b.user.name ?? "User"}
                        </span>
                        <Badge
                          variant={
                            b.status === "CONFIRMED"
                              ? "default"
                              : b.status === "IN_PROGRESS"
                                ? "secondary"
                                : "outline"
                          }
                          className="text-xs"
                        >
                          {formatStatus(b.status)}
                        </Badge>
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDateShort(b.startTime)} – {formatDateShort(b.endTime)}
                      </div>
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
