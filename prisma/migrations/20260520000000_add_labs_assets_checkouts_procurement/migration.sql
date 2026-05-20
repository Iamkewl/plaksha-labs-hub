-- Migration: add_labs_assets_checkouts_procurement
-- Generated manually (prisma migrate dev --create-only equivalent)
-- DO NOT apply with migrate deploy until reviewed.

-- ─── New Enums ───────────────────────────────────────────────────────────────

CREATE TYPE "LabRoleType" AS ENUM ('MEMBER', 'STAFF', 'LEAD');
CREATE TYPE "AssetKind" AS ENUM ('MACHINE', 'TOOL', 'EQUIPMENT');
CREATE TYPE "AssetStatus" AS ENUM ('AVAILABLE', 'IN_USE', 'CHECKED_OUT', 'MAINTENANCE', 'RETIRED');
CREATE TYPE "CheckoutStatus" AS ENUM ('OUT', 'RETURNED', 'OVERDUE', 'LOST');
CREATE TYPE "ProcurementStatus" AS ENUM ('NEW', 'APPROVED', 'ORDERED', 'RECEIVED', 'REJECTED', 'CANCELLED');

-- ─── New Table: labs ─────────────────────────────────────────────────────────

CREATE TABLE "labs" (
    "id"           TEXT         NOT NULL,
    "slug"         TEXT         NOT NULL,
    "name"         TEXT         NOT NULL,
    "description"  TEXT,
    "location"     TEXT,
    "contactEmail" TEXT,
    "isPublic"     BOOLEAN      NOT NULL DEFAULT true,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,

    CONSTRAINT "labs_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "labs_slug_key" ON "labs"("slug");

-- ─── New Table: lab_divisions ─────────────────────────────────────────────────

CREATE TABLE "lab_divisions" (
    "id"          TEXT NOT NULL,
    "labId"       TEXT NOT NULL,
    "slug"        TEXT NOT NULL,
    "name"        TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "lab_divisions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "lab_divisions_labId_slug_key" ON "lab_divisions"("labId", "slug");

-- ─── New Table: lab_roles ─────────────────────────────────────────────────────

CREATE TABLE "lab_roles" (
    "id"         TEXT          NOT NULL,
    "userId"     TEXT          NOT NULL,
    "labId"      TEXT          NOT NULL,
    "divisionId" TEXT,
    "role"       "LabRoleType" NOT NULL DEFAULT 'MEMBER',
    "createdAt"  TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lab_roles_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "lab_roles_userId_labId_divisionId_key" ON "lab_roles"("userId", "labId", "divisionId");

-- ─── New Table: assets ───────────────────────────────────────────────────────

CREATE TABLE "assets" (
    "id"         TEXT          NOT NULL,
    "labId"      TEXT          NOT NULL,
    "divisionId" TEXT,
    "name"       TEXT          NOT NULL,
    "kind"       "AssetKind"   NOT NULL,
    "status"     "AssetStatus" NOT NULL DEFAULT 'AVAILABLE',
    "serialNo"   TEXT,
    "location"   TEXT,
    "machineId"  TEXT,
    "createdAt"  TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"  TIMESTAMP(3)  NOT NULL,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "assets_machineId_key" ON "assets"("machineId");
CREATE INDEX "assets_status_idx" ON "assets"("status");

-- ─── New Table: inventory_items ───────────────────────────────────────────────

CREATE TABLE "inventory_items" (
    "id"           TEXT         NOT NULL,
    "labId"        TEXT         NOT NULL,
    "divisionId"   TEXT,
    "name"         TEXT         NOT NULL,
    "sku"          TEXT,
    "qtyOnHand"    INTEGER      NOT NULL DEFAULT 0,
    "reorderLevel" INTEGER      NOT NULL DEFAULT 0,
    "location"     TEXT,
    "materialId"   TEXT,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "inventory_items_materialId_key" ON "inventory_items"("materialId");

-- ─── New Table: checkouts ─────────────────────────────────────────────────────

CREATE TABLE "checkouts" (
    "id"              TEXT             NOT NULL,
    "userId"          TEXT             NOT NULL,
    "assetId"         TEXT,
    "inventoryItemId" TEXT,
    "quantity"        INTEGER          NOT NULL DEFAULT 1,
    "checkedOutAt"    TIMESTAMP(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueAt"           TIMESTAMP(3),
    "returnedAt"      TIMESTAMP(3),
    "status"          "CheckoutStatus" NOT NULL DEFAULT 'OUT',
    "notes"           TEXT,

    CONSTRAINT "checkouts_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "checkouts_status_idx" ON "checkouts"("status");

-- ─── New Table: procurement_requests ─────────────────────────────────────────

CREATE TABLE "procurement_requests" (
    "id"                      TEXT                NOT NULL,
    "labId"                   TEXT                NOT NULL,
    "requestedById"           TEXT                NOT NULL,
    "itemName"                TEXT                NOT NULL,
    "quantity"                INTEGER             NOT NULL DEFAULT 1,
    "vendor"                  TEXT,
    "expectedArrival"         TIMESTAMP(3),
    "status"                  "ProcurementStatus" NOT NULL DEFAULT 'NEW',
    "notes"                   TEXT,
    "linkedMaterialRequestId" TEXT,
    "createdAt"               TIMESTAMP(3)        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"               TIMESTAMP(3)        NOT NULL,

    CONSTRAINT "procurement_requests_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "procurement_requests_status_idx"          ON "procurement_requests"("status");
CREATE INDEX "procurement_requests_expectedArrival_idx" ON "procurement_requests"("expectedArrival");

-- ─── Additive columns on existing tables ─────────────────────────────────────

-- machines: add nullable labId
ALTER TABLE "machines" ADD COLUMN "labId" TEXT;
CREATE INDEX "machines_labId_idx" ON "machines"("labId");

-- materials: add nullable labId
ALTER TABLE "materials" ADD COLUMN "labId" TEXT;
CREATE INDEX "materials_labId_idx" ON "materials"("labId");

-- bookings: add nullable labId
ALTER TABLE "bookings" ADD COLUMN "labId" TEXT;
CREATE INDEX "bookings_labId_idx" ON "bookings"("labId");

-- projects: add nullable labId
ALTER TABLE "projects" ADD COLUMN "labId" TEXT;
CREATE INDEX "projects_labId_idx" ON "projects"("labId");

-- material_requests: add nullable labId
ALTER TABLE "material_requests" ADD COLUMN "labId" TEXT;
CREATE INDEX "material_requests_labId_idx" ON "material_requests"("labId");

-- ─── Foreign Keys: new tables ─────────────────────────────────────────────────

-- lab_divisions -> labs (Cascade: deleting a lab removes its divisions)
ALTER TABLE "lab_divisions"
    ADD CONSTRAINT "lab_divisions_labId_fkey"
    FOREIGN KEY ("labId") REFERENCES "labs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- lab_roles -> users (Cascade: deleting a user removes their roles)
ALTER TABLE "lab_roles"
    ADD CONSTRAINT "lab_roles_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- lab_roles -> labs (Cascade: deleting a lab removes its roles)
ALTER TABLE "lab_roles"
    ADD CONSTRAINT "lab_roles_labId_fkey"
    FOREIGN KEY ("labId") REFERENCES "labs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- lab_roles -> lab_divisions (Restrict: no cascade — role record references division; clear manually)
ALTER TABLE "lab_roles"
    ADD CONSTRAINT "lab_roles_divisionId_fkey"
    FOREIGN KEY ("divisionId") REFERENCES "lab_divisions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- assets -> labs (Restrict: assets must be explicitly re-assigned before lab deletion)
ALTER TABLE "assets"
    ADD CONSTRAINT "assets_labId_fkey"
    FOREIGN KEY ("labId") REFERENCES "labs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- assets -> lab_divisions (SetNull: removing division leaves asset orphan-free in parent lab)
ALTER TABLE "assets"
    ADD CONSTRAINT "assets_divisionId_fkey"
    FOREIGN KEY ("divisionId") REFERENCES "lab_divisions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- assets -> machines (SetNull: machine can exist without being linked to an asset)
ALTER TABLE "assets"
    ADD CONSTRAINT "assets_machineId_fkey"
    FOREIGN KEY ("machineId") REFERENCES "machines"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- inventory_items -> labs (Restrict)
ALTER TABLE "inventory_items"
    ADD CONSTRAINT "inventory_items_labId_fkey"
    FOREIGN KEY ("labId") REFERENCES "labs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- inventory_items -> lab_divisions (SetNull)
ALTER TABLE "inventory_items"
    ADD CONSTRAINT "inventory_items_divisionId_fkey"
    FOREIGN KEY ("divisionId") REFERENCES "lab_divisions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- inventory_items -> materials (SetNull: material can exist without an inventory item mirror)
ALTER TABLE "inventory_items"
    ADD CONSTRAINT "inventory_items_materialId_fkey"
    FOREIGN KEY ("materialId") REFERENCES "materials"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- checkouts -> users (Restrict: preserve checkout history even if user is deactivated)
ALTER TABLE "checkouts"
    ADD CONSTRAINT "checkouts_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- checkouts -> assets (SetNull: keep checkout record if asset is deleted)
ALTER TABLE "checkouts"
    ADD CONSTRAINT "checkouts_assetId_fkey"
    FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- checkouts -> inventory_items (SetNull: keep checkout record if item is deleted)
ALTER TABLE "checkouts"
    ADD CONSTRAINT "checkouts_inventoryItemId_fkey"
    FOREIGN KEY ("inventoryItemId") REFERENCES "inventory_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- procurement_requests -> labs (Restrict)
ALTER TABLE "procurement_requests"
    ADD CONSTRAINT "procurement_requests_labId_fkey"
    FOREIGN KEY ("labId") REFERENCES "labs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- procurement_requests -> users (Restrict: preserve audit trail)
ALTER TABLE "procurement_requests"
    ADD CONSTRAINT "procurement_requests_requestedById_fkey"
    FOREIGN KEY ("requestedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- procurement_requests -> material_requests (SetNull: linkage is informational)
ALTER TABLE "procurement_requests"
    ADD CONSTRAINT "procurement_requests_linkedMaterialRequestId_fkey"
    FOREIGN KEY ("linkedMaterialRequestId") REFERENCES "material_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ─── Foreign Keys: additive columns on existing tables ───────────────────────

-- machines.labId -> labs (SetNull: machine can exist without a lab assignment)
ALTER TABLE "machines"
    ADD CONSTRAINT "machines_labId_fkey"
    FOREIGN KEY ("labId") REFERENCES "labs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- materials.labId -> labs (SetNull)
ALTER TABLE "materials"
    ADD CONSTRAINT "materials_labId_fkey"
    FOREIGN KEY ("labId") REFERENCES "labs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- bookings.labId -> labs (SetNull)
ALTER TABLE "bookings"
    ADD CONSTRAINT "bookings_labId_fkey"
    FOREIGN KEY ("labId") REFERENCES "labs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- projects.labId -> labs (SetNull)
ALTER TABLE "projects"
    ADD CONSTRAINT "projects_labId_fkey"
    FOREIGN KEY ("labId") REFERENCES "labs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- material_requests.labId -> labs (SetNull)
ALTER TABLE "material_requests"
    ADD CONSTRAINT "material_requests_labId_fkey"
    FOREIGN KEY ("labId") REFERENCES "labs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
