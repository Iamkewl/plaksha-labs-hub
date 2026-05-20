"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/auth-guard";
import { createAssetSchema, updateAssetSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import type { AssetKind, AssetStatus } from "@prisma/client";

const PAGE_SIZE = 50;

export interface GetAssetsParams {
  labId?: string;
  divisionId?: string;
  /** Filter by lab slug — looks up labId automatically */
  labSlug?: string;
  /** Filter by division slug within the lab — requires labSlug */
  divisionSlug?: string;
  status?: AssetStatus;
  kind?: AssetKind;
  page?: number;
}

/**
 * Paginated asset list. Any authenticated user may call this.
 * Supports filtering by labId/divisionId (Prisma IDs) or labSlug/divisionSlug.
 */
export async function getAssets(params: GetAssetsParams = {}) {
  await requireAuth();

  const page = Math.max(1, params.page ?? 1);
  const skip = (page - 1) * PAGE_SIZE;

  // Resolve slug-based filters to IDs when provided
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
    ...(params.status ? { status: params.status } : {}),
    ...(params.kind ? { kind: params.kind } : {}),
  };

  const [assets, total] = await Promise.all([
    prisma.asset.findMany({
      where,
      include: {
        lab: { select: { id: true, slug: true, name: true } },
        division: { select: { id: true, slug: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip,
    }),
    prisma.asset.count({ where }),
  ]);

  return { assets, total, page, pageSize: PAGE_SIZE };
}

/**
 * Return a single asset by ID with its active checkouts.
 */
export async function getAssetById(id: string) {
  await requireAuth();

  const asset = await prisma.asset.findUnique({
    where: { id },
    include: {
      lab: { select: { id: true, slug: true, name: true } },
      division: { select: { id: true, slug: true, name: true } },
      checkouts: {
        where: { status: "OUT" },
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { checkedOutAt: "desc" },
        take: 5,
      },
    },
  });

  if (!asset) throw new Error("Asset not found");
  return asset;
}

/**
 * Create a new asset. Admin only.
 */
export async function createAsset(input: unknown) {
  await requireRole("ADMIN");

  const data = createAssetSchema.parse(input);

  const asset = await prisma.asset.create({
    data: {
      labId: data.labId,
      divisionId: data.divisionId ?? null,
      name: data.name,
      kind: data.kind,
      status: data.status,
      serialNo: data.serialNo ?? null,
      location: data.location ?? null,
      machineId: data.machineId ?? null,
    },
  });

  revalidatePath("/admin/assets");
  return asset;
}

/**
 * Update an existing asset. Admin only.
 */
export async function updateAsset(input: unknown) {
  await requireRole("ADMIN");

  const { id, ...rest } = updateAssetSchema.parse(input);

  const asset = await prisma.asset.update({
    where: { id },
    data: {
      ...(rest.labId !== undefined ? { labId: rest.labId } : {}),
      ...(rest.divisionId !== undefined ? { divisionId: rest.divisionId } : {}),
      ...(rest.name !== undefined ? { name: rest.name } : {}),
      ...(rest.kind !== undefined ? { kind: rest.kind } : {}),
      ...(rest.status !== undefined ? { status: rest.status } : {}),
      ...(rest.serialNo !== undefined ? { serialNo: rest.serialNo } : {}),
      ...(rest.location !== undefined ? { location: rest.location } : {}),
      ...(rest.machineId !== undefined ? { machineId: rest.machineId } : {}),
    },
  });

  revalidatePath("/admin/assets");
  return asset;
}

/**
 * Set an asset's status to RETIRED. Admin only.
 */
export async function retireAsset(id: string) {
  await requireRole("ADMIN");

  const asset = await prisma.asset.update({
    where: { id },
    data: { status: "RETIRED" },
  });

  revalidatePath("/admin/assets");
  return asset;
}
