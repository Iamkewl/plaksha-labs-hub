/**
 * Internal helper — NOT a server action file.
 * Call from within other server actions to create notification records.
 */
import { prisma } from "@/lib/prisma";
import { NotificationType } from "@prisma/client";

export async function createNotification(data: {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
}) {
  try {
    await prisma.notification.create({ data });
  } catch {
    // Notification failure should never break the primary operation
  }
}

export async function createNotificationsForAdmins(data: {
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
}) {
  try {
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { id: true },
    });
    await prisma.notification.createMany({
      data: admins.map((admin) => ({
        userId: admin.id,
        ...data,
      })),
    });
  } catch {
    // Non-fatal
  }
}
