"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface SubNavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: SubNavItem[] = [
  { label: "Overview", href: "/dashboard" },
  { label: "Bookings", href: "/dashboard/bookings" },
  { label: "Checkouts", href: "/dashboard/checkouts" },
  { label: "Projects", href: "/dashboard/projects" },
  { label: "Training", href: "/dashboard/training" },
];

export function SubNav() {
  const pathname = usePathname();

  return (
    <nav
      className="sticky top-0 z-20 border-b border-border/45 bg-background/88 backdrop-blur-xl"
      role="navigation"
      aria-label="Dashboard sections"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Horizontally scrollable, no scrollbar chrome */}
        <div
          className="flex overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                role="tab"
                aria-selected={isActive}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  // nav-indicator adds the ::after scale-in underline
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
