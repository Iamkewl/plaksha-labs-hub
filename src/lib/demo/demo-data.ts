/**
 * demo-data.ts
 *
 * Curated sample dataset for the on-page "Demo Mode" sandbox.
 *
 * The shape matches the real Prisma models (see prisma/schema.prisma)
 * closely enough that the demo pages look and feel production-grade,
 * but every value here lives in localStorage — never the database.
 *
 * The seed is a single canonical `DEMO_STATE`.  The store clones it on
 * reset so visitors can experiment freely without polluting anyone else.
 */

import type { DemoState } from "./demo-types";

/** Returns a fresh deep-clone of the canonical demo dataset. */
export function getInitialDemoState(): DemoState {
  // Use a fixed reference time so demo data is deterministic on first
  // load.  After reset, the store re-clones from this snapshot, and the
  // "next available" times stay stable for the duration of a session.
  const now = new Date();
  const inHours = (h: number) =>
    new Date(now.getTime() + h * 3_600_000).toISOString();
  const inDays = (d: number, hour = 9) => {
    const dt = new Date(now);
    dt.setDate(dt.getDate() + d);
    dt.setHours(hour, 0, 0, 0);
    return dt.toISOString();
  };

  return {
    lastResetAt: now.toISOString(),

    users: [
      {
        id: "u_aanya",
        name: "Aanya Sharma",
        email: "aanya@plaksha.demo",
        role: "STUDENT",
        tag: "Project Lead",
      },
      {
        id: "u_rohan",
        name: "Rohan Mehta",
        email: "rohan@plaksha.demo",
        role: "STUDENT",
        tag: "Mechanicals",
      },
      {
        id: "u_priya",
        name: "Priya Krishnan",
        email: "priya@plaksha.demo",
        role: "STUDENT",
        tag: "Firmware",
      },
      {
        id: "u_arjun",
        name: "Arjun Patel",
        email: "arjun@plaksha.demo",
        role: "MENTOR",
        tag: "Faculty Mentor",
      },
      {
        id: "u_lab",
        name: "Lab Admin",
        email: "lab@plaksha.demo",
        role: "ADMIN",
      },
    ],

    machines: [
      {
        id: "m_ultimaker",
        name: "Ultimaker S5",
        category: "3D Printing",
        location: "Makerspace · Bay 1",
        status: "AVAILABLE",
        costPerHour: 60,
        accent: "hsl(182 80% 32%)",
        description:
          "Dual-extrusion FDM workhorse. Great for ABS, Nylon, and TPU prints up to 330×240×300 mm.",
        nextAvailable: inHours(2),
      },
      {
        id: "m_prusa",
        name: "Prusa i3 MK3S+",
        category: "3D Printing",
        location: "Makerspace · Bay 2",
        status: "IN_USE",
        costPerHour: 40,
        accent: "hsl(27 90% 45%)",
        description:
          "Reliable single-extruder for fast PLA / PETG iteration. Currently in use for shell fixtures.",
        nextAvailable: inHours(4),
      },
      {
        id: "m_form3",
        name: "Formlabs Form 3+",
        category: "Resin Printing",
        location: "Makerspace · Bay 3",
        status: "AVAILABLE",
        costPerHour: 90,
        accent: "hsl(225 80% 55%)",
        description:
          "SLA printer for high-detail parts — clear, tough, and flexible resins available.",
        nextAvailable: inHours(1),
      },
      {
        id: "m_epilog",
        name: "Epilog Fusion Pro 48",
        category: "Laser Cutting",
        location: "Makerspace · Room 102",
        status: "AVAILABLE",
        costPerHour: 75,
        accent: "hsl(27 96% 60%)",
        description:
          "120W CO₂ laser cutter / engraver. Works on wood, acrylic, leather, and anodized aluminium.",
        nextAvailable: inHours(3),
      },
      {
        id: "m_cnc",
        name: "Haas CNC Mill (Mini)",
        category: "CNC Machining",
        location: "Makerspace · Room 104",
        status: "MAINTENANCE",
        costPerHour: 150,
        accent: "hsl(239 80% 60%)",
        description:
          "3-axis CNC mill for aluminium, hardwood, and engineering plastics. Currently down for spindle service.",
        nextAvailable: inDays(2),
      },
      {
        id: "m_osc",
        name: "Tektronix MDO34 Oscilloscope",
        category: "Electronics",
        location: "Robotics · Bench 7",
        status: "AVAILABLE",
        costPerHour: 30,
        accent: "hsl(120 32% 45%)",
        description:
          "350 MHz mixed-domain oscilloscope with built-in spectrum analyzer. Available without booking.",
        nextAvailable: inHours(0),
      },
      {
        id: "m_solder",
        name: "Hakko FX-888D Soldering Station",
        category: "Electronics",
        location: "Robotics · Bench 3",
        status: "AVAILABLE",
        costPerHour: 0,
        accent: "hsl(47 95% 55%)",
        description:
          "Temperature-controlled soldering iron. Walk-up use; sign in at the bench logbook.",
        nextAvailable: inHours(0),
      },
      {
        id: "m_ur5",
        name: "Universal Robots UR5e",
        category: "Robotics",
        location: "Robotics · Cell 2",
        status: "AVAILABLE",
        costPerHour: 200,
        accent: "hsl(225 80% 55%)",
        description:
          "6-DOF collaborative robot arm. 5 kg payload. Requires mentor sign-off before operation.",
        nextAvailable: inDays(1, 14),
      },
    ],

    materials: [
      {
        id: "mat_pla",
        name: "PLA Filament (Black)",
        category: "3D Printing",
        unit: "kg",
        costPerUnit: 1200,
        currentStock: 18.4,
        lowStockThreshold: 5,
        accent: "hsl(182 80% 32%)",
      },
      {
        id: "mat_plywood",
        name: "Birch Plywood Sheet (3mm)",
        category: "Sheet Goods",
        unit: "sheet",
        costPerUnit: 380,
        currentStock: 9,
        lowStockThreshold: 4,
        accent: "hsl(27 90% 45%)",
      },
      {
        id: "mat_resin",
        name: "Tough Resin (Clear)",
        category: "Resin",
        unit: "L",
        costPerUnit: 6800,
        currentStock: 3.2,
        lowStockThreshold: 4,
        accent: "hsl(225 80% 55%)",
      },
      {
        id: "mat_acrylic",
        name: "Cast Acrylic Sheet (5mm)",
        category: "Sheet Goods",
        unit: "sheet",
        costPerUnit: 540,
        currentStock: 6,
        lowStockThreshold: 3,
        accent: "hsl(239 80% 60%)",
      },
      {
        id: "mat_bearing",
        name: "608ZZ Ball Bearing",
        category: "Hardware",
        unit: "pc",
        costPerUnit: 28,
        currentStock: 142,
        lowStockThreshold: 30,
        accent: "hsl(120 32% 45%)",
      },
      {
        id: "mat_m3",
        name: "M3 Socket Head Cap Screw (10mm)",
        category: "Hardware",
        unit: "pc",
        costPerUnit: 4,
        currentStock: 540,
        lowStockThreshold: 100,
        accent: "hsl(47 95% 55%)",
      },
      {
        id: "mat_wire",
        name: "22 AWG Silicone Wire (Red)",
        category: "Electronics",
        unit: "m",
        costPerUnit: 12,
        currentStock: 88,
        lowStockThreshold: 20,
        accent: "hsl(0 70% 50%)",
      },
      {
        id: "mat_esp32",
        name: "ESP32-WROOM-32 DevKit",
        category: "Electronics",
        unit: "pc",
        costPerUnit: 480,
        currentStock: 14,
        lowStockThreshold: 5,
        accent: "hsl(225 80% 55%)",
      },
      {
        id: "mat_motor",
        name: "NEMA-17 Stepper Motor",
        category: "Electronics",
        unit: "pc",
        costPerUnit: 850,
        currentStock: 7,
        lowStockThreshold: 4,
        accent: "hsl(27 90% 45%)",
      },
    ],

    bookings: [
      {
        id: "b_1",
        userId: "u_aanya",
        userName: "Aanya Sharma",
        machineId: "m_ultimaker",
        machineName: "Ultimaker S5",
        startTime: inDays(1, 10),
        endTime: inDays(1, 13),
        status: "CONFIRMED",
        purpose: "Print chassis brackets (batch 2)",
      },
      {
        id: "b_2",
        userId: "u_rohan",
        userName: "Rohan Mehta",
        machineId: "m_epilog",
        machineName: "Epilog Fusion Pro 48",
        startTime: inDays(2, 14),
        endTime: inDays(2, 17),
        status: "PENDING",
        purpose: "Cut enclosure panels from 3mm plywood",
      },
      {
        id: "b_3",
        userId: "u_priya",
        userName: "Priya Krishnan",
        machineId: "m_osc",
        machineName: "Tektronix MDO34 Oscilloscope",
        startTime: inDays(0, 16),
        endTime: inDays(0, 18),
        status: "IN_PROGRESS",
        purpose: "Validate motor driver PWM",
      },
      {
        id: "b_4",
        userId: "u_aanya",
        userName: "Aanya Sharma",
        machineId: "m_ur5",
        machineName: "Universal Robots UR5e",
        startTime: inDays(3, 14),
        endTime: inDays(3, 17),
        status: "PENDING",
        purpose: "Pick-and-place dry run",
      },
      {
        id: "b_5",
        userId: "u_rohan",
        userName: "Rohan Mehta",
        machineId: "m_prusa",
        machineName: "Prusa i3 MK3S+",
        startTime: inDays(-2, 11),
        endTime: inDays(-2, 14),
        status: "COMPLETED",
        purpose: "Iterate on gripper jaw v3",
      },
    ],

    projects: [
      {
        id: "p_robot",
        name: "Autonomous Robotics Prototype",
        description:
          "A low-cost autonomous ground robot that can map a 2,000 sq ft indoor space using LiDAR + ESP32 edge inference. Goal: ship a working prototype by semester end and showcase at the Plaksha open house.",
        status: "BUILD",
        isPublic: true,
        mentorName: "Arjun Patel",
        members: [
          { userId: "u_aanya", name: "Aanya Sharma", role: "LEAD" },
          { userId: "u_rohan", name: "Rohan Mehta", role: "MEMBER" },
          { userId: "u_priya", name: "Priya Krishnan", role: "MEMBER" },
        ],
        bom: {
          id: "bom_robot_v2",
          version: 2,
          status: "APPROVED",
          totalCost: 21_840,
          items: [
            {
              materialId: "mat_esp32",
              materialName: "ESP32-WROOM-32 DevKit",
              quantity: 2,
              unit: "pc",
              costSnapshot: 960,
            },
            {
              materialId: "mat_motor",
              materialName: "NEMA-17 Stepper Motor",
              quantity: 4,
              unit: "pc",
              costSnapshot: 3_400,
            },
            {
              materialId: "mat_pla",
              materialName: "PLA Filament (Black)",
              quantity: 3,
              unit: "kg",
              costSnapshot: 3_600,
            },
            {
              materialId: "mat_plywood",
              materialName: "Birch Plywood Sheet (3mm)",
              quantity: 2,
              unit: "sheet",
              costSnapshot: 760,
            },
            {
              materialId: "mat_bearing",
              materialName: "608ZZ Ball Bearing",
              quantity: 16,
              unit: "pc",
              costSnapshot: 448,
            },
            {
              materialId: "mat_m3",
              materialName: "M3 Socket Head Cap Screw (10mm)",
              quantity: 60,
              unit: "pc",
              costSnapshot: 240,
            },
            {
              materialId: "mat_wire",
              materialName: "22 AWG Silicone Wire (Red)",
              quantity: 12,
              unit: "m",
              costSnapshot: 144,
            },
          ],
        },
        milestones: [
          { id: "ms_1", label: "Concept brief signed off", done: true },
          { id: "ms_2", label: "BOM v1 approved", done: true },
          { id: "ms_3", label: "First chassis print complete", done: true },
          { id: "ms_4", label: "Wiring harness fabricated", done: false },
          { id: "ms_5", label: "LiDAR + ESP32 integration", done: false },
          { id: "ms_6", label: "Open house demo", done: false },
        ],
        updatedAt: now.toISOString(),
      },
    ],

    checklist: {
      explore_dashboard: false,
      reserve_inventory: false,
      book_machine: false,
      track_milestones: false,
    },
  };
}
