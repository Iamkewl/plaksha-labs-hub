# ADR-0002: Additive Multi-Lab Schema Migration

- **Status:** Accepted
- **Date:** 2026-05-20
- **Deciders:** Plaksha Labs Hub team

## Context

The Makerspace schema models a single lab implicitly: `Machine`, `Material`, `Booking`, `Project`, `MaterialRequest` all live at the root level with no lab pointer. The Plaksha Labs Hub initiative needs to host multiple labs (Makerspace + Robotics + future) while preserving every existing Makerspace row and code path.

## Decision

Use an **additive-only** migration:

1. Introduce `Lab`, `LabDivision`, `LabRole` as new tables.
2. Introduce `Asset`, `InventoryItem`, `Checkout`, `ProcurementRequest` for Labs Hub features.
3. Add **nullable** `labId` columns to legacy tables. Do not backfill in the schema migration; do it in `prisma/seed.ts` instead.
4. No renames, no drops, no required columns added to legacy tables.

## Consequences

Positive:

- Zero risk to existing Makerspace functionality.
- Migration is reversible (drop new tables, drop nullable columns).
- Old code keeps working without `labId` — it simply queries lab-agnostic data.

Negative:

- Two parallel paradigms (legacy `Machine` vs new `Asset`) until we migrate Makerspace to the new model.
- Some duplication in seed (mirroring `Machine` rows as `Asset` rows for the Makerspace lab).

Neutral:

- We will eventually deprecate `Machine`/`Material` in favor of `Asset`/`InventoryItem`. That migration is out of scope for this ADR.

## Alternatives considered

- **Rename `Machine` → `Asset` with a lab pointer.** Cleaner long-term but high blast radius; touches every existing query and breaks any in-flight branches.
- **Lab-as-tenant column on every table.** Same risk as a rename and conflates ownership with discovery.
