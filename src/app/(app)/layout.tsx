import { AppShell } from "@/components/app-shell";
import { getUnreadNotificationCount } from "@/app/actions/notifications";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let unreadCount = 0;
  try {
    unreadCount = await getUnreadNotificationCount();
  } catch {
    // Not authenticated yet — count stays 0
  }

  return <AppShell unreadCount={unreadCount}>{children}</AppShell>;
}
