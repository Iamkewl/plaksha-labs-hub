"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createMaterialSchema, updateMaterialSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function getMaterials(params?: {
  category?: string;
  search?: string;
}) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const where: Record<string, unknown> = {};

  if (params?.category) where.category = params.category;
  if (params?.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
    ];
  }

  const materials = await prisma.material.findMany({
    where,
    orderBy: { name: "asc" },
  });

  return materials;
}

// Separate function for low-stock that pushes the filter to the database
export async function getLowStockMaterials() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  return prisma.$queryRaw<
    Array<{
      id: string;
      name: string;
      description: string | null;
      category: string;
      unit: string;
      costPerUnit: number;
      currentStock: number;
      lowStockThreshold: number;
      imageUrl: string | null;
    }>
  >`
    SELECT id, name, description, category, unit,
           "costPerUnit", "currentStock", "lowStockThreshold", "imageUrl"
    FROM "materials"
    WHERE "currentStock" <= "lowStockThreshold"
    ORDER BY name ASC
  `;
}

export async function getMaterialById(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  return prisma.material.findUnique({
    where: { id },
  });
}

export async function createMaterial(data: unknown) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const parsed = createMaterialSchema.parse(data);
  const material = await prisma.material.create({
    data: {
      ...parsed,
      imageUrl: parsed.imageUrl || null,
    },
  });

  revalidatePath("/catalog/materials");
  return material;
}

export async function updateMaterial(id: string, data: unknown) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const parsed = updateMaterialSchema.parse(data);
  const material = await prisma.material.update({
    where: { id },
    data: {
      ...parsed,
      imageUrl: parsed.imageUrl || null,
    },
  });

  revalidatePath("/catalog/materials");
  revalidatePath(`/catalog/materials/${id}`);
  return material;
}

export async function deleteMaterial(id: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.material.delete({ where: { id } });
  revalidatePath("/catalog/materials");
}

export async function getMaterialCategories() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const categories = await prisma.material.findMany({
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  });
  return categories.map((c) => c.category);
}
