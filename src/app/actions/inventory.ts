"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/auth-guard";
import { upsertInventoryItemSchema, adjustStockSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export interface GetInventoryParams {
  labId?: string;
  divisionId?: string;
  /** Filter by lab slug — looks up labId automatically */
  labSlug?: string;
  /** Filter by division slug within the lab — requires labSlug */
  divisionSlug?: string;
}

/**
 * Return all inventory items for a lab (or division). Any authenticated user may call this.
 * Supports filtering by labId/divisionId (Prisma IDs) or labSlug/divisionSlug.
 */
export async function getInventory(params: GetInventoryParams = {}) {
  await requireAuth();

  let resolvedLabId = params.labId;
  let resolvedDivisionId = params.divisionId;

  if (params.labSlug && !resolvedLabId) {
    if (params.divisionSlug) {
      const lab = await prisma.lab.findUnique({
        where: { slug: params.labSlug },
        select: {
          id: true,
          divisions: { where: { slug: params.divisionSlug }, select: { id: true } },
        },
      });
      if (lab) {
        resolvedLabId = lab.id;
        if (!resolvedDivisionId && lab.divisions[0]) {
          resolvedDivisionId = lab.divisions[0].id;
        }
      }
    } else {
      const lab = await prisma.lab.findUnique({
        where: { slug: params.labSlug },
        select: { id: true },
      });
      if (lab) resolvedLabId = lab.id;
    }
  }

  const where = {
    ...(resolvedLabId ? { labId: resolvedLabId } : {}),
    ...(resolvedDivisionId ? { divisionId: resolvedDivisionId } : {}),
  };

  const items = await prisma.inventoryItem.findMany({
    where,
    include: {
      lab: { select: { id: true, slug: true, name: true } },
      division: { select: { id: true, slug: true, name: true } },
    },
    orderBy: { name: "asc" },
  });

  return items;
}

/**
 * Create or update an inventory item. Admin only.
 * Pass `id` to update an existing item; omit to create a new one.
 */
export async function upsertInventoryItem(input: unknown) {
  await requireRole("ADMIN");

  const data = upsertInventoryItemSchema.parse(input);

  if (data.id) {
    const item = await prisma.inventoryItem.update({
      where: { id: data.id },
      data: {
        labId: data.labId,
        divisionId: data.divisionId ?? null,
        name: data.name,
        sku: data.sku ?? null,
        qtyOnHand: data.qtyOnHand,
        reorderLevel: data.reorderLevel,
        location: data.location ?? null,
        materialId: data.materialId ?? null,
      },
    });
    revalidatePath("/admin/assets");
    return item;
  }

  const item = await prisma.inventoryItem.create({
    data: {
      labId: data.labId,
      divisionId: data.divisionId ?? null,
      name: data.name,
      sku: data.sku ?? null,
      qtyOnHand: data.qtyOnHand,
      reorderLevel: data.reorderLevel,
      location: data.location ?? null,
      materialId: data.materialId ?? null,
    },
  });

  revalidatePath("/admin/assets");
  return item;
}

/**
 * Adjust stock by a positive or negative integer delta. Admin only.
 * Throws if the resulting quantity would go below zero.
 */
export async function adjustStock(id: string, delta: number) {
  await requireRole("ADMIN");

  // Validate via schema (delta != 0)
  adjustStockSchema.parse({ id, delta });

  const item = await prisma.$transaction(async (tx) => {
    const current = await tx.inventoryItem.findUnique({ where: { id } });
    if (!current) throw new Error("Inventory item not found");

    const nextQty = current.qtyOnHand + delta;
    if (nextQty < 0) {
      throw new Error(
        `Insufficient stock: cannot reduce below 0 (current: ${current.qtyOnHand}, delta: ${delta})`
      );
    }

    return tx.inventoryItem.update({
      where: { id },
      data: { qtyOnHand: nextQty },
    });
  });

  revalidatePath("/admin/assets");
  return item;
}
