import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BookingRow } from "@/components/dashboard/BookingRow";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { type PlaceholderBooking } from "@/lib/placeholder/dashboard";
import { Plus, CalendarDays } from "lucide-react";
import Link from "next/link";
import { getBookings } from "@/app/actions/bookings";

export const dynamic = "force-dynamic";

export default async function DashboardBookingsPage() {
  let upcoming: PlaceholderBooking[] = [];
  let past: PlaceholderBooking[] = [];

  try {
    const { bookings } = await getBookings();
    const now = new Date();

    const allMapped: PlaceholderBooking[] = bookings.map((b) => ({
      id: b.id,
      machineId: b.machineId ?? null,
      mentorId: b.mentorId ?? null,
      machineName: b.machine?.name ?? null,
      mentorName: b.mentor?.name ?? null,
      location: b.machine?.location ?? null,
      startTime: b.startTime,
      endTime: b.endTime,
      status: b.status as PlaceholderBooking["status"],
      createdAt: b.createdAt,
    }));

    upcoming = allMapped.filter(
      (b) => new Date(b.endTime) >= now && b.status !== "CANCELLED"
    );
    past = allMapped.filter(
      (b) => new Date(b.endTime) < now || b.status === "CANCELLED"
    );
  } catch {
    // DB error — fall through with empty arrays; never show fake data
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your Bookings</h1>
          <p className="mt-1 text-muted-foreground">
            View and manage all your machine and mentor session bookings
          </p>
        </div>
        <Link href="/bookings/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Booking
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="upcoming">
            Upcoming ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4 mt-6">
          {upcoming.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <EmptyState
                  icon={CalendarDays}
                  title="No upcoming bookings"
                  description="You don't have any scheduled sessions yet"
                  action={{
                    label: "Book a session",
                    href: "/bookings/new",
                  }}
                />
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {upcoming.map((booking) => (
                <BookingRow key={booking.id} booking={booking} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4 mt-6">
          {past.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <EmptyState
                  icon={CalendarDays}
                  title="No past bookings"
                  description="Your completed sessions will appear here"
                />
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {past.map((booking) => (
                <BookingRow key={booking.id} booking={booking} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
