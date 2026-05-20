export interface PlaceholderBooking {
  id: string;
  machineId: string | null;
  mentorId: string | null;
  machineName: string | null;
  mentorName: string | null;
  location: string | null;
  startTime: Date;
  endTime: Date;
  status: "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  createdAt: Date;
}

export interface PlaceholderCheckout {
  id: string;
  assetId: string;
  assetName: string;
  labDivision: string;
  checkedOutAt: Date;
  dueDate: Date;
  returnedAt: Date | null;
}

export interface PlaceholderTraining {
  id: string;
  machineId: string;
  machineName: string;
  category: string;
  trainedAt: Date;
  status: "COMPLETED" | "REQUIRED" | "AVAILABLE";
}

export interface PlaceholderProject {
  id: string;
  name: string;
  description: string | null;
  members: number;
  bomCount: number;
  isPublic: boolean;
  mentorName: string | null;
}

const now = new Date();
const tomorrow = new Date(now);
tomorrow.setDate(tomorrow.getDate() + 1);
const nextWeek = new Date(now);
nextWeek.setDate(nextWeek.getDate() + 7);

export const PLACEHOLDER_BOOKINGS: PlaceholderBooking[] = [
  {
    id: "booking-1",
    machineId: "machine-1",
    mentorId: null,
    machineName: "3D Printer Pro",
    mentorName: null,
    location: "Lab A",
    startTime: tomorrow,
    endTime: new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000),
    status: "CONFIRMED",
    createdAt: now,
  },
  {
    id: "booking-2",
    machineId: null,
    mentorId: "mentor-1",
    machineName: null,
    mentorName: "Dr. Sarah Chen",
    location: null,
    startTime: nextWeek,
    endTime: new Date(nextWeek.getTime() + 1 * 60 * 60 * 1000),
    status: "CONFIRMED",
    createdAt: now,
  },
  {
    id: "booking-3",
    machineId: "machine-2",
    mentorId: null,
    machineName: "Laser Cutter",
    mentorName: null,
    location: "Lab B",
    startTime: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    endTime: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 1.5 * 60 * 60 * 1000),
    status: "COMPLETED",
    createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
  },
];

export const PLACEHOLDER_CHECKOUTS: PlaceholderCheckout[] = [
  {
    id: "checkout-1",
    assetId: "asset-1",
    assetName: "Arduino Starter Kit",
    labDivision: "Electronics Lab",
    checkedOutAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
    dueDate: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
    returnedAt: null,
  },
  {
    id: "checkout-2",
    assetId: "asset-2",
    assetName: "Soldering Iron",
    labDivision: "Electronics Lab",
    checkedOutAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
    dueDate: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000),
    returnedAt: null,
  },
  {
    id: "checkout-3",
    assetId: "asset-3",
    assetName: "Safety Goggles",
    labDivision: "General",
    checkedOutAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
    dueDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    returnedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
  },
];

export const PLACEHOLDER_TRAININGS: PlaceholderTraining[] = [
  {
    id: "training-1",
    machineId: "machine-1",
    machineName: "3D Printer Pro",
    category: "3D Printing",
    trainedAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    status: "COMPLETED",
  },
  {
    id: "training-2",
    machineId: "machine-2",
    machineName: "Laser Cutter",
    category: "Cutting & Engraving",
    trainedAt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
    status: "COMPLETED",
  },
  {
    id: "training-3",
    machineId: "machine-3",
    machineName: "CNC Machine",
    category: "Machining",
    trainedAt: new Date(),
    status: "REQUIRED",
  },
  {
    id: "training-4",
    machineId: "machine-4",
    machineName: "Welding Station",
    category: "Welding",
    trainedAt: new Date(),
    status: "AVAILABLE",
  },
];

export const PLACEHOLDER_PROJECTS_SUMMARY: PlaceholderProject[] = [
  {
    id: "project-1",
    name: "Autonomous Robot Arm",
    description: "A six-axis robotic arm for industrial automation research",
    members: 4,
    bomCount: 3,
    isPublic: true,
    mentorName: "Prof. Alex Kumar",
  },
  {
    id: "project-2",
    name: "Smart Garden System",
    description: "IoT-enabled automated garden monitoring and watering",
    members: 3,
    bomCount: 2,
    isPublic: false,
    mentorName: "Dr. Priya Sharma",
  },
];
