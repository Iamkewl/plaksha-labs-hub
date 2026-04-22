"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createAvailabilitySchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function getMentorAvailability(mentorId?: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  // Only the mentor themselves or an admin may query a specific mentor's schedule
  if (mentorId && mentorId !== session.user.id && session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const userId = mentorId ?? session.user.id;

  return prisma.mentorAvailability.findMany({
    where: { userId, isActive: true },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });
}

export async function getAllMentorAvailability() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  return prisma.mentorAvailability.findMany({
    where: { isActive: true },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: [{ userId: "asc" }, { dayOfWeek: "asc" }, { startTime: "asc" }],
  });
}

export async function createAvailability(data: unknown) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  // Only mentors and admins can create availability
  if (session.user.role !== "MENTOR" && session.user.role !== "ADMIN") {
    throw new Error("Only mentors can manage availability");
  }

  const parsed = createAvailabilitySchema.parse(data);

  const slot = await prisma.mentorAvailability.create({
    data: {
      userId: session.user.id,
      dayOfWeek: parsed.dayOfWeek ?? null,
      date: parsed.date ?? null,
      startTime: parsed.startTime,
      endTime: parsed.endTime,
    },
  });

  revalidatePath("/mentor/availability");
  revalidatePath("/bookings/new");
  return slot;
}

export async function deleteAvailability(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const slot = await prisma.mentorAvailability.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!slot) throw new Error("Availability slot not found");

  // Only the owner or admin can delete
  if (slot.userId !== session.user.id && session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.mentorAvailability.delete({ where: { id } });
  revalidatePath("/mentor/availability");
  revalidatePath("/bookings/new");
}

export async function toggleAvailability(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const slot = await prisma.mentorAvailability.findUnique({
    where: { id },
    select: { userId: true, isActive: true },
  });

  if (!slot) throw new Error("Availability slot not found");
  if (slot.userId !== session.user.id && session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const updated = await prisma.mentorAvailability.update({
    where: { id },
    data: { isActive: !slot.isActive },
  });

  revalidatePath("/mentor/availability");
  return updated;
}

export async function getMentors() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  return prisma.user.findMany({
    where: { role: "MENTOR" },
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });
}
