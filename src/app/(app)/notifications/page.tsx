import { requireAuth } from "@/lib/auth-guard";
import { getNotifications, markAllNotificationsRead, markNotificationRead } from "@/app/actions/notifications";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, ExternalLink } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default async function NotificationsPage() {
  await requireAuth();

  const notifications = await getNotifications(50);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
          </p>
        </div>
        {unreadCount > 0 && (
          <form action={markAllNotificationsRead}>
            <Button type="submit" variant="outline" size="sm">
              Mark all read
            </Button>
          </form>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-20 text-center text-muted-foreground">
          <Bell className="mb-3 h-10 w-10 opacity-40" />
          <p className="font-medium">No notifications yet</p>
          <p className="text-sm">You&apos;ll be notified about bookings, BOMs, and project updates.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <Card
              key={n.id}
              className={n.read ? "opacity-70" : "border-primary/40 bg-primary/5"}
            >
              <CardContent className="flex items-start gap-4 py-4">
                <div
                  className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                    n.read ? "bg-muted-foreground/30" : "bg-primary"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-sm">{n.title}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                      </span>
                      {!n.read && (
                        <Badge variant="default" className="text-xs">New</Badge>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    {n.link && (
                      <Link
                        href={n.link}
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        View <ExternalLink className="h-3 w-3" />
                      </Link>
                    )}
                    {!n.read && (
                      <form
                        action={async () => {
                          "use server";
                          await markNotificationRead(n.id);
                        }}
                      >
                        <button
                          type="submit"
                          className="text-xs text-muted-foreground hover:text-foreground hover:underline"
                        >
                          Mark as read
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
