import { z } from "zod";

// Allowed hostnames for user-supplied image URLs
const ALLOWED_IMAGE_HOSTS = [
  "lh3.googleusercontent.com",
  "graph.microsoft.com",
  "upload.wikimedia.org",
  "images.unsplash.com",
];

const imageUrlSchema = z
  .string()
  .url()
  .refine(
    (url) => {
      try {
        const { hostname } = new URL(url);
        return ALLOWED_IMAGE_HOSTS.includes(hostname);
      } catch {
        return false;
      }
    },
    {
      message: `Image URL must be from an allowed domain (${ALLOWED_IMAGE_HOSTS.join(", ")})`,
    }
  )
  .optional()
  .or(z.literal(""));

// --- Machine Schemas ---

export const createMachineSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  location: z.string().min(1, "Location is required"),
  status: z.enum(["AVAILABLE", "IN_USE", "MAINTENANCE", "RETIRED"]).default("AVAILABLE"),
  costPerHour: z.coerce.number().min(0, "Cost must be non-negative"),
  imageUrl: imageUrlSchema,
  safetyRequirements: z.string().optional(),
  requiresTraining: z.coerce.boolean().default(true),
  requiresMentorSupport: z.coerce.boolean().default(false),
});

export const updateMachineSchema = createMachineSchema.partial();

// --- Material Schemas ---

export const createMaterialSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  unit: z.string().min(1, "Unit is required"),
  costPerUnit: z.coerce.number().min(0, "Cost must be non-negative"),
  currentStock: z.coerce.number().min(0, "Stock must be non-negative"),
  lowStockThreshold: z.coerce.number().min(0, "Threshold must be non-negative"),
  imageUrl: imageUrlSchema,
});

export const updateMaterialSchema = createMaterialSchema.partial();

// --- Training Schemas ---

export const createTrainingSchema = z.object({
  userId: z.string().min(1, "User is required"),
  machineId: z.string().min(1, "Machine is required"),
  trainedBy: z.string().optional(),
  certificate: z.string().optional(),
  notes: z.string().optional(),
});

// --- Booking Schemas ---

export const createBookingSchema = z.object({
  machineId: z.string().optional(),
  mentorId: z.string().optional(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  purpose: z.string().min(1, "Purpose is required").max(500),
  notes: z.string().max(1000).optional(),
}).refine(
  (data) => data.machineId || data.mentorId,
  { message: "Either a machine or mentor must be selected" }
).refine(
  (data) => data.endTime > data.startTime,
  { message: "End time must be after start time", path: ["endTime"] }
).refine(
  (data) => {
    const durationMs = data.endTime.getTime() - data.startTime.getTime();
    return durationMs >= 30 * 60 * 1000;
  },
  { message: "Booking must be at least 30 minutes", path: ["endTime"] }
).refine(
  (data) => {
    const durationMs = data.endTime.getTime() - data.startTime.getTime();
    return durationMs <= 8 * 60 * 60 * 1000;
  },
  { message: "Booking cannot exceed 8 hours", path: ["endTime"] }
);
// NOTE: "must be in future" is validated server-side at action time (not in schema)
// to avoid stale Date captured at module-load time.

export const updateBookingStatusSchema = z.object({
  bookingId: z.string().min(1),
  status: z.enum(["CONFIRMED", "CANCELLED"]),
});

// --- Mentor Availability Schemas ---

export const createAvailabilitySchema = z.object({
  dayOfWeek: z.coerce.number().min(0).max(6).optional(),
  date: z.coerce.date().optional(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Use HH:MM format"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Use HH:MM format"),
}).refine(
  (data) => data.dayOfWeek !== undefined || data.date !== undefined,
  { message: "Either day of week or specific date is required" }
).refine(
  (data) => data.startTime < data.endTime,
  { message: "End time must be after start time", path: ["endTime"] }
);

// --- Project Schemas ---

export const createProjectSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().optional(),
  mentorId: z.string().optional(),
  isPublic: z.coerce.boolean().default(false),
});

export const updateProjectVisibilitySchema = z.object({
  projectId: z.string().min(1, "Project is required"),
  isPublic: z.coerce.boolean(),
});

// --- BOM Schemas ---

export const createBomSchema = z.object({
  notes: z.string().max(2000).optional(),
});

export const createBomItemSchema = z.object({
  materialId: z.string().min(1, "Material is required"),
  quantity: z.coerce.number().min(0.001, "Quantity must be positive"),
  notes: z.string().max(500).optional(),
});

export const updateBomStatusSchema = z.object({
  bomId: z.string().min(1),
  status: z.enum(["SUBMITTED", "APPROVED", "REJECTED"]),
  notes: z.string().max(2000).optional(),
});

// --- Material Request Schemas ---

export const createMaterialAllocationRequestSchema = z.object({
  bomId: z.string().min(1, "BOM is required"),
  materialId: z.string().min(1, "Material is required"),
  quantity: z.coerce.number().min(0.001, "Quantity must be positive"),
  notes: z.string().max(1000).optional(),
});

export const reviewBomMaterialRequestSchema = z.object({
  requestId: z.string().min(1),
  decision: z.enum(["APPROVE", "REJECT"]),
  notes: z.string().max(1000).optional(),
});

export const approveMaterialRequestSchema = z.object({
  requestId: z.string().min(1),
  approvedQty: z.coerce.number().min(0),
});

export const issueMaterialRequestSchema = z.object({
  requestId: z.string().min(1),
  issuedQty: z.coerce.number().min(0.001, "Issued quantity must be positive"),
});

// --- User Role Update ---

export const updateUserRoleSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(["STUDENT", "MENTOR", "ADMIN"]),
});

// --- Asset Schemas (multi-lab extension) ---

export const createAssetSchema = z.object({
  labId: z.string().min(1, "Lab is required"),
  divisionId: z.string().optional(),
  name: z.string().min(1, "Name is required").max(200),
  kind: z.enum(["MACHINE", "TOOL", "EQUIPMENT"]),
  status: z.enum(["AVAILABLE", "IN_USE", "CHECKED_OUT", "MAINTENANCE", "RETIRED"]).default("AVAILABLE"),
  serialNo: z.string().max(100).optional(),
  location: z.string().max(200).optional(),
  machineId: z.string().optional(),
});

export const updateAssetSchema = createAssetSchema.partial().extend({
  id: z.string().min(1, "Asset ID is required"),
});

// --- Inventory Item Schemas ---

export const upsertInventoryItemSchema = z.object({
  id: z.string().optional(), // omit for create
  labId: z.string().min(1, "Lab is required"),
  divisionId: z.string().optional(),
  name: z.string().min(1, "Name is required").max(200),
  sku: z.string().max(100).optional(),
  qtyOnHand: z.coerce.number().int().min(0, "Quantity must be non-negative"),
  reorderLevel: z.coerce.number().int().min(0, "Reorder level must be non-negative"),
  location: z.string().max(200).optional(),
  materialId: z.string().optional(),
});

export const adjustStockSchema = z.object({
  id: z.string().min(1, "Inventory item ID is required"),
  delta: z.coerce.number().int().refine((n) => n !== 0, { message: "Delta must be non-zero" }),
});

// --- Checkout Schema ---

export const createCheckoutSchema = z.object({
  assetId: z.string().min(1, "Asset is required"),
  dueAt: z.coerce.date().optional(),
  notes: z.string().max(500).optional(),
});

// --- Procurement Request Schemas ---

export const createProcurementRequestSchema = z.object({
  title: z.string().min(1, "Title is required").max(300),
  vendor: z.string().max(200).optional(),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  unit: z.string().min(1, "Unit is required").max(50),
  cost: z.coerce.number().min(0).optional(),
  labId: z.string().min(1, "Lab ID is required"),
  notes: z.string().max(2000).optional(),
  expectedArrival: z.coerce.date().optional(),
});

export const rejectProcurementRequestSchema = z.object({
  id: z.string().min(1, "Request ID is required"),
  reason: z.string().max(1000).optional(),
});

// --- Type exports ---

export type CreateMachineInput = z.infer<typeof createMachineSchema>;
export type UpdateMachineInput = z.infer<typeof updateMachineSchema>;
export type CreateMaterialInput = z.infer<typeof createMaterialSchema>;
export type UpdateMaterialInput = z.infer<typeof updateMaterialSchema>;
export type CreateTrainingInput = z.infer<typeof createTrainingSchema>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>;
export type CreateAvailabilityInput = z.infer<typeof createAvailabilitySchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectVisibilityInput = z.infer<typeof updateProjectVisibilitySchema>;
export type CreateMaterialAllocationRequestInput = z.infer<typeof createMaterialAllocationRequestSchema>;
export type ReviewBomMaterialRequestInput = z.infer<typeof reviewBomMaterialRequestSchema>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
export type CreateAssetInput = z.infer<typeof createAssetSchema>;
export type UpdateAssetInput = z.infer<typeof updateAssetSchema>;
export type UpsertInventoryItemInput = z.infer<typeof upsertInventoryItemSchema>;
export type AdjustStockInput = z.infer<typeof adjustStockSchema>;
export type CreateCheckoutInput = z.infer<typeof createCheckoutSchema>;
export type CreateProcurementRequestInput = z.infer<typeof createProcurementRequestSchema>;
export type RejectProcurementRequestInput = z.infer<typeof rejectProcurementRequestSchema>;
