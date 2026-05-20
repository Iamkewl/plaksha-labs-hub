"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Overview", href: "/admin" },
  { label: "Labs", href: "/admin/labs" },
  { label: "Assets", href: "/admin/assets" },
  { label: "Requests", href: "/admin/requests" },
  { label: "Analytics", href: "/admin/analytics" },
  { label: "Machines", href: "/admin/machines" },
  { label: "Materials", href: "/admin/materials" },
  { label: "Users", href: "/admin/users" },
];

export function AdminSubNav() {
  const pathname = usePathname();

  return (
    <nav
      className="sticky top-16 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      role="navigation"
      aria-label="Admin sections"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 overflow-x-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href === "/admin" && pathname === "/admin");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "border-b-2 px-1 py-4 text-sm font-medium whitespace-nowrap transition-colors",
                  isActive
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
