import { requireAuth } from "@/lib/auth-guard";
import { getBookings, getMyBookingStats } from "@/app/actions/bookings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalendarDays, Clock, Plus } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookingActions } from "./booking-actions";
import { ReactiveMetric, ReactiveReveal } from "@/components/once-ui/reactive-elements";

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "outline",
  CONFIRMED: "default",
  IN_PROGRESS: "secondary",
  COMPLETED: "secondary",
  CANCELLED: "destructive",
};

export default async function BookingsPage() {
  const session = await requireAuth();
  const [{ bookings }, stats] = await Promise.all([
    getBookings(),
    getMyBookingStats(),
  ]);

  const isAdminOrMentor = session.user.role === "ADMIN" || session.user.role === "MENTOR";

  // Split into upcoming and past
  const now = new Date();
  const upcoming = bookings.filter(
    (b) => new Date(b.endTime) >= now && b.status !== "CANCELLED"
  );
  const past = bookings.filter(
    (b) => new Date(b.endTime) < now || b.status === "CANCELLED"
  );

  return (
    <div>
      <ReactiveReveal className="flex items-center justify-between gap-3" translateY={0.35}>
        <div>
          <h1 className="text-3xl font-bold">Bookings</h1>
          <p className="text-muted-foreground">
            Book machines and mentor sessions
          </p>
        </div>
        <Link href="/bookings/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Booking
          </Button>
        </Link>
      </ReactiveReveal>

      {/* Stats */}
      <ReactiveReveal delay={0.04} translateY={0.45}>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Upcoming
              </CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <ReactiveMetric value={stats.upcoming} className="text-2xl font-bold" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Bookings
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <ReactiveMetric value={stats.total} className="text-2xl font-bold" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Cancelled
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ReactiveMetric value={stats.cancelled} className="text-2xl font-bold text-muted-foreground" />
            </CardContent>
          </Card>
        </div>
      </ReactiveReveal>

      {/* Upcoming Bookings */}
      <ReactiveReveal delay={0.08} translateY={0.5}>
        <Card className="mt-6">
        <CardHeader>
          <CardTitle>Upcoming Bookings ({upcoming.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {upcoming.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No upcoming bookings</p>
              <Link href="/bookings/new">
                <Button variant="outline" className="mt-4">
                  Book a machine or mentor session
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {isAdminOrMentor && <TableHead>User</TableHead>}
                  <TableHead>Type</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>Start</TableHead>
                  <TableHead>End</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcoming.map((booking) => (
                  <TableRow key={booking.id}>
                    {isAdminOrMentor && (
                      <TableCell className="font-medium">
                        {booking.user.name ?? booking.user.email}
                      </TableCell>
                    )}
                    <TableCell>
                      <Badge variant="secondary">
                        {booking.machine ? "Machine" : "Mentor"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {booking.machine?.name ?? booking.mentor?.name ?? "—"}
                      {booking.machine?.location && (
                        <span className="block text-xs text-muted-foreground">
                          {booking.machine.location}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(booking.startTime)}</TableCell>
                    <TableCell>{formatDate(booking.endTime)}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {booking.purpose ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusColors[booking.status]}>
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <BookingActions
                        bookingId={booking.id}
                        status={booking.status}
                        isOwner={booking.userId === session.user.id}
                        canManage={isAdminOrMentor}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        </Card>
      </ReactiveReveal>

      {/* Past Bookings */}
      {past.length > 0 && (
        <ReactiveReveal delay={0.12} translateY={0.45}>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-muted-foreground">
                Past & Cancelled ({past.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {past.slice(0, 10).map((booking) => (
                    <TableRow key={booking.id} className="opacity-60">
                      <TableCell>
                        <Badge variant="secondary">
                          {booking.machine ? "Machine" : "Mentor"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {booking.machine?.name ?? booking.mentor?.name ?? "—"}
                      </TableCell>
                      <TableCell>{formatDate(booking.startTime)}</TableCell>
                      <TableCell>
                        <Badge variant={statusColors[booking.status]}>
                          {booking.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </ReactiveReveal>
      )}
    </div>
  );
}
