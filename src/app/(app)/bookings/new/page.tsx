import { requireAuth } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { BookingForm } from "@/components/forms/booking-form";

export default async function NewBookingPage() {
  const session = await requireAuth();

  // Fetch machines, mentors, user's trainings, and existing bookings in parallel
  const [machines, mentors, trainings, existingBookings] = await Promise.all([
    prisma.machine.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        location: true,
        status: true,
        requiresTraining: true,
        requiresMentorSupport: true,
        costPerHour: true,
      },
      orderBy: { name: "asc" },
    }),
    prisma.user.findMany({
      where: { role: "MENTOR" },
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    }),
    prisma.training.findMany({
      where: { userId: session.user.id },
      select: { machineId: true },
    }),
    // Get active bookings for the next 30 days for conflict detection
    prisma.booking.findMany({
      where: {
        startTime: { gte: new Date() },
        endTime: {
          lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        status: { in: ["PENDING", "CONFIRMED", "IN_PROGRESS"] },
      },
      select: {
        id: true,
        machineId: true,
        mentorId: true,
        startTime: true,
        endTime: true,
      },
    }),
  ]);

  return (
    <div className="mx-auto max-w-2xl">
      <BookingForm
        machines={machines}
        mentors={mentors}
        trainedMachineIds={trainings}
        existingBookings={existingBookings}
      />
    </div>
  );
}
