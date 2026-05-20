"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";
import { createCheckoutSchema } from "@/lib/validations";

/**
 * Return the caller's own checkouts, ordered by most-recently checked out first.
 */
export async function getMyCheckouts() {
  const session = await requireAuth();

  const checkouts = await prisma.checkout.findMany({
    where: { userId: session.user.id },
    include: {
      asset: {
        select: {
          id: true,
          name: true,
          kind: true,
          lab: { select: { id: true, slug: true, name: true } },
          division: { select: { id: true, slug: true, name: true } },
        },
      },
      inventoryItem: {
        select: {
          id: true,
          name: true,
          lab: { select: { id: true, slug: true, name: true } },
          division: { select: { id: true, slug: true, name: true } },
        },
      },
    },
    orderBy: { checkedOutAt: "desc" },
  });

  return checkouts;
}

/**
 * Return all open (OUT or OVERDUE) checkouts across labs. Admin only.
 * Pass labId to restrict to one lab.
 */
export async function getOpenCheckouts(params: { labId?: string } = {}) {
  await requireRole("ADMIN");

  const checkouts = await prisma.checkout.findMany({
    where: {
      status: { in: ["OUT", "OVERDUE"] },
      ...(params.labId
        ? {
            OR: [
              { asset: { labId: params.labId } },
              { inventoryItem: { labId: params.labId } },
            ],
          }
        : {}),
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
      asset: {
        select: {
          id: true,
          name: true,
          kind: true,
          lab: { select: { id: true, slug: true, name: true } },
          division: { select: { id: true, slug: true, name: true } },
        },
      },
      inventoryItem: {
        select: {
          id: true,
          name: true,
          lab: { select: { id: true, slug: true, name: true } },
          division: { select: { id: true, slug: true, name: true } },
        },
      },
    },
    orderBy: { checkedOutAt: "desc" },
  });

  return checkouts;
}

// --- Write actions ---

/**
 * Create a new checkout for an available asset.
 * Sets the asset status to CHECKED_OUT.
 */
export async function createCheckout(input: unknown) {
  const session = await requireAuth();
  const data = createCheckoutSchema.parse(input);

  const checkout = await prisma.$transaction(async (tx) => {
    const asset = await tx.asset.findUnique({
      where: { id: data.assetId },
      select: { id: true, status: true, name: true },
    });

    if (!asset) throw new Error("Asset not found");
    if (asset.status !== "AVAILABLE") {
      throw new Error(
        `Asset "${asset.name}" is not available (status: ${asset.status})`
      );
    }

    const created = await tx.checkout.create({
      data: {
        userId: session.user.id,
        assetId: data.assetId,
        dueAt: data.dueAt,
        status: "OUT",
      },
    });

    await tx.asset.update({
      where: { id: data.assetId },
      data: { status: "CHECKED_OUT" },
    });

    return created;
  });

  revalidatePath("/dashboard/checkouts");
  revalidatePath("/labs/robotics/dashboard");
  return checkout;
}

/**
 * Return a checked-out asset.
 * Caller must be the checkout owner, ADMIN, or MENTOR.
 */
export async function returnCheckout(checkoutId: string) {
  const session = await requireAuth();

  const existing = await prisma.checkout.findUnique({
    where: { id: checkoutId },
    select: { id: true, userId: true, assetId: true, status: true },
  });

  if (!existing) throw new Error("Checkout not found");

  const isOwner = existing.userId === session.user.id;
  const isPrivileged =
    session.user.role === "ADMIN" || session.user.role === "MENTOR";

  if (!isOwner && !isPrivileged) {
    throw new Error("You do not have permission to return this checkout");
  }

  if (existing.status === "RETURNED") {
    throw new Error("This checkout has already been returned");
  }

  await prisma.$transaction(async (tx) => {
    await tx.checkout.update({
      where: { id: checkoutId },
      data: {
        status: "RETURNED",
        returnedAt: new Date(),
      },
    });

    if (existing.assetId) {
      await tx.asset.update({
        where: { id: existing.assetId },
        data: { status: "AVAILABLE" },
      });
    }
  });

  revalidatePath("/dashboard/checkouts");
  revalidatePath("/labs/robotics/dashboard");
}
