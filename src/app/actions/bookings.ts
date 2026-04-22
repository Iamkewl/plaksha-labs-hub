"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import {
  createBookingSchema,
  updateBookingStatusSchema,
} from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { sendTransactionalEmail } from "@/lib/email";

const BOOKINGS_PAGE_SIZE = 50;

export async function getBookings(params?: {
  userId?: string;
  machineId?: string;
  mentorId?: string;
  status?: string;
  from?: Date;
  to?: Date;
  page?: number;
}) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const page = Math.max(1, params?.page ?? 1);
  const skip = (page - 1) * BOOKINGS_PAGE_SIZE;

  const where: Record<string, unknown> = {};

  if (session.user.role === "STUDENT") {
    where.userId = session.user.id;
  } else if (session.user.role === "MENTOR") {
    where.OR = [
      { userId: session.user.id },
      { mentorId: session.user.id },
    ];
  } else if (session.user.role === "ADMIN") {
    if (params?.userId) where.userId = params.userId;
  }

  if (params?.machineId) where.machineId = params.machineId;
  if (params?.mentorId) where.mentorId = params.mentorId;
  if (params?.status) where.status = params.status;

  if (params?.from || params?.to) {
    where.startTime = {};
    if (params.from) (where.startTime as Record<string, Date>).gte = params.from;
    if (params.to) (where.startTime as Record<string, Date>).lte = params.to;
  }

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        machine: { select: { id: true, name: true, category: true, location: true } },
        mentor: { select: { id: true, name: true, email: true } },
      },
      orderBy: { startTime: "asc" },
      take: BOOKINGS_PAGE_SIZE,
      skip,
    }),
    prisma.booking.count({ where }),
  ]);

  return { bookings, total, page, pageSize: BOOKINGS_PAGE_SIZE };
}

export async function getBookingById(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      machine: { select: { id: true, name: true, category: true, location: true, status: true } },
      mentor: { select: { id: true, name: true, email: true } },
    },
  });

  if (!booking) throw new Error("Booking not found");

  if (
    session.user.role !== "ADMIN" &&
    booking.userId !== session.user.id &&
    booking.mentorId !== session.user.id
  ) {
    throw new Error("Unauthorized");
  }

  return booking;
}

export async function createBooking(data: unknown) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const parsed = createBookingSchema.parse(data);

  if (parsed.startTime <= new Date()) {
    throw new Error("Booking must be in the future");
  }

  const booking = await prisma.$transaction(async (tx) => {
    if (parsed.machineId) {
      const machine = await tx.machine.findUnique({
        where: { id: parsed.machineId },
        select: {
          requiresTraining: true,
          requiresMentorSupport: true,
          status: true,
          name: true,
        },
      });

      if (!machine) throw new Error("Machine not found");
      if (machine.status !== "AVAILABLE") {
        throw new Error(
          `Machine "${machine.name}" is not available (status: ${machine.status})`
        );
      }

      if (machine.requiresTraining) {
        const training = await tx.training.findUnique({
          where: {
            userId_machineId: {
              userId: session.user.id,
              machineId: parsed.machineId,
            },
          },
        });
        if (!training) {
          throw new Error(
            `Training required: You must complete training on "${machine.name}" before booking. Contact an admin.`
          );
        }
      }

      if (machine.requiresMentorSupport && !parsed.mentorId) {
        throw new Error(
          `Mentor support required: Please select a mentor for "${machine.name}".`
        );
      }

      const machineConflict = await tx.booking.findFirst({
        where: {
          machineId: parsed.machineId,
          status: { in: ["PENDING", "CONFIRMED", "IN_PROGRESS"] },
          startTime: { lt: parsed.endTime },
          endTime: { gt: parsed.startTime },
        },
        select: { startTime: true, endTime: true },
      });

      if (machineConflict) {
        throw new Error(
          `Time conflict: This machine is already booked from ${machineConflict.startTime.toLocaleString()} to ${machineConflict.endTime.toLocaleString()}`
        );
      }
    }

    if (parsed.mentorId) {
      const mentor = await tx.user.findUnique({
        where: { id: parsed.mentorId },
        select: { role: true },
      });

      if (!mentor || mentor.role !== "MENTOR") {
        throw new Error("Selected mentor is not valid");
      }

      const mentorConflict = await tx.booking.findFirst({
        where: {
          mentorId: parsed.mentorId,
          status: { in: ["PENDING", "CONFIRMED", "IN_PROGRESS"] },
          startTime: { lt: parsed.endTime },
          endTime: { gt: parsed.startTime },
        },
      });

      if (mentorConflict) {
        throw new Error("Time conflict: This mentor is already booked for the selected time slot");
      }
    }

    const selfConflict = await tx.booking.findFirst({
      where: {
        userId: session.user.id,
        status: { in: ["PENDING", "CONFIRMED", "IN_PROGRESS"] },
        startTime: { lt: parsed.endTime },
        endTime: { gt: parsed.startTime },
      },
    });

    if (selfConflict) {
      throw new Error("You already have a booking during this time period");
    }

    return tx.booking.create({
      data: {
        userId: session.user.id,
        machineId: parsed.machineId || null,
        mentorId: parsed.mentorId || null,
        startTime: parsed.startTime,
        endTime: parsed.endTime,
        purpose: parsed.purpose,
        notes: parsed.notes || null,
      },
    });
  }, {
    isolationLevel: "Serializable",
  });

  revalidatePath("/bookings");
  return booking;
}

export async function updateBookingStatus(data: unknown) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const parsed = updateBookingStatusSchema.parse(data);

  const booking = await prisma.booking.findUnique({
    where: { id: parsed.bookingId },
    select: { userId: true, mentorId: true, status: true },
  });

  if (!booking) throw new Error("Booking not found");

  const isOwner = booking.userId === session.user.id;
  const isAssignedMentor = booking.mentorId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";

  if (parsed.status === "CANCELLED") {
    if (!isOwner && !isAdmin && !isAssignedMentor) {
      throw new Error("Unauthorized");
    }
  } else if (parsed.status === "CONFIRMED") {
    if (!isAdmin && !isAssignedMentor) {
      throw new Error("Only admins or the assigned mentor can confirm bookings");
    }
  }

  if (booking.status === "CANCELLED" || booking.status === "COMPLETED") {
    throw new Error(`Cannot update a ${booking.status.toLowerCase()} booking`);
  }

  const updated = await prisma.booking.update({
    where: { id: parsed.bookingId },
    data: { status: parsed.status },
  });

  if (["CONFIRMED", "CANCELLED"].includes(parsed.status)) {
    const emailContext = await prisma.booking.findUnique({
      where: { id: updated.id },
      select: {
        user: { select: { email: true, name: true } },
        machine: { select: { name: true } },
        startTime: true,
        endTime: true,
      },
    });

    const to = emailContext?.user.email;
    if (to) {
      const machineName = emailContext.machine?.name ?? "selected resource";
      const statusLabel = parsed.status === "CONFIRMED" ? "confirmed" : "cancelled";
      const subject = `Booking ${statusLabel}: ${machineName}`;
      const text = [
        `Hi ${emailContext.user.name ?? "there"},`,
        "",
        `Your booking for ${machineName} has been ${statusLabel}.`,
        `Time: ${emailContext.startTime.toLocaleString()} - ${emailContext.endTime.toLocaleString()}`,
        "",
        "Please check Makerspace Hub for more details.",
      ].join("\n");

      await sendTransactionalEmail({
        to,
        subject,
        text,
      });
    }
  }

  revalidatePath("/bookings");
  return updated;
}

export async function getUpcomingBookingsForMachine(machineId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  return prisma.booking.findMany({
    where: {
      machineId,
      endTime: { gte: new Date() },
      status: { in: ["PENDING", "CONFIRMED", "IN_PROGRESS"] },
    },
    include: {
      user: { select: { name: true } },
    },
    orderBy: { startTime: "asc" },
    take: 20,
  });
}

export async function getMyBookingStats() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const [upcoming, total, cancelled] = await Promise.all([
    prisma.booking.count({
      where: {
        userId: session.user.id,
        startTime: { gte: new Date() },
        status: { in: ["PENDING", "CONFIRMED"] },
      },
    }),
    prisma.booking.count({
      where: { userId: session.user.id },
    }),
    prisma.booking.count({
      where: {
        userId: session.user.id,
        status: "CANCELLED",
      },
    }),
  ]);

  return { upcoming, total, cancelled };
}
