"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createProjectSchema, updateProjectVisibilitySchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { createNotification } from "@/lib/notifications";

export async function getProjects() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  if (session.user.role === "ADMIN") {
    return prisma.project.findMany({
      include: {
        members: { include: { user: { select: { id: true, name: true, email: true } } } },
        mentor: { select: { id: true, name: true, email: true } },
        _count: { select: { boms: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  return prisma.project.findMany({
    where: {
      OR: [
        { members: { some: { userId: session.user.id } } },
        { mentorId: session.user.id },
      ],
    },
    include: {
      members: { include: { user: { select: { id: true, name: true, email: true } } } },
      mentor: { select: { id: true, name: true, email: true } },
      _count: { select: { boms: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPublicProjects(limit = 6) {
  return prisma.project.findMany({
    where: { isPublic: true },
    include: {
      mentor: { select: { id: true, name: true, email: true } },
      _count: { select: { boms: true, members: true } },
    },
    orderBy: { createdAt: "desc" },
    take: Math.max(1, Math.min(limit, 24)),
  });
}

export async function getProjectById(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      members: {
        include: {
          user: { select: { id: true, name: true, email: true, role: true } },
        },
        orderBy: { role: "asc" },
      },
      mentor: { select: { id: true, name: true, email: true } },
      boms: {
        orderBy: { version: "desc" },
        select: {
          id: true,
          version: true,
          status: true,
          totalCost: true,
          createdAt: true,
          submittedAt: true,
          notes: true,
        },
      },
    },
  });

  if (!project) throw new Error("Project not found");

  const isMember = project.members.some((m) => m.userId === session.user.id);
  const isMentor = project.mentorId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";

  if (!isMember && !isMentor && !isAdmin) throw new Error("Unauthorized");

  return project;
}

export async function createProject(data: unknown) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const parsed = createProjectSchema.parse(data);

  const project = await prisma.project.create({
    data: {
      name: parsed.name,
      description: parsed.description,
      isPublic: parsed.isPublic,
      mentorId: parsed.mentorId || null,
      members: {
        create: { userId: session.user.id, role: "LEAD" },
      },
    },
  });

  // Notify assigned mentor
  if (parsed.mentorId) {
    await createNotification({
      userId: parsed.mentorId,
      type: "TRAINING_COMPLETED",  // Best available type for project events
      title: "Assigned to project",
      message: `You have been assigned as mentor for project "${parsed.name}"`,
      link: `/projects/${project.id}`,
    });
  }

  revalidatePath("/projects");
  revalidatePath("/");
  revalidatePath("/makerspace-projects");
  return project;
}

export async function updateProjectVisibility(data: unknown) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const parsed = updateProjectVisibilitySchema.parse(data);

  const project = await prisma.project.findUnique({
    where: { id: parsed.projectId },
    include: { members: true },
  });

  if (!project) throw new Error("Project not found");

  const requesterMember = project.members.find((m) => m.userId === session.user.id);
  const isLead = requesterMember?.role === "LEAD";
  const isAdmin = session.user.role === "ADMIN";

  if (!isLead && !isAdmin) {
    throw new Error("Only the project lead or admin can change visibility");
  }

  await prisma.project.update({
    where: { id: parsed.projectId },
    data: { isPublic: parsed.isPublic },
  });

  revalidatePath("/projects");
  revalidatePath(`/projects/${parsed.projectId}`);
  revalidatePath("/");
  revalidatePath("/makerspace-projects");
}

export async function addProjectMember(projectId: string, userId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      members: true,
      mentor: { select: { id: true } },
    },
  });

  if (!project) throw new Error("Project not found");

  const requesterMember = project.members.find((m) => m.userId === session.user.id);
  const isLead = requesterMember?.role === "LEAD";
  const isAdmin = session.user.role === "ADMIN";
  const isMentor = project.mentorId === session.user.id;

  if (!isLead && !isAdmin && !isMentor) {
    throw new Error("Only the project lead or admin can add members");
  }

  // Check user exists
  const targetUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true },
  });
  if (!targetUser) throw new Error("User not found");

  // Already a member?
  if (project.members.some((m) => m.userId === userId)) {
    throw new Error("User is already a project member");
  }

  await prisma.projectMember.create({
    data: { projectId, userId, role: "MEMBER" },
  });

  await createNotification({
    userId,
    type: "TRAINING_COMPLETED",  // Best available type for project events
    title: "Added to project",
    message: `You have been added to project "${project.name}"`,
    link: `/projects/${projectId}`,
  });

  revalidatePath(`/projects/${projectId}`);
}

export async function removeProjectMember(projectId: string, userId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { members: true },
  });

  if (!project) throw new Error("Project not found");

  const isSelf = userId === session.user.id;
  const requesterMember = project.members.find((m) => m.userId === session.user.id);
  const isLead = requesterMember?.role === "LEAD";
  const isAdmin = session.user.role === "ADMIN";

  if (!isSelf && !isLead && !isAdmin) throw new Error("Unauthorized");

  const targetMember = project.members.find((m) => m.userId === userId);
  if (!targetMember) throw new Error("Member not found in project");

  if (targetMember.role === "LEAD") {
    const leadCount = project.members.filter((m) => m.role === "LEAD").length;
    if (leadCount <= 1) throw new Error("Cannot remove the only project lead");
  }

  await prisma.projectMember.delete({
    where: { projectId_userId: { projectId, userId } },
  });

  revalidatePath(`/projects/${projectId}`);
}

export async function getMentors() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  return prisma.user.findMany({
    where: { role: { in: ["MENTOR", "ADMIN"] } },
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });
}

export async function getStudents() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  return prisma.user.findMany({
    where: { role: "STUDENT" },
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });
}
