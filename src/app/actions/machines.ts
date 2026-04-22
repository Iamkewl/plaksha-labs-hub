"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createMachineSchema, updateMachineSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function getMachines(params?: {
  category?: string;
  status?: string;
  search?: string;
}) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const where: Record<string, unknown> = {};

  if (params?.category) where.category = params.category;
  if (params?.status) where.status = params.status;
  if (params?.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
    ];
  }

  return prisma.machine.findMany({
    where,
    orderBy: { name: "asc" },
  });
}

export async function getMachineById(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  return prisma.machine.findUnique({
    where: { id },
    include: {
      trainings: {
        include: { user: { select: { id: true, name: true, email: true } } },
      },
      bookings: {
        where: {
          endTime: { gte: new Date() },
          status: { in: ["PENDING", "CONFIRMED", "IN_PROGRESS"] },
        },
        include: { user: { select: { id: true, name: true } } },
        orderBy: { startTime: "asc" },
      },
    },
  });
}

export async function createMachine(data: unknown) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const parsed = createMachineSchema.parse(data);
  const machine = await prisma.machine.create({
    data: {
      ...parsed,
      imageUrl: parsed.imageUrl || null,
    },
  });

  revalidatePath("/catalog/machines");
  return machine;
}

export async function updateMachine(id: string, data: unknown) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const parsed = updateMachineSchema.parse(data);
  const machine = await prisma.machine.update({
    where: { id },
    data: {
      ...parsed,
      imageUrl: parsed.imageUrl || null,
    },
  });

  revalidatePath("/catalog/machines");
  revalidatePath(`/catalog/machines/${id}`);
  return machine;
}

export async function deleteMachine(id: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.machine.delete({ where: { id } });
  revalidatePath("/catalog/machines");
}

export async function getMachineCategories() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const categories = await prisma.machine.findMany({
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  });
  return categories.map((c) => c.category);
}
