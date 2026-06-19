import { Sidebar } from "@/components/shell/Sidebar";
import { MobileSidebar } from "@/components/shell/MobileSidebar";
import { getUnreadNotificationCount } from "@/app/actions/notifications";
import { Toaster } from "@/components/ui/toaster";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let unreadCount = 0;
  try {
    unreadCount = await getUnreadNotificationCount();
  } catch {
    /* unauthenticated — badge stays hidden */
  }

  return (
    <div className="app-canvas flex min-h-screen">
      {/* Fixed vertical sidebar (desktop) */}
      <div className="fixed inset-y-0 left-0 z-20 hidden lg:flex">
        <Sidebar unreadCount={unreadCount} />
      </div>

      {/* Content column */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-60">
        {/* Mobile-only floating hamburger */}
        <div className="sticky top-0 z-10 flex h-12 items-center px-3 lg:hidden">
          <MobileSidebar unreadCount={unreadCount} />
        </div>

        <main className="flex-1 bg-background p-4 lg:p-6">
          <div className="mx-auto w-full max-w-[1480px]">{children}</div>
        </main>
      </div>
      <Toaster />
    </div>
  );
}
