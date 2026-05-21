"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { MakerhubLogo } from "@/components/brand/MakerhubLogo";
import { Badge } from "@/components/ui/badge";
import {
  LAB_NAV_CONFIGS,
  getLabNavConfig,
  inferLabSlug,
  globalItems,
  mentorItems,
  adminItems,
  type NavItem,
} from "@/components/shell/nav-config";
import {
  Bell,
  ChevronDown,
  LogOut,
  User,
} from "lucide-react";

// ─── helpers ─────────────────────────────────────────────────────────────────

function isNavItemActive(pathname: string, item: NavItem): boolean {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(item.href + "/");
}

// ─── NavLink ─────────────────────────────────────────────────────────────────

function NavLink({
  item,
  pathname,
  onClick,
}: {
  item: NavItem;
  pathname: string;
  onClick?: () => void;
}) {
  const isActive = isNavItemActive(pathname, item);
  const Icon = item.icon;
  const isAccent = item.variant === "accent";

  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      onClick={onClick}
      className={cn(
        // base
        "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
        "transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-1 focus-visible:ring-offset-sidebar",
        // accent variant — always yellow, regardless of active state
        isAccent && [
          "bg-accent text-accent-foreground",
          "hover:bg-accent/90",
          "font-semibold",
        ],
        // normal inactive
        !isAccent && !isActive && [
          "text-white/75",
          "hover:bg-white/8 hover:text-white",
        ],
        // normal active
        !isAccent && isActive && "sidebar-item-active"
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4 shrink-0",
          isAccent && "text-accent-foreground",
          !isAccent && isActive && "text-white",
          !isAccent && !isActive && "text-white/60 transition-colors duration-150 group-hover:text-white/90"
        )}
        aria-hidden="true"
      />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

// ─── LabSwitcher ──────────────────────────────────────────────────────────────

function LabSwitcher({ currentSlug }: { currentSlug: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLab = LAB_NAV_CONFIGS.find((l) => l.labSlug === currentSlug) ?? LAB_NAV_CONFIGS[0];

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  function handleSelect(slug: string) {
    setOpen(false);
    const config = LAB_NAV_CONFIGS.find((l) => l.labSlug === slug);
    if (!config) return;
    // Navigate to the first item in that lab's config
    router.push(config.items[0].href);
  }

  return (
    <div ref={containerRef} className="relative px-3 py-2">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Switch lab"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-3 py-2",
          "bg-white/10 text-white text-sm font-medium",
          "hover:bg-white/15 transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        )}
      >
        <span className="flex-1 truncate text-left">{currentLab.labLabel}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-white/60 transition-transform duration-200",
            open && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Labs"
          className={cn(
            "absolute left-3 right-3 top-full z-30 mt-1 overflow-hidden",
            "rounded-md border border-white/10 bg-sidebar shadow-elevated",
            "animate-stagger-in"
          )}
          style={{
            animation: "stagger-in 0.18s cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          {LAB_NAV_CONFIGS.map((lab) => {
            const isSelected = lab.labSlug === currentSlug;
            return (
              <li key={lab.labSlug}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(lab.labSlug)}
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-2 text-sm",
                    "transition-colors duration-100",
                    "focus-visible:outline-none focus-visible:bg-white/10",
                    isSelected
                      ? "bg-white/14 text-white font-semibold"
                      : "text-white/75 hover:bg-white/8 hover:text-white"
                  )}
                >
                  {isSelected && (
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  )}
                  {!isSelected && <span className="h-1.5 w-1.5 shrink-0" aria-hidden="true" />}
                  {lab.labLabel}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// ─── SidebarNavSection ────────────────────────────────────────────────────────

function NavSection({
  items,
  pathname,
  label,
  onNavClick,
}: {
  items: NavItem[];
  pathname: string;
  label?: string;
  onNavClick?: () => void;
}) {
  if (items.length === 0) return null;
  return (
    <div className="flex flex-col gap-0.5">
      {label && (
        <p className="px-3 pb-1 pt-2 text-[0.65rem] font-semibold uppercase tracking-kicker text-white/40">
          {label}
        </p>
      )}
      {items.map((item) => (
        <NavLink key={item.href + item.label} item={item} pathname={pathname} onClick={onNavClick} />
      ))}
    </div>
  );
}

// ─── UserFooter ───────────────────────────────────────────────────────────────

function UserFooter() {
  const { data: session } = useSession();
  const userName = session?.user?.name ?? "User";
  const userRole = (session?.user?.role ?? "STUDENT") as string;
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="border-t border-white/10 p-3">
      <div className="flex items-center gap-3 rounded-md px-2 py-2">
        {/* Avatar */}
        <div
          aria-hidden="true"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-xs font-semibold text-white"
        >
          {initials || <User className="h-4 w-4" />}
        </div>

        {/* Name + role */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white leading-none mb-1">
            {userName}
          </p>
          <Badge
            variant="outline"
            className="border-white/20 bg-white/10 text-white/70 text-[0.6rem]"
          >
            {userRole}
          </Badge>
        </div>

        {/* Sign out */}
        <button
          type="button"
          title="Sign out"
          aria-label="Sign out"
          onClick={() => signOut({ callbackUrl: "/" })}
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
            "text-white/50 hover:text-white hover:bg-white/10",
            "transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          )}
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

// ─── Sidebar (exported) ───────────────────────────────────────────────────────

interface SidebarProps {
  /** Called when a nav link is clicked — used by MobileSidebar to close sheet */
  onNavClick?: () => void;
  /** Unread notification count, surfaced as a small badge next to the bell */
  unreadCount?: number;
}

export function Sidebar({ onNavClick, unreadCount = 0 }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const currentSlug = inferLabSlug(pathname);
  const labConfig = getLabNavConfig(currentSlug);
  const userRole = (session?.user?.role ?? "STUDENT") as "STUDENT" | "MENTOR" | "ADMIN";

  // Filtered mentor / admin items
  const visibleMentorItems =
    userRole === "MENTOR" || userRole === "ADMIN" ? mentorItems : [];
  const visibleAdminItems = userRole === "ADMIN" ? adminItems : [];

  return (
    <aside
      aria-label="App navigation"
      className={cn(
        "flex h-full w-60 flex-col text-white",
        // Deep-teal gradient — subtle depth from top to bottom
        "bg-gradient-to-b from-sidebar to-[hsl(182_81%_22%)]"
      )}
      style={{ color: "#ffffff" }}
    >
      {/* ── Logo header ─────────────────────────────────────────────────── */}
      <div className="flex h-14 shrink-0 items-center border-b border-white/10 px-4">
        <MakerhubLogo variant="dark" />
      </div>

      {/* ── Lab switcher ─────────────────────────────────────────────────── */}
      <LabSwitcher currentSlug={currentSlug} />

      {/* ── Scrollable nav area ───────────────────────────────────────────  */}
      <nav
        aria-label="Primary navigation"
        className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 pb-3"
      >
        {/* Lab-specific nav */}
        <NavSection
          items={labConfig.items}
          pathname={pathname}
          onNavClick={onNavClick}
        />

        {/* Separator + global items */}
        <div className="my-2 h-px bg-white/10" role="separator" />
        <NavSection
          items={globalItems}
          pathname={pathname}
          onNavClick={onNavClick}
        />

        {/* Mentor items */}
        {visibleMentorItems.length > 0 && (
          <>
            <div className="my-2 h-px bg-white/10" role="separator" />
            <NavSection
              items={visibleMentorItems}
              pathname={pathname}
              onNavClick={onNavClick}
            />
          </>
        )}

        {/* Admin items */}
        {visibleAdminItems.length > 0 && (
          <>
            <div className="my-2 h-px bg-white/10" role="separator" />
            <NavSection
              items={visibleAdminItems}
              pathname={pathname}
              label="Admin"
              onNavClick={onNavClick}
            />
          </>
        )}
      </nav>

      {/* ── Notifications row ────────────────────────────────────────────── */}
      <Link
        href="/notifications"
        aria-label={
          unreadCount > 0
            ? `Notifications — ${unreadCount} unread`
            : "Notifications"
        }
        onClick={onNavClick}
        className={cn(
          "mx-3 mb-2 flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
          "transition-colors duration-150",
          pathname.startsWith("/notifications")
            ? "sidebar-item-active"
            : "text-white/75 hover:bg-white/8 hover:text-white",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-1 focus-visible:ring-offset-sidebar"
        )}
      >
        <span className="relative inline-flex h-4 w-4 shrink-0 items-center justify-center">
          <Bell className="h-4 w-4 text-white/70" aria-hidden="true" />
          {unreadCount > 0 && (
            <span
              aria-hidden="true"
              className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-accent text-[9px] font-bold leading-none text-accent-foreground"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </span>
        <span className="truncate">Notifications</span>
      </Link>

      {/* ── User footer ──────────────────────────────────────────────────── */}
      <UserFooter />
    </aside>
  );
}
