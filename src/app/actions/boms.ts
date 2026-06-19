"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import {
  createBomSchema,
  createBomItemSchema,
  createMaterialAllocationRequestSchema,
  reviewBomMaterialRequestSchema,
  updateBomStatusSchema,
  approveMaterialRequestSchema,
  issueMaterialRequestSchema,
} from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { createNotification, createNotificationsForAdmins } from "@/lib/notifications";
import { sendTransactionalEmail } from "@/lib/email";
import type { Prisma } from "@prisma/client";

// ─── BOM Queries ────────────────────────────────────────

export async function getBomById(bomId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const bom = await prisma.bom.findUnique({
    where: { id: bomId },
    include: {
      project: {
        include: {
          members: true,
          mentor: { select: { id: true, name: true } },
        },
      },
      approver: { select: { id: true, name: true } },
      items: {
        include: {
          material: {
            select: { id: true, name: true, unit: true, costPerUnit: true, currentStock: true },
          },
        },
        orderBy: { id: "asc" },
      },
      materialRequests: {
        include: {
          material: { select: { name: true, unit: true } },
          requester: { select: { name: true } },
          bomApprover: { select: { name: true } },
          approver: { select: { name: true } },
          issuer: { select: { name: true } },
        },
        orderBy: { requestedAt: "asc" },
      },
    },
  });

  if (!bom) throw new Error("BOM not found");

  const isMember = bom.project.members.some((m) => m.userId === session.user.id);
  const isMentor = bom.project.mentorId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";

  if (!isMember && !isMentor && !isAdmin) throw new Error("Unauthorized");

  return bom;
}

// ─── BOM Mutations ──────────────────────────────────────

export async function createBom(
  projectId: string,
  rawData: unknown,
  items: Array<{ materialId: string; quantity: number; notes?: string }>
) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const parsed = createBomSchema.parse(rawData);

  // Verify project membership (lead or admin)
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { members: true },
  });
  if (!project) throw new Error("Project not found");

  const member = project.members.find((m) => m.userId === session.user.id);
  if (!member && session.user.role !== "ADMIN") throw new Error("Unauthorized");

  if (items.length === 0) throw new Error("BOM must have at least one item");

  // Validate all items
  const validatedItems = items.map((item) => createBomItemSchema.parse(item));

  // Compute totalCost from material cost snapshots
  const materialIds = Array.from(new Set(validatedItems.map((i) => i.materialId)));
  const materials = await prisma.material.findMany({
    where: { id: { in: materialIds } },
    select: { id: true, costPerUnit: true },
  });
  const costMap = new Map(materials.map((m) => [m.id, m.costPerUnit]));

  let totalCost = 0;
  const bomItemsData = validatedItems.map((item) => {
    const cost = costMap.get(item.materialId) ?? 0;
    totalCost += cost * item.quantity;
    return {
      materialId: item.materialId,
      quantity: item.quantity,
      costSnapshot: cost,
      notes: item.notes ?? null,
    };
  });

  // Get next version number for this project
  const lastBom = await prisma.bom.findFirst({
    where: { projectId },
    orderBy: { version: "desc" },
    select: { version: true },
  });
  const nextVersion = (lastBom?.version ?? 0) + 1;

  const bom = await prisma.bom.create({
    data: {
      projectId,
      version: nextVersion,
      totalCost,
      notes: parsed.notes ?? null,
      items: { create: bomItemsData },
    },
  });

  revalidatePath(`/projects/${projectId}`);
  return bom;
}

export async function addBomItem(bomId: string, rawData: unknown) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const parsed = createBomItemSchema.parse(rawData);

  const bom = await prisma.bom.findUnique({
    where: { id: bomId },
    include: { project: { include: { members: true } } },
  });
  if (!bom) throw new Error("BOM not found");
  if (bom.status !== "DRAFT") throw new Error("Can only edit a DRAFT BOM");

  const isMember = bom.project.members.some((m) => m.userId === session.user.id);
  if (!isMember && session.user.role !== "ADMIN") throw new Error("Unauthorized");

  const material = await prisma.material.findUnique({
    where: { id: parsed.materialId },
    select: { costPerUnit: true },
  });
  if (!material) throw new Error("Material not found");

  const newItem = await prisma.bomItem.create({
    data: {
      bomId,
      materialId: parsed.materialId,
      quantity: parsed.quantity,
      costSnapshot: material.costPerUnit,
      notes: parsed.notes ?? null,
    },
  });

  // Recalculate totalCost
  const allItems = await prisma.bomItem.findMany({
    where: { bomId },
    select: { costSnapshot: true, quantity: true },
  });
  const totalCost = allItems.reduce((s, i) => s + i.costSnapshot * i.quantity, 0);
  await prisma.bom.update({ where: { id: bomId }, data: { totalCost } });

  revalidatePath(`/projects/${bom.projectId}/bom/${bomId}`);
  return newItem;
}

export async function removeBomItem(itemId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const item = await prisma.bomItem.findUnique({
    where: { id: itemId },
    include: { bom: { include: { project: { include: { members: true } } } } },
  });
  if (!item) throw new Error("BOM item not found");
  if (item.bom.status !== "DRAFT") throw new Error("Can only edit a DRAFT BOM");

  const isMember = item.bom.project.members.some((m) => m.userId === session.user.id);
  if (!isMember && session.user.role !== "ADMIN") throw new Error("Unauthorized");

  await prisma.bomItem.delete({ where: { id: itemId } });

  const allItems = await prisma.bomItem.findMany({
    where: { bomId: item.bomId },
    select: { costSnapshot: true, quantity: true },
  });
  const totalCost = allItems.reduce((s, i) => s + i.costSnapshot * i.quantity, 0);
  await prisma.bom.update({ where: { id: item.bomId }, data: { totalCost } });

  revalidatePath(`/projects/${item.bom.projectId}/bom/${item.bomId}`);
}

export async function submitBom(bomId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const bom = await prisma.bom.findUnique({
    where: { id: bomId },
    include: {
      project: { include: { members: true } },
      items: true,
    },
  });
  if (!bom) throw new Error("BOM not found");
  if (bom.status !== "DRAFT") throw new Error("Only DRAFT BOMs can be submitted");
  if (bom.items.length === 0) throw new Error("Cannot submit an empty BOM");

  const member = bom.project.members.find((m) => m.userId === session.user.id);
  if (!member && session.user.role !== "ADMIN") throw new Error("Unauthorized");

  await prisma.bom.update({
    where: { id: bomId },
    data: { status: "SUBMITTED", submittedAt: new Date() },
  });

  await createNotificationsForAdmins({
    type: "BOM_SUBMITTED",
    title: "BOM submitted for approval",
    message: `BOM v${bom.version} has been submitted and is awaiting approval`,
    link: `/projects/${bom.projectId}/bom/${bomId}`,
  });

  revalidatePath(`/projects/${bom.projectId}/bom/${bomId}`);
  revalidatePath(`/projects/${bom.projectId}`);
}

export async function approveBom(bomId: string, notes?: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  const bom = await prisma.bom.findUnique({
    where: { id: bomId },
    include: {
      project: {
        include: {
          members: {
            where: { role: "LEAD" },
            include: { user: { select: { email: true, name: true } } },
          },
        },
      },
      items: true,
    },
  });
  if (!bom) throw new Error("BOM not found");
  if (bom.status !== "SUBMITTED") throw new Error("Only SUBMITTED BOMs can be approved");

  await prisma.bom.update({
    where: { id: bomId },
    data: {
      status: "APPROVED",
      approvedAt: new Date(),
      approvedBy: session.user.id,
      notes: notes ?? bom.notes,
    },
  });

  // Notify project leads
  for (const lead of bom.project.members) {
    await createNotification({
      userId: lead.userId,
      type: "BOM_APPROVED",
      title: "BOM approved",
      message: `BOM v${bom.version} has been approved. You can now create material allocation requests.`,
      link: `/projects/${bom.projectId}/bom/${bomId}`,
    });

    if (lead.user.email) {
      await sendTransactionalEmail({
        to: lead.user.email,
        subject: `BOM approved: ${bom.project.name} v${bom.version}`,
        text: [
          `Hi ${lead.user.name ?? "there"},`,
          "",
          `BOM v${bom.version} for project \"${bom.project.name}\" has been approved.`,
          "You can now submit material allocation requests under this BOM.",
          "",
          "Please check Makerspace Hub for details.",
        ].join("\n"),
      });
    }
  }

  revalidatePath(`/projects/${bom.projectId}/bom/${bomId}`);
  revalidatePath(`/projects/${bom.projectId}`);
  revalidatePath("/admin/material-requests");
}

export async function rejectBom(bomId: string, notes?: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  const bom = await prisma.bom.findUnique({
    where: { id: bomId },
    include: { project: { include: { members: { where: { role: "LEAD" } } } } },
  });
  if (!bom) throw new Error("BOM not found");
  if (bom.status !== "SUBMITTED") throw new Error("Only SUBMITTED BOMs can be rejected");

  await prisma.bom.update({
    where: { id: bomId },
    data: {
      status: "REJECTED",
      approvedBy: session.user.id,
      notes: notes ?? bom.notes,
    },
  });

  for (const lead of bom.project.members) {
    await createNotification({
      userId: lead.userId,
      type: "BOM_REJECTED",
      title: "BOM rejected",
      message: `BOM v${bom.version} was rejected.${notes ? ` Reason: ${notes}` : ""}`,
      link: `/projects/${bom.projectId}/bom/${bomId}`,
    });
  }

  revalidatePath(`/projects/${bom.projectId}/bom/${bomId}`);
  revalidatePath(`/projects/${bom.projectId}`);
}

// ─── Material Requests ──────────────────────────────────

const materialRequestListInclude = {
  material: { select: { id: true, name: true, unit: true, currentStock: true } },
  requester: { select: { id: true, name: true } },
  bomApprover: { select: { id: true, name: true } },
  approver: { select: { id: true, name: true } },
  issuer: { select: { id: true, name: true } },
  bom: {
    select: {
      id: true,
      version: true,
      project: { select: { id: true, name: true } },
    },
  },
} as const satisfies Prisma.MaterialRequestInclude;

export type MaterialRequestListItem = Prisma.MaterialRequestGetPayload<{
  include: typeof materialRequestListInclude;
}>;

export async function getMaterialRequests(params?: {
  status?: string;
  bomId?: string;
  queue?: "admin" | "all";
}): Promise<MaterialRequestListItem[]> {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const where: Record<string, unknown> = {};

  if (session.user.role === "STUDENT" || session.user.role === "MENTOR") {
    where.requestedBy = session.user.id;
  } else if (session.user.role === "ADMIN" && params?.queue === "admin") {
    where.status = {
      in: ["PENDING_ADMIN_APPROVAL", "APPROVED", "PARTIALLY_ISSUED", "ISSUED", "REJECTED"],
    };
  }

  if (params?.status) where.status = params.status;
  if (params?.bomId) where.bomId = params.bomId;

  return prisma.materialRequest.findMany({
    where,
    include: materialRequestListInclude,
    orderBy: { requestedAt: "desc" },
    take: 100,
  });
}

export async function createMaterialAllocationRequest(rawData: unknown) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const parsed = createMaterialAllocationRequestSchema.parse(rawData);

  const bom = await prisma.bom.findUnique({
    where: { id: parsed.bomId },
    include: {
      project: {
        include: {
          members: true,
          mentor: { select: { id: true, name: true } },
        },
      },
      items: {
        where: { materialId: parsed.materialId },
        select: {
          quantity: true,
          material: { select: { name: true, unit: true } },
        },
      },
    },
  });

  if (!bom) throw new Error("BOM not found");
  if (bom.status !== "APPROVED") {
    throw new Error("Material allocation is only allowed for APPROVED BOMs");
  }

  const isMember = bom.project.members.some((m) => m.userId === session.user.id);
  const isProjectMentor = bom.project.mentorId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";

  if (!isMember && !isProjectMentor && !isAdmin) {
    throw new Error("Unauthorized");
  }

  const bomItem = bom.items[0];
  if (!bomItem) {
    throw new Error("Selected material is not part of this BOM");
  }

  const existingAllocation = await prisma.materialRequest.aggregate({
    where: {
      bomId: parsed.bomId,
      materialId: parsed.materialId,
      status: { notIn: ["BOM_REJECTED", "REJECTED"] },
    },
    _sum: { quantity: true },
  });

  const alreadyAllocated = Number(existingAllocation._sum.quantity ?? 0);
  const remaining = Number(bomItem.quantity) - alreadyAllocated;
  if (parsed.quantity > remaining + 1e-9) {
    throw new Error(
      `Only ${Math.max(0, remaining).toFixed(3)} ${bomItem.material.unit} can be allocated for this BOM item.`
    );
  }

  const request = await prisma.materialRequest.create({
    data: {
      bomId: parsed.bomId,
      materialId: parsed.materialId,
      requestedBy: session.user.id,
      quantity: parsed.quantity,
      notes: parsed.notes ?? null,
      status: "PENDING_BOM_APPROVAL",
    },
  });

  const requestLink = `/projects/${bom.projectId}/bom/${bom.id}`;

  if (bom.project.mentorId) {
    await createNotification({
      userId: bom.project.mentorId,
      type: "MATERIAL_REQUEST_SUBMITTED",
      title: "Material allocation request pending review",
      message: `${session.user.name ?? "A project member"} requested ${parsed.quantity} ${bomItem.material.unit} of ${bomItem.material.name}.`,
      link: requestLink,
    });
  } else {
    // No mentor: notify the project LEAD member(s) instead
    const leads = bom.project.members.filter((m) => m.role === "LEAD");
    if (leads.length > 0) {
      for (const lead of leads) {
        await createNotification({
          userId: lead.userId,
          type: "MATERIAL_REQUEST_SUBMITTED",
          title: "Material allocation request pending review",
          message: `${session.user.name ?? "A project member"} requested ${parsed.quantity} ${bomItem.material.unit} of ${bomItem.material.name}.`,
          link: requestLink,
        });
      }
    } else {
      await createNotificationsForAdmins({
        type: "MATERIAL_REQUEST_SUBMITTED",
        title: "Material allocation request pending BOM review",
        message: `${session.user.name ?? "A project member"} requested ${parsed.quantity} ${bomItem.material.unit} of ${bomItem.material.name}.`,
        link: requestLink,
      });
    }
  }

  revalidatePath(requestLink);
  revalidatePath("/admin/material-requests");

  return request;
}

export async function reviewMaterialRequestByBomApprover(rawData: unknown) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const parsed = reviewBomMaterialRequestSchema.parse(rawData);

  const request = await prisma.materialRequest.findUnique({
    where: { id: parsed.requestId },
    include: {
      material: { select: { name: true, unit: true } },
      requester: { select: { id: true, name: true } },
      bom: {
        include: {
          project: {
            select: {
              id: true,
              mentorId: true,
              members: { where: { role: "LEAD" }, select: { userId: true } },
            },
          },
        },
      },
    },
  });

  if (!request || !request.bom) throw new Error("Request not found");

  const isAdmin = session.user.role === "ADMIN";
  const projectMentorId = request.bom.project.mentorId;
  const leadUserIds = request.bom.project.members.map((m) => m.userId);

  let isAuthorized = false;
  if (isAdmin) {
    isAuthorized = true;
  } else if (projectMentorId) {
    // Project has a mentor: only that mentor (with MENTOR role) may approve
    isAuthorized =
      session.user.id === projectMentorId && session.user.role === "MENTOR";
  } else {
    // No mentor: the project LEAD(s) act as first-stage approver
    isAuthorized = leadUserIds.includes(session.user.id);
  }

  if (!isAuthorized) {
    throw new Error("Only the project's mentor or lead can review this request");
  }

  if (!["PENDING_BOM_APPROVAL", "PENDING"].includes(request.status)) {
    throw new Error("This request is no longer awaiting BOM approval");
  }

  const requestLink = `/projects/${request.bom.projectId}/bom/${request.bomId}`;
  const reviewNotes = parsed.notes
    ? [request.notes, `BOM review: ${parsed.notes}`].filter(Boolean).join("\n\n")
    : request.notes;

  if (parsed.decision === "APPROVE") {
    const updated = await prisma.materialRequest.update({
      where: { id: parsed.requestId },
      data: {
        status: "PENDING_ADMIN_APPROVAL",
        bomApprovedBy: session.user.id,
        bomApprovedAt: new Date(),
        notes: reviewNotes,
      },
    });

    await createNotification({
      userId: request.requestedBy,
      type: "MATERIAL_REQUEST_APPROVED",
      title: "BOM approval completed",
      message: `Your request for ${request.quantity} ${request.material.unit} of ${request.material.name} has been approved by BOM reviewer and sent to admin team.`,
      link: requestLink,
    });

    await createNotificationsForAdmins({
      type: "MATERIAL_REQUEST_SUBMITTED",
      title: "Material request awaiting admin approval",
      message: `Request for ${request.material.name} is ready for admin approval.`,
      link: "/admin/material-requests",
    });

    revalidatePath(requestLink);
    revalidatePath("/admin/material-requests");
    return updated;
  }

  const updated = await prisma.materialRequest.update({
    where: { id: parsed.requestId },
    data: {
      status: "BOM_REJECTED",
      notes: reviewNotes,
    },
  });

  await createNotification({
    userId: request.requestedBy,
    type: "MATERIAL_REQUEST_REJECTED",
    title: "Material request rejected by BOM reviewer",
    message: `Your request for ${request.material.name} was rejected.${parsed.notes ? ` Reason: ${parsed.notes}` : ""}`,
    link: requestLink,
  });

  revalidatePath(requestLink);
  return updated;
}

export async function approveMaterialRequest(rawData: unknown) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  const parsed = approveMaterialRequestSchema.parse(rawData);

  const request = await prisma.materialRequest.findUnique({
    where: { id: parsed.requestId },
  });
  if (!request) throw new Error("Request not found");
  if (!["PENDING_ADMIN_APPROVAL", "PENDING"].includes(request.status)) {
    throw new Error("Request cannot be approved");
  }

  const updated = await prisma.materialRequest.update({
    where: { id: parsed.requestId },
    data: {
      approvedQty: parsed.approvedQty,
      approvedBy: session.user.id,
      approvedAt: new Date(),
      status: "APPROVED",
    },
  });

  await createNotification({
    userId: request.requestedBy,
    type: "MATERIAL_REQUEST_APPROVED",
    title: "Material request approved",
    message: `Your material request for ${parsed.approvedQty} unit(s) has been approved`,
    link: request.bomId ? `/admin/material-requests` : undefined,
  });

  revalidatePath("/admin/material-requests");
  return updated;
}

export async function issueMaterialRequest(rawData: unknown) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  const parsed = issueMaterialRequestSchema.parse(rawData);

  const request = await prisma.materialRequest.findUnique({
    where: { id: parsed.requestId },
    include: { material: { select: { id: true, name: true, currentStock: true, unit: true } } },
  });
  if (!request) throw new Error("Request not found");
  if (!["APPROVED", "PARTIALLY_ISSUED"].includes(request.status)) {
    throw new Error("Request cannot be issued");
  }

  if (request.material.currentStock < parsed.issuedQty) {
    throw new Error(
      `Insufficient stock: ${request.material.currentStock} ${request.material.unit} available`
    );
  }

  // Determine final status: ISSUED if fully delivered, PARTIALLY_ISSUED otherwise
  const totalIssued = (request.issuedQty ?? 0) + parsed.issuedQty;
  const targetQty = request.approvedQty ?? request.quantity;

  // Guard: never issue more than approved quantity
  if (totalIssued > targetQty + 1e-9) {
    throw new Error(
      `Cannot issue more than the approved quantity (${targetQty})`
    );
  }

  const finalStatus = totalIssued >= targetQty ? "ISSUED" : "PARTIALLY_ISSUED";

  await prisma.$transaction([
    prisma.materialRequest.update({
      where: { id: parsed.requestId },
      data: {
        issuedQty: totalIssued,
        issuedBy: session.user.id,
        issuedAt: new Date(),
        status: finalStatus,
      },
    }),
    prisma.material.update({
      where: { id: request.materialId },
      data: { currentStock: { decrement: parsed.issuedQty } },
    }),
  ]);

  await createNotification({
    userId: request.requestedBy,
    type: "MATERIAL_ISSUED",
    title: "Materials issued",
    message: `${parsed.issuedQty} ${request.material.unit} of "${request.material.name}" has been issued to you`,
  });

  revalidatePath("/admin/material-requests");
  revalidatePath("/catalog/materials");
}

export async function getPendingBomReviews() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const userId = session.user.id;

  // Fetch all PENDING_BOM_APPROVAL requests along with project membership info
  const requests = await prisma.materialRequest.findMany({
    where: {
      status: "PENDING_BOM_APPROVAL",
    },
    include: {
      material: { select: { name: true, unit: true } },
      requester: { select: { name: true } },
      bom: {
        select: {
          id: true,
          version: true,
          project: {
            select: {
              id: true,
              name: true,
              mentorId: true,
              members: { where: { role: "LEAD" }, select: { userId: true } },
            },
          },
        },
      },
    },
    orderBy: { requestedAt: "asc" },
  });

  // Filter to only the requests this user is authorized to review:
  // - project has a mentor AND it's the current user, OR
  // - project has no mentor AND the current user is a LEAD member
  return requests.filter((req) => {
    if (!req.bom) return false;
    const project = req.bom.project;
    if (project.mentorId) {
      return project.mentorId === userId;
    }
    return project.members.some((m) => m.userId === userId);
  });
}
