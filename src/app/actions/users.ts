"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { updateUserRoleSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { z } from "zod";

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["STUDENT", "MENTOR", "ADMIN"]).default("STUDENT"),
});

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

export async function createUser(data: unknown) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const parsed = createUserSchema.parse(data);
  const hashedPassword = await bcrypt.hash(parsed.password, 12);

  const existing = await prisma.user.findUnique({ where: { email: parsed.email } });
  if (existing) throw new Error("A user with this email already exists.");

  const user = await prisma.user.create({
    data: {
      name: parsed.name,
      email: parsed.email.trim().toLowerCase(),
      hashedPassword,
      role: parsed.role,
    },
    select: { id: true, name: true, email: true, role: true },
  });

  revalidatePath("/admin/users");
  return user;
}

export async function setUserPassword(userId: string, newPassword: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  if (newPassword.length < 8) throw new Error("Password must be at least 8 characters.");

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({ where: { id: userId }, data: { hashedPassword } });
  revalidatePath("/admin/users");
}
