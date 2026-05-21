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
      className="sticky top-16 z-20 border-b border-border/45 bg-background/88 backdrop-blur-xl"
      role="navigation"
      aria-label="Admin sections"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="flex overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
        >
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href + "/"));
            return (
              <Link
                key={item.href}
                href={item.href}
                role="tab"
                aria-selected={isActive}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "nav-indicator relative shrink-0 border-b-2 px-4 py-4 text-sm font-medium whitespace-nowrap",
                  "transition-colors duration-150 ease-snap",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  isActive
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
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
