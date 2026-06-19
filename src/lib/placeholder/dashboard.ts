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

