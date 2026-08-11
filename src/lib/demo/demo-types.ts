/**
 * demo-types.ts
 *
 * Strongly-typed shape of the local-only "Demo Mode" sandbox.
 *
 * Every value here is intentionally a plain serializable object so the
 * entire demo state can be safely round-tripped to/from localStorage.
 * Dates are kept as ISO strings to survive JSON.stringify.
 */

export type DemoRole = "STUDENT" | "MENTOR" | "ADMIN";

export type DemoMachineStatus = "AVAILABLE" | "IN_USE" | "MAINTENANCE";

export type DemoBookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type DemoBomStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED";

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: DemoRole;
  /** A short tag shown in the demo UI, e.g. "Project Lead". */
  tag?: string;
}

export interface DemoMachine {
  id: string;
  name: string;
  category: string;
  location: string;
  status: DemoMachineStatus;
  costPerHour: number;
  /** Hex color for the gradient header on machine cards. */
  accent: string;
  description: string;
  /** ISO datetime — used to compute upcoming availability. */
  nextAvailable: string;
}

export interface DemoMaterial {
  id: string;
  name: string;
  category: string;
  unit: string;
  costPerUnit: number;
  currentStock: number;
  lowStockThreshold: number;
  accent: string;
}

export interface DemoBooking {
  id: string;
  userId: string;
  userName: string;
  machineId: string;
  machineName: string;
  startTime: string;
  endTime: string;
  status: DemoBookingStatus;
  purpose: string;
}

export interface DemoBomItem {
  materialId: string;
  materialName: string;
  quantity: number;
  unit: string;
  costSnapshot: number;
}

export interface DemoProject {
  id: string;
  name: string;
  description: string;
  status: "DRAFT" | "ACTIVE" | "BUILD" | "REVIEW" | "SHIPPED";
  isPublic: boolean;
  mentorName: string;
  members: { userId: string; name: string; role: "LEAD" | "MEMBER" }[];
  bom: {
    id: string;
    version: number;
    status: DemoBomStatus;
    totalCost: number;
    items: DemoBomItem[];
  };
  /** Milestones used by the demo checklist & progress bar. */
  milestones: { id: string; label: string; done: boolean }[];
  /** ISO datetime the project was last updated. */
  updatedAt: string;
}

export interface DemoState {
  users: DemoUser[];
  machines: DemoMachine[];
  materials: DemoMaterial[];
  bookings: DemoBooking[];
  projects: DemoProject[];
  /** Checklist progress for the guided tour. */
  checklist: Record<DemoChecklistKey, boolean>;
  /** Last time the user reset the demo (ISO). */
  lastResetAt: string;
}

export type DemoChecklistKey =
  | "explore_dashboard"
  | "reserve_inventory"
  | "book_machine"
  | "track_milestones";

/** The four steps of the guided walkthrough, in display order. */
export const DEMO_CHECKLIST: {
  key: DemoChecklistKey;
  title: string;
  description: string;
  href: string;
  cta: string;
}[] = [
  {
    key: "explore_dashboard",
    title: "Explore the Demo Project dashboard",
    description:
      "Open the project view to see team, BOM, milestones, and recent activity at a glance.",
    href: "/demo/projects",
    cta: "Open dashboard",
  },
  {
    key: "reserve_inventory",
    title: "Request a raw material",
    description:
      "Reserve PLA filament, plywood, or bearings for the project from the inventory catalog.",
    href: "/demo/inventory",
    cta: "Reserve material",
  },
  {
    key: "book_machine",
    title: "Book a machine time slot",
    description:
      "Reserve a 3D printer or laser cutter for an upcoming build session.",
    href: "/demo/bookings",
    cta: "Book a slot",
  },
  {
    key: "track_milestones",
    title: "Update project milestones",
    description:
      "Mark a milestone complete and watch the progress bar move.",
    href: "/demo/projects",
    cta: "Track progress",
  },
];
