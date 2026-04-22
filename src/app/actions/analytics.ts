"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// ─── Dashboard Stats (role-specific) ────────────────────

export async function getDashboardStats() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const role = session.user.role;
  const userId = session.user.id;
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

  if (role === "STUDENT") {
    const [upcomingBookings, activeProjects, pendingRequests, recentNotifications] =
      await Promise.all([
        prisma.booking.findMany({
          where: {
            userId,
            startTime: { gte: now },
            status: { in: ["PENDING", "CONFIRMED"] },
          },
          include: {
            machine: { select: { name: true, location: true } },
            mentor: { select: { name: true } },
          },
          orderBy: { startTime: "asc" },
          take: 5,
        }),
        prisma.project.findMany({
          where: { members: { some: { userId } } },
          include: {
            members: { select: { role: true, userId: true } },
            _count: { select: { boms: true } },
          },
          orderBy: { updatedAt: "desc" },
          take: 5,
        }),
        prisma.materialRequest.count({
          where: {
            requestedBy: userId,
            status: { in: ["PENDING_BOM_APPROVAL", "PENDING_ADMIN_APPROVAL", "PENDING"] },
          },
        }),
        prisma.notification.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
      ]);

    return {
      role: "STUDENT" as const,
      upcomingBookings,
      activeProjects,
      pendingRequests,
      recentNotifications,
    };
  }

  if (role === "MENTOR") {
    const [todaySessions, upcomingSessions, supervisedProjects, availabilitySlots] =
      await Promise.all([
        prisma.booking.findMany({
          where: {
            mentorId: userId,
            startTime: { gte: todayStart, lt: todayEnd },
            status: { in: ["PENDING", "CONFIRMED", "IN_PROGRESS"] },
          },
          include: {
            user: { select: { name: true, email: true } },
            machine: { select: { name: true } },
          },
          orderBy: { startTime: "asc" },
        }),
        prisma.booking.findMany({
          where: {
            mentorId: userId,
            startTime: { gte: todayEnd },
            status: { in: ["PENDING", "CONFIRMED"] },
          },
          include: {
            user: { select: { name: true, email: true } },
            machine: { select: { name: true } },
          },
          orderBy: { startTime: "asc" },
          take: 5,
        }),
        prisma.project.findMany({
          where: { mentorId: userId },
          include: {
            members: {
              include: { user: { select: { name: true } } },
            },
            _count: { select: { boms: true } },
          },
          orderBy: { updatedAt: "desc" },
        }),
        prisma.mentorAvailability.findMany({
          where: { userId, isActive: true },
          orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
        }),
      ]);

    return {
      role: "MENTOR" as const,
      todaySessions,
      upcomingSessions,
      supervisedProjects,
      availabilitySlots,
    };
  }

  // ADMIN
  const [
    totalUsers,
    totalMachines,
    bookingsToday,
    pendingMaterialRequests,
    pendingBoms,
    lowStockCount,
    recentActivity,
    lowStockItems,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.machine.count(),
    prisma.booking.count({
      where: {
        startTime: { gte: todayStart, lt: todayEnd },
        status: { in: ["PENDING", "CONFIRMED", "IN_PROGRESS"] },
      },
    }),
    prisma.materialRequest.count({ where: { status: { in: ["PENDING_ADMIN_APPROVAL", "PENDING"] } } }),
    prisma.bom.count({ where: { status: "SUBMITTED" } }),
    prisma.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*) AS count FROM "materials"
      WHERE "currentStock" <= "lowStockThreshold"
    `.then((r) => Number(r[0].count)),
    // Recent activity: last 10 bookings created
    prisma.booking.findMany({
      include: {
        user: { select: { name: true } },
        machine: { select: { name: true } },
        mentor: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    // Low stock items
    prisma.$queryRaw<
      Array<{
        id: string;
        name: string;
        category: string;
        unit: string;
        currentStock: number;
        lowStockThreshold: number;
      }>
    >`
      SELECT id, name, category, unit, "currentStock", "lowStockThreshold"
      FROM "materials"
      WHERE "currentStock" <= "lowStockThreshold"
      ORDER BY ("currentStock"::float / NULLIF("lowStockThreshold", 0)) ASC
      LIMIT 10
    `,
  ]);

  return {
    role: "ADMIN" as const,
    totalUsers,
    totalMachines,
    bookingsToday,
    pendingMaterialRequests,
    pendingBoms,
    lowStockCount,
    recentActivity,
    lowStockItems,
  };
}

// ─── Analytics: Machine Utilization ─────────────────────

export async function getMachineUtilization() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  const [bookingsByMachine, statusBreakdown] = await Promise.all([
    prisma.booking.groupBy({
      by: ["machineId"],
      where: { machineId: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 15,
    }),
    prisma.machine.groupBy({
      by: ["status"],
      _count: { id: true },
    }),
  ]);

  // Hydrate machine names
  const machineIds = bookingsByMachine
    .map((b) => b.machineId)
    .filter((id): id is string => id !== null);
  const machines = await prisma.machine.findMany({
    where: { id: { in: machineIds } },
    select: { id: true, name: true, category: true, location: true },
  });
  const machineMap = new Map(machines.map((m) => [m.id, m]));

  return {
    bookingsByMachine: bookingsByMachine.map((b) => ({
      machine: machineMap.get(b.machineId!),
      bookingCount: b._count.id,
    })),
    statusBreakdown: statusBreakdown.map((s) => ({
      status: s.status,
      count: s._count.id,
    })),
  };
}

// ─── Analytics: Material Consumption ────────────────────

export async function getMaterialConsumption() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  const [topIssued, lowStockItems] = await Promise.all([
    // Top materials by issued quantity
    prisma.materialRequest.groupBy({
      by: ["materialId"],
      where: { status: "ISSUED", issuedQty: { not: null } },
      _sum: { issuedQty: true },
      orderBy: { _sum: { issuedQty: "desc" } },
      take: 10,
    }),
    prisma.$queryRaw<
      Array<{
        id: string;
        name: string;
        category: string;
        unit: string;
        currentStock: number;
        lowStockThreshold: number;
      }>
    >`
      SELECT id, name, category, unit, "currentStock", "lowStockThreshold"
      FROM "materials"
      WHERE "currentStock" <= "lowStockThreshold"
      ORDER BY name ASC
    `,
  ]);

  // Hydrate material names
  const materialIds = topIssued.map((t) => t.materialId);
  const materials = await prisma.material.findMany({
    where: { id: { in: materialIds } },
    select: { id: true, name: true, unit: true, currentStock: true, category: true },
  });
  const materialMap = new Map(materials.map((m) => [m.id, m]));

  return {
    topIssued: topIssued.map((t) => ({
      material: materialMap.get(t.materialId),
      totalIssued: t._sum.issuedQty ?? 0,
    })),
    lowStockItems,
  };
}

// ─── Analytics: Booking Trends ──────────────────────────

export async function getBookingTrends() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const [statusCounts, recentBookings] = await Promise.all([
    prisma.booking.groupBy({
      by: ["status"],
      _count: { id: true },
    }),
    prisma.booking.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true, status: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  // Group by day
  const dailyCounts: Record<string, number> = {};
  for (let i = 0; i < 7; i++) {
    const d = new Date(sevenDaysAgo);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().split("T")[0];
    dailyCounts[key] = 0;
  }
  // also add today
  const todayKey = new Date().toISOString().split("T")[0];
  if (!dailyCounts[todayKey]) dailyCounts[todayKey] = 0;

  for (const b of recentBookings) {
    const key = new Date(b.createdAt).toISOString().split("T")[0];
    if (dailyCounts[key] !== undefined) {
      dailyCounts[key]++;
    }
  }

  return {
    statusCounts: statusCounts.map((s) => ({
      status: s.status,
      count: s._count.id,
    })),
    dailyCounts: Object.entries(dailyCounts).map(([date, count]) => ({
      date,
      count,
    })),
  };
}

// ─── Analytics: User Activity ───────────────────────────

export async function getUserActivity() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  const [roleBreakdown, topBookers] = await Promise.all([
    prisma.user.groupBy({
      by: ["role"],
      _count: { id: true },
    }),
    prisma.booking.groupBy({
      by: ["userId"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    }),
  ]);

  // Hydrate user names for top bookers
  const userIds = topBookers.map((t) => t.userId);
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, email: true, role: true },
  });
  const userMap = new Map(users.map((u) => [u.id, u]));

  return {
    roleBreakdown: roleBreakdown.map((r) => ({
      role: r.role,
      count: r._count.id,
    })),
    topBookers: topBookers.map((t) => ({
      user: userMap.get(t.userId),
      bookingCount: t._count.id,
    })),
    totalUsers: roleBreakdown.reduce((sum, r) => sum + r._count.id, 0),
  };
}
