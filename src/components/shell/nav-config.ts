import {
  FolderOpen,
  Boxes,
  ClipboardList,
  Calendar,
  FileText,
  Plus,
  LayoutDashboard,
  Wrench,
  ShieldAlert,
  Users,
  BarChart3,
  ShoppingCart,
  GraduationCap,
  Clock,
  PackageOpen,
  Bell,
  FlaskConical,
  Cpu,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** exact match only (default: prefix match) */
  exact?: boolean;
  /** visual variant */
  variant?: "accent";
  roles?: ("STUDENT" | "MENTOR" | "ADMIN")[];
}

export interface LabNavConfig {
  labSlug: string;
  labLabel: string;
  items: NavItem[];
}

// ── Makerspace nav items ────────────────────────────────────────────────────
const makerspaceItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/projects",
    label: "My Projects",
    icon: FolderOpen,
  },
  {
    href: "/catalog/materials",
    label: "Available Inventory",
    icon: Boxes,
  },
  {
    href: "/dashboard/checkouts",
    label: "My Checkouts",
    icon: PackageOpen,
  },
  {
    href: "/bookings",
    label: "Machine Booking",
    icon: Calendar,
  },
  {
    href: "/catalog/machines",
    label: "Machines Catalog",
    icon: Wrench,
  },
  {
    href: "/projects/new",
    label: "New Project",
    icon: Plus,
    exact: true,
    variant: "accent",
  },
];

// ── Robotics nav items ────────────────────────────────────────────────────
const roboticsItems: NavItem[] = [
  {
    href: "/labs/robotics/dashboard",
    label: "Overview",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/projects",
    label: "My Projects",
    icon: FolderOpen,
  },
  {
    href: "/bookings",
    label: "Bookings",
    icon: Calendar,
  },
];

// ── Mentor-only items (appended regardless of lab) ────────────────────────
export const mentorItems: NavItem[] = [
  {
    href: "/mentor/availability",
    label: "My Availability",
    icon: Clock,
    roles: ["MENTOR", "ADMIN"],
  },
  {
    href: "/mentor/material-requests",
    label: "Material Reviews",
    icon: ClipboardList,
    roles: ["MENTOR", "ADMIN"],
  },
];

// ── Admin-only items ────────────────────────────────────────────────────────
export const adminItems: NavItem[] = [
  {
    href: "/admin",
    label: "Admin Overview",
    icon: ShieldAlert,
    exact: true,
    roles: ["ADMIN"],
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: Users,
    roles: ["ADMIN"],
  },
  {
    href: "/admin/training",
    label: "Training",
    icon: GraduationCap,
    roles: ["ADMIN"],
  },
  {
    href: "/admin/material-requests",
    label: "Material Requests",
    icon: ClipboardList,
    roles: ["ADMIN"],
  },
  {
    href: "/admin/analytics",
    label: "Analytics",
    icon: BarChart3,
    roles: ["ADMIN"],
  },
  {
    href: "/admin/purchase-orders",
    label: "Purchase Orders",
    icon: ShoppingCart,
    roles: ["ADMIN"],
  },
];

// ── Global items (always visible, not lab-specific) ───────────────────────
// Notifications is now rendered as a dedicated row in Sidebar (with unread badge),
// so it is intentionally omitted here to avoid a duplicate entry.
export const globalItems: NavItem[] = [
  {
    href: "/labs",
    label: "Explore Labs",
    icon: FlaskConical,
    exact: true,
  },
];

// ── Lab registry ─────────────────────────────────────────────────────────
export const LAB_NAV_CONFIGS: LabNavConfig[] = [
  {
    labSlug: "makerspace",
    labLabel: "Makerspace",
    items: makerspaceItems,
  },
  {
    labSlug: "robotics",
    labLabel: "Robotics Lab",
    items: roboticsItems,
  },
];

export const LAB_SLUGS = LAB_NAV_CONFIGS.map((l) => l.labSlug);

/** Infer the active lab slug from the current pathname */
export function inferLabSlug(pathname: string): string {
  // /labs/robotics/... → "robotics"
  const match = pathname.match(/^\/labs\/([^/]+)/);
  if (match) {
    const slug = match[1];
    if (LAB_SLUGS.includes(slug)) return slug;
  }
  // Default: makerspace (the main app is Makerspace-centric)
  return "makerspace";
}

/** Get nav config for a given lab slug */
export function getLabNavConfig(labSlug: string): LabNavConfig {
  return (
    LAB_NAV_CONFIGS.find((c) => c.labSlug === labSlug) ?? LAB_NAV_CONFIGS[0]
  );
}
