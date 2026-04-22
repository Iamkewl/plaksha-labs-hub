"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createTrainingSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function getTrainings(params?: {
  userId?: string;
  machineId?: string;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  return prisma.training.findMany({
    where: {
      ...(params?.userId && { userId: params.userId }),
      ...(params?.machineId && { machineId: params.machineId }),
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
      machine: { select: { id: true, name: true, category: true } },
    },
    orderBy: { trainedAt: "desc" },
  });
}

export async function createTraining(data: unknown) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const parsed = createTrainingSchema.parse(data);

  // Check if training already exists
  const existing = await prisma.training.findUnique({
    where: {
      userId_machineId: {
        userId: parsed.userId,
        machineId: parsed.machineId,
      },
    },
  });

  if (existing) {
    throw new Error("User is already trained on this machine");
  }

  const training = await prisma.training.create({
    data: parsed,
  });

  revalidatePath("/admin/training");
  return training;
}

export async function deleteTraining(id: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.training.delete({ where: { id } });
  revalidatePath("/admin/training");
}

export async function isUserTrained(userId: string, machineId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  // Users can only check their own training status; admins can check anyone
  if (session.user.id !== userId && session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const training = await prisma.training.findUnique({
    where: {
      userId_machineId: { userId, machineId },
    },
  });
  return !!training;
}
