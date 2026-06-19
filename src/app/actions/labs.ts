"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// ─── Public read: no auth required ─────────────────────

/**
 * Return all labs with aggregate counts of assets, inventoryItems, and members (LabRole rows).
 * Used by the public /labs list and the admin /admin/labs table.
 */
export async function getLabs() {
  const labs = await prisma.lab.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: {
          assets: true,
          inventoryItems: true,
          roles: true,
        },
      },
      divisions: {
        select: { id: true, slug: true, name: true, description: true },
        orderBy: { name: "asc" },
      },
    },
  });
  return labs;
}

/**
 * Return a single lab by slug, including its divisions and counts.
 * Returns null when not found.
 */
export async function getLabBySlug(slug: string) {
  const lab = await prisma.lab.findUnique({
    where: { slug },
    include: {
      _count: {
        select: {
          assets: true,
          inventoryItems: true,
          roles: true,
        },
      },
      divisions: {
        select: { id: true, slug: true, name: true, description: true },
        orderBy: { name: "asc" },
      },
    },
  });
  return lab;
}

/**
 * Return live stats for a single lab identified by slug.
 * - assets: count of Asset rows owned by the lab.
 * - members: count of LabRole rows for the lab.
 * - procurementOpen: ProcurementRequest rows whose status is NEW or ORDERED
 *   (i.e. not yet received, rejected, approved-and-closed, or cancelled).
 * - projectsOpen: count of Project rows linked to the lab via Project.labId.
 */
export async function getLabStats(slug: string): Promise<{
  assets: number;
  members: number;
  procurementOpen: number;
  projectsOpen: number;
}> {
  const lab = await prisma.lab.findUnique({
    where: { slug },
    include: {
      _count: {
        select: {
          assets: true,
          roles: true,
          projects: true,
        },
      },
    },
  });

  if (!lab) {
    throw new Error(`Lab with slug "${slug}" not found`);
  }

  const procurementOpen = await prisma.procurementRequest.count({
    where: {
      labId: lab.id,
      status: { in: ["NEW", "ORDERED"] },
    },
  });

  return {
    assets: lab._count.assets,
    members: lab._count.roles,
    procurementOpen,
    projectsOpen: lab._count.projects,
  };
}

/**
 * Return all LabRole rows for a lab, joined with the user.
 * Requires an authenticated session (any role).
 */
export async function getLabMembers(labId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const members = await prisma.labRole.findMany({
    where: { labId },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
      division: { select: { id: true, slug: true, name: true } },
    },
    orderBy: { createdAt: "asc" },
  });
  return members;
}
