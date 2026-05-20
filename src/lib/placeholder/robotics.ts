// Placeholder data for the Robotics Lab dashboard.
// Field names mirror the planned Prisma schema so swapping to real DB queries
// is a one-file change: Asset, InventoryItem, Checkout, ProcurementRequest.

export type RoboticsAssetStatus = "AVAILABLE" | "CHECKED_OUT" | "MAINTENANCE";

export interface RoboticsAsset {
  id: string;
  name: string;
  division: "mechanical" | "electronics";
  category: string;
  status: RoboticsAssetStatus;
  /** Maps to Checkout.userId + User.name */
  assignedTo?: { name: string; userId: string };
  /** Maps to Asset.serialNumber */
  serial?: string;
}

export interface RoboticsInventoryItem {
  id: string;
  name: string;
  category: string;
  /** Maps to InventoryItem.quantityOnHand */
  qtyOnHand: number;
  /** Maps to InventoryItem.reorderLevel */
  reorderLevel: number;
  /** Maps to InventoryItem.storageLocation */
  location?: string;
}

export interface RoboticsProcurement {
  id: string;
  /** Maps to ProcurementRequest.itemName */
  itemName: string;
  qty: number;
  vendor?: string;
  /** ISO date string or undefined. Maps to ProcurementRequest.expectedArrival */
  expectedArrival?: string;
  status: "NEW" | "APPROVED" | "ORDERED" | "RECEIVED" | "REJECTED";
  /** Maps to ProcurementRequest.requestedById → User.name */
  requestedBy: string;
}

export interface RoboticsActiveUser {
  /** Maps to User.id */
  userId: string;
  name: string;
  division: "mechanical" | "electronics";
  /** Maps to Checkout.assetId */
  currentToolId?: string;
  /** Maps to Asset.name via Checkout join */
  currentToolName?: string;
}

export interface RoboticsProject {
  id: string;
  name: string;
  lead: string;
  /** Maps to ProjectMember.userId → User.name[] */
  members: string[];
  division: "mechanical" | "electronics" | "shared";
}

// ─── Seed data ─────────────────────────────────────────────────────────────

export const PLACEHOLDER_ASSETS: RoboticsAsset[] = [
  {
    id: "ast-001",
    name: "Torque Wrench 40 Nm",
    division: "mechanical",
    category: "Hand Tools",
    status: "CHECKED_OUT",
    assignedTo: { name: "Arjun Sharma", userId: "usr-101" },
    serial: "TW-2023-A",
  },
  {
    id: "ast-002",
    name: "Bench Vise 6″",
    division: "mechanical",
    category: "Workholding",
    status: "AVAILABLE",
    serial: "BV-2022-C",
  },
  {
    id: "ast-003",
    name: "Digital Vernier Caliper",
    division: "mechanical",
    category: "Measurement",
    status: "MAINTENANCE",
    serial: "VC-2021-B",
  },
  {
    id: "ast-004",
    name: "Soldering Station (Hakko FX-888D)",
    division: "electronics",
    category: "Soldering",
    status: "CHECKED_OUT",
    assignedTo: { name: "Priya Nair", userId: "usr-202" },
    serial: "SS-2024-D",
  },
  {
    id: "ast-005",
    name: "Oscilloscope 4-ch 200 MHz",
    division: "electronics",
    category: "Test Equipment",
    status: "AVAILABLE",
    serial: "OS-2023-F",
  },
  {
    id: "ast-006",
    name: "Logic Analyzer 16-ch",
    division: "electronics",
    category: "Test Equipment",
    status: "AVAILABLE",
    serial: "LA-2022-G",
  },
];

export const PLACEHOLDER_INVENTORY: RoboticsInventoryItem[] = [
  {
    id: "inv-001",
    name: "M3 Hex Bolt (25 mm)",
    category: "Fasteners",
    qtyOnHand: 320,
    reorderLevel: 100,
    location: "Shelf A-2",
  },
  {
    id: "inv-002",
    name: "ATmega328P Microcontroller",
    category: "ICs",
    qtyOnHand: 14,
    reorderLevel: 20,
    location: "Cabinet E-1",
  },
  {
    id: "inv-003",
    name: "18650 Li-Ion Cell 3000 mAh",
    category: "Power",
    qtyOnHand: 38,
    reorderLevel: 15,
    location: "Cabinet P-3",
  },
  {
    id: "inv-004",
    name: "Aluminium Flat Bar 20×3 mm (per m)",
    category: "Raw Material",
    qtyOnHand: 5,
    reorderLevel: 10,
    location: "Material Rack R-1",
  },
  {
    id: "inv-005",
    name: "60/40 Solder Wire 0.8 mm (100 g)",
    category: "Consumables",
    qtyOnHand: 7,
    reorderLevel: 5,
    location: "Shelf B-4",
  },
  {
    id: "inv-006",
    name: "ABS Filament 1.75 mm (1 kg spool)",
    category: "3D Printing",
    qtyOnHand: 3,
    reorderLevel: 4,
    location: "Shelf C-1",
  },
];

// Sorted by expectedArrival ascending; items with no ETA appear last.
export const PLACEHOLDER_PROCUREMENT: RoboticsProcurement[] = [
  {
    id: "prq-003",
    itemName: "ATmega328P Microcontroller",
    qty: 50,
    vendor: "Mouser Electronics",
    expectedArrival: "2026-05-24",
    status: "ORDERED",
    requestedBy: "Priya Nair",
  },
  {
    id: "prq-005",
    itemName: "Aluminium Flat Bar 20×3 mm",
    qty: 20,
    vendor: "MetalWorld India",
    expectedArrival: "2026-05-27",
    status: "APPROVED",
    requestedBy: "Vikram Patel",
  },
  {
    id: "prq-001",
    itemName: "18650 Li-Ion Cell 3000 mAh",
    qty: 100,
    vendor: "BatteryBhai",
    expectedArrival: "2026-06-01",
    status: "APPROVED",
    requestedBy: "Arjun Sharma",
  },
  {
    id: "prq-004",
    itemName: "ABS Filament 1.75 mm",
    qty: 10,
    vendor: "3DFilStore",
    expectedArrival: "2026-06-05",
    status: "NEW",
    requestedBy: "Sneha Rao",
  },
  {
    id: "prq-006",
    itemName: "Hakko T18 Tip Set",
    qty: 4,
    vendor: undefined,
    expectedArrival: undefined,
    status: "NEW",
    requestedBy: "Priya Nair",
  },
  {
    id: "prq-002",
    itemName: "M5 Standoff Kit Stainless",
    qty: 200,
    vendor: "Robu.in",
    expectedArrival: undefined,
    status: "REJECTED",
    requestedBy: "Arjun Sharma",
  },
];

export const PLACEHOLDER_ACTIVE_USERS: RoboticsActiveUser[] = [
  {
    userId: "usr-101",
    name: "Arjun Sharma",
    division: "mechanical",
    currentToolId: "ast-001",
    currentToolName: "Torque Wrench 40 Nm",
  },
  {
    userId: "usr-202",
    name: "Priya Nair",
    division: "electronics",
    currentToolId: "ast-004",
    currentToolName: "Soldering Station (Hakko FX-888D)",
  },
  {
    userId: "usr-303",
    name: "Vikram Patel",
    division: "mechanical",
    currentToolId: undefined,
    currentToolName: undefined,
  },
  {
    userId: "usr-404",
    name: "Sneha Rao",
    division: "electronics",
    currentToolId: undefined,
    currentToolName: undefined,
  },
  {
    userId: "usr-505",
    name: "Rahul Gupta",
    division: "mechanical",
    currentToolId: undefined,
    currentToolName: undefined,
  },
  {
    userId: "usr-606",
    name: "Ananya Singh",
    division: "electronics",
    currentToolId: undefined,
    currentToolName: undefined,
  },
];

export const PLACEHOLDER_ROBOTICS_PROJECTS: RoboticsProject[] = [
  {
    id: "prj-001",
    name: "Autonomous Delivery Bot",
    lead: "Arjun Sharma",
    members: ["Arjun Sharma", "Priya Nair", "Rahul Gupta"],
    division: "shared",
  },
  {
    id: "prj-002",
    name: "Robotic Arm v2",
    lead: "Vikram Patel",
    members: ["Vikram Patel", "Sneha Rao"],
    division: "mechanical",
  },
  {
    id: "prj-003",
    name: "Line Follower — Comp Prep",
    lead: "Priya Nair",
    members: ["Priya Nair", "Ananya Singh"],
    division: "electronics",
  },
  {
    id: "prj-004",
    name: "Quadruped Walker",
    lead: "Ananya Singh",
    members: ["Ananya Singh", "Arjun Sharma", "Vikram Patel", "Rahul Gupta"],
    division: "mechanical",
  },
  {
    id: "prj-005",
    name: "Sensor Fusion Module",
    lead: "Rahul Gupta",
    members: ["Rahul Gupta", "Priya Nair"],
    division: "electronics",
  },
  {
    id: "prj-006",
    name: "Lab Safety Monitor",
    lead: "Sneha Rao",
    members: ["Sneha Rao", "Ananya Singh", "Arjun Sharma"],
    division: "shared",
  },
];
