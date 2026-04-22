"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Wrench,
  Package,
  LayoutDashboard,
  CalendarDays,
  FolderKanban,
  GraduationCap,
  Users,
  Bell,
  LogOut,
  Menu,
  X,
  Clock,
  BarChart3,
  ShoppingCart,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["STUDENT", "MENTOR", "ADMIN"] },
  { name: "Machines", href: "/catalog/machines", icon: Wrench, roles: ["STUDENT", "MENTOR", "ADMIN"] },
  { name: "Materials", href: "/catalog/materials", icon: Package, roles: ["STUDENT", "MENTOR", "ADMIN"] },
  { name: "Bookings", href: "/bookings", icon: CalendarDays, roles: ["STUDENT", "MENTOR", "ADMIN"] },
  { name: "Projects", href: "/projects", icon: FolderKanban, roles: ["STUDENT", "MENTOR", "ADMIN"] },
  { name: "My Availability", href: "/mentor/availability", icon: Clock, roles: ["MENTOR", "ADMIN"] },
  { name: "Training", href: "/admin/training", icon: GraduationCap, roles: ["ADMIN"] },
  { name: "Users", href: "/admin/users", icon: Users, roles: ["ADMIN"] },
  { name: "Material Requests", href: "/admin/material-requests", icon: Package, roles: ["ADMIN"] },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3, roles: ["ADMIN"] },
  { name: "Purchase Orders", href: "/admin/purchase-orders", icon: ShoppingCart, roles: ["ADMIN"] },
];

export function AppShell({ children, unreadCount = 0 }: { children: React.ReactNode; unreadCount?: number }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userRole = session?.user?.role ?? "STUDENT";
  const filteredNav = navigation.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <div className="app-canvas flex min-h-screen text-foreground">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/65 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 transform border-r border-white/10 bg-[#11121a]/88 backdrop-blur-xl transition-transform lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <Link href="/dashboard" className="group flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-indigo-400 text-[0.65rem] font-bold tracking-wide text-primary-foreground shadow-[0_12px_30px_-12px_rgba(128,131,255,0.6)]">
              PM
            </span>
            <span className="text-sm font-semibold uppercase tracking-[0.14em] text-foreground/90 transition-colors group-hover:text-primary">
              Plaksha Makerspace
            </span>
          </Link>
          <button className="text-muted-foreground lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-4 pt-4">
          <p className="section-kicker">Navigation</p>
        </div>

        <nav className="flex flex-col gap-1.5 px-3 py-3">
          {filteredNav.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary/14 text-primary shadow-[inset_0_0_0_1px_rgba(192,193,255,0.25)]"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground transition-colors group-hover:text-foreground")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User info at bottom */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 p-4">
          <div className="surface-panel-soft flex items-center gap-3 rounded-xl px-3 py-3">
            <div className="flex-1 truncate">
              <p className="text-sm font-medium truncate">
                {session?.user?.name ?? "User"}
              </p>
              <Badge variant="secondary" className="mt-1 text-[0.65rem] uppercase tracking-[0.08em]">
                {userRole}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => signOut({ callbackUrl: "/" })}
              title="Sign Out"
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/10 bg-[#11121a]/70 px-4 backdrop-blur-xl lg:px-6">
          <button className="text-muted-foreground lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden md:block">
            <p className="section-kicker">Workspace</p>
            <p className="text-xs text-muted-foreground">Operational command center</p>
          </div>
          <div className="flex-1" />
          <Link href="/notifications">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Button>
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="mx-auto w-full max-w-[1480px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
