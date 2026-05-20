"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/auth-guard";

/**
 * Student-facing dashboard stats: counts of bookings, checkouts, projects, and pending training needs.
 * Falls back to zeros if no data found.
 */
export async function getStudentDashboardStats(userId: string) {
  await requireAuth();

  const [
    upcomingBookings,
    activeCheckouts,
    activeProjects,
    trainingCount,
  ] = await Promise.all([
    prisma.booking.count({
      where: {
        userId,
        startTime: { gte: new Date() },
        status: { in: ["PENDING", "CONFIRMED"] },
      },
    }),
    prisma.checkout.count({
      where: {
        userId,
        status: "OUT",
      },
    }),
    prisma.projectMember.count({
      where: { userId },
    }),
    prisma.training.count({
      where: { userId },
    }),
  ]);

  return {
    upcomingBookings,
    activeCheckouts,
    activeProjects,
    trainingCount,
  };
}

/**
 * Admin-facing overview stats: lab count, open checkouts, pending procurement requests, total assets.
 */
export async function getAdminOverviewStats() {
  await requireRole("ADMIN");

  const [
    labsCount,
    openCheckouts,
    pendingProcurements,
    totalAssets,
    availableAssets,
    maintenanceAssets,
    newUsersThisWeek,
    todaysBookings,
  ] = await Promise.all([
    prisma.lab.count(),
    prisma.checkout.count({ where: { status: { in: ["OUT", "OVERDUE"] } } }),
    prisma.procurementRequest.count({ where: { status: { in: ["NEW", "APPROVED"] } } }),
    prisma.asset.count(),
    prisma.asset.count({ where: { status: "AVAILABLE" } }),
    prisma.asset.count({ where: { status: "MAINTENANCE" } }),
    prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    }),
    prisma.booking.count({
      where: {
        startTime: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    }),
  ]);

  return {
    labsCount,
    openCheckouts,
    pendingProcurements,
    totalAssets,
    availableAssets,
    maintenanceAssets,
    newUsersThisWeek,
    todaysBookings,
  };
}
