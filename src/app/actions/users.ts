"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { updateUserRoleSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function getUsers(params?: { role?: string; search?: string }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const where: Record<string, unknown> = {};

  if (params?.role) where.role = params.role;
  if (params?.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { email: { contains: params.search, mode: "insensitive" } },
    ];
  }

  return prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          trainings: true,
          bookings: true,
          projectMemberships: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });
}

export async function updateUserRole(data: unknown) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const parsed = updateUserRoleSchema.parse(data);

  // Prevent self-demotion
  if (parsed.userId === session.user.id && parsed.role !== "ADMIN") {
    throw new Error("Cannot change your own role");
  }

  const user = await prisma.user.update({
    where: { id: parsed.userId },
    data: { role: parsed.role },
  });

  revalidatePath("/admin/users");
  return user;
}
