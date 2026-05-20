# Data Model

Source of truth: [`prisma/schema.prisma`](../prisma/schema.prisma).

## Entity overview

```
User ─────┬───< Booking >── Machine
          ├───< Checkout >── Asset
          ├───< ProcurementRequest
          ├───< Project
          └───< LabRole >── Lab
                              ├──< LabDivision
                              ├──< Asset
                              ├──< InventoryItem
                              ├──< Machine (nullable labId)
                              └──< Material (nullable labId)
```

## New (Labs Hub) tables

| Model | Purpose |
| --- | --- |
| `Lab` | A physical lab (Makerspace, Robotics). `slug` is the public URL identifier. |
| `LabDivision` | Optional sub-grouping within a lab (Mechanical, Electronics). |
| `LabRole` | Per-user per-lab membership (`STAFF`, `MEMBER`, etc.). Nullable `divisionId`. |
| `Asset` | Lab-scoped physical thing (a 3D printer, an oscilloscope). Replaces lab-scoped `Machine` going forward. |
| `InventoryItem` | Lab-scoped consumable (resistor, filament spool). |
| `Checkout` | Tracks an `Asset` checked out by a `User`. Has `OPEN` / `RETURNED` / `OVERDUE` status. |
| `ProcurementRequest` | A request to buy something. `PENDING` → `APPROVED`/`REJECTED` → `ORDERED` → `RECEIVED`. |

## Legacy tables (Makerspace)

`Machine`, `Material`, `Booking`, `Project`, `MaterialRequest`, `Training`, `Certification`, `BillOfMaterials`, `PurchaseOrder` — all still in use. They received a **nullable `labId`** column for multi-lab tagging; existing rows are left null and treated as Makerspace by default.

## Enums added

- `LabRoleType` — STAFF, MEMBER
- `AssetKind` — TOOL, MACHINE, INSTRUMENT, FIXTURE
- `AssetStatus` — AVAILABLE, IN_USE, MAINTENANCE, RETIRED
- `CheckoutStatus` — OPEN, RETURNED, OVERDUE
- `ProcurementStatus` — PENDING, APPROVED, REJECTED, ORDERED, RECEIVED

## Migration notes

- The initial multi-lab migration is `prisma/migrations/20260520000000_add_labs_assets_checkouts_procurement/`.
- All changes are additive (no column drops, no renames). Existing Makerspace data continues to work.
- `LabRole` has `(userId, labId, divisionId)` as a candidate uniqueness key. Postgres treats `NULL` as distinct, so two memberships with `divisionId = NULL` for the same user/lab will both be allowed. If we need to enforce single root membership, add a partial unique index: `CREATE UNIQUE INDEX lab_role_root_uq ON "LabRole"("userId","labId") WHERE "divisionId" IS NULL;`

## Seed strategy

`prisma/seed.ts` is idempotent for the new multi-lab block (uses `upsert`). The original Makerspace seed (12 machines, 15 materials) still uses `create` and will throw on re-run — call `prisma migrate reset` if you need a clean reseed during development.
