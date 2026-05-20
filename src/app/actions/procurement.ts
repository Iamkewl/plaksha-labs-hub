"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";
import {
  createProcurementRequestSchema,
  rejectProcurementRequestSchema,
} from "@/lib/validations";
import type { ProcurementStatus } from "@prisma/client";

export interface GetProcurementParams {
  status?: ProcurementStatus;
  labId?: string;
}

/**
 * Return procurement requests. Admin only.
 * Optionally filter by status and/or lab.
 */
export async function getProcurementRequests(params: GetProcurementParams = {}) {
  await requireRole("ADMIN");

  const where = {
    ...(params.labId ? { labId: params.labId } : {}),
    ...(params.status ? { status: params.status } : {}),
  };

  const requests = await prisma.procurementRequest.findMany({
    where,
    include: {
      lab: { select: { id: true, slug: true, name: true } },
      requestedBy: { select: { id: true, name: true, email: true } },
    },
    orderBy: [
      { expectedArrival: "asc" },
      { createdAt: "desc" },
    ],
  });

  return requests;
}

// --- Write actions ---

/**
 * Create a new procurement request. Any authenticated user may submit.
 */
export async function createProcurementRequest(input: unknown) {
  const session = await requireAuth();
  const data = createProcurementRequestSchema.parse(input);

  const request = await prisma.procurementRequest.create({
    data: {
      labId: data.labId,
      requestedById: session.user.id,
      itemName: data.title,
      quantity: data.quantity,
      vendor: data.vendor ?? null,
      expectedArrival: data.expectedArrival ?? null,
      notes: data.notes ?? null,
      status: "NEW",
    },
  });

  revalidatePath("/admin/requests");
  revalidatePath("/labs/robotics/dashboard");
  return request;
}

/**
 * Approve a procurement request. ADMIN or MENTOR only.
 */
export async function approveProcurementRequest(id: string) {
  await requireRole("ADMIN", "MENTOR");

  const request = await prisma.procurementRequest.findUnique({
    where: { id },
    select: { id: true, status: true },
  });

  if (!request) throw new Error("Procurement request not found");

  await prisma.procurementRequest.update({
    where: { id },
    data: { status: "APPROVED" },
  });

  revalidatePath("/admin/requests");
}

/**
 * Reject a procurement request. ADMIN or MENTOR only.
 * Optional reason is prepended into the notes field.
 */
export async function rejectProcurementRequest(input: unknown) {
  await requireRole("ADMIN", "MENTOR");
  const data = rejectProcurementRequestSchema.parse(input);

  const request = await prisma.procurementRequest.findUnique({
    where: { id: data.id },
    select: { id: true, notes: true },
  });

  if (!request) throw new Error("Procurement request not found");

  const updatedNotes = data.reason
    ? `[Rejected] ${data.reason}${request.notes ? `\n\n${request.notes}` : ""}`
    : request.notes ?? null;

  await prisma.procurementRequest.update({
    where: { id: data.id },
    data: { status: "REJECTED", notes: updatedNotes },
  });

  revalidatePath("/admin/requests");
}

/**
 * Mark a procurement request as ORDERED. ADMIN only.
 */
export async function markOrdered(id: string) {
  await requireRole("ADMIN");

  await prisma.procurementRequest.update({
    where: { id },
    data: { status: "ORDERED" },
  });

  revalidatePath("/admin/requests");
}

/**
 * Mark a procurement request as RECEIVED. ADMIN only.
 */
export async function markReceived(id: string) {
  await requireRole("ADMIN");

  await prisma.procurementRequest.update({
    where: { id },
    data: { status: "RECEIVED" },
  });

  revalidatePath("/admin/requests");
}
