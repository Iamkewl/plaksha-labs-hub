# Roadmap: BOM Allocation Approval + Mentor-Supported Machine Booking

Last updated: 2026-04-21

## 1) Objective

Implement two critical workflow upgrades and start product enhancements inspired by the attached frontend concept at a feature level (without copying visual UI):

1. BOM-based material allocation flow with two-stage approvals.
2. Technical-support machine booking that reserves both machine and mentor.
3. Public ongoing-projects discovery + private/public project visibility controls.

## 2) Assumptions Locked For Implementation

To avoid blocking implementation, the following defaults are adopted now:

- BOM approver is the project mentor when assigned.
- If a project has no mentor, BOM approver falls back to ADMIN role users.
- After BOM approver approval, the request automatically moves to admin-team queue.
- For technical-support-required machines, mentor selection is mandatory.

These can be tuned later via configuration or explicit per-BOM assignment.

## 3) Scope

### In scope

- Data model updates for multi-stage material request approvals.
- New student/mentor request submission under specific BOM.
- BOM approver review actions before admin team review.
- Admin queue and actions updated for new lifecycle.
- Machine-level technical support flag.
- Booking form + backend enforcement for dual machine+mentor booking.
- Feature additions adapted from concept:
  - Public ongoing projects section for visitors.
  - Project-level private/public visibility controls.

### Out of scope (future)

- Dedicated workshops/events CMS model.
- Full visual redesign to "Hurricane" style.
- Supplier purchase order automation.

## 4) Phased Execution Plan

## Phase 1: Data Model and Validation Foundation

### Deliverables

- Extend material request status workflow for two-stage approvals:
  - PENDING_BOM_APPROVAL
  - PENDING_ADMIN_APPROVAL
  - BOM_REJECTED
  - APPROVED
  - PARTIALLY_ISSUED
  - ISSUED
  - REJECTED
- Add tracking for BOM approval stage (approver + timestamp).
- Add machine flag: requiresMentorSupport.
- Update Zod validations accordingly.

### Acceptance criteria

- Prisma schema compiles and migration generates cleanly.
- Existing records can map safely into new status model.
- Validation layer supports new request and booking constraints.

## Phase 2: BOM Allocation Workflow

### Deliverables

- New action for student/mentor allocation request under BOM.
- BOM approver actions: approve/reject request.
- Admin actions operate only after BOM approval stage.
- Notifications for each stage transition.

### Acceptance criteria

- Student/mentor can submit request from BOM page.
- Request is invisible to admin processing stage until BOM approved.
- BOM approver can approve/reject with permission checks.
- Admin can approve/issue only stage-eligible requests.

## Phase 3: Mentor-Supported Machine Booking

### Deliverables

- Machine form supports requiresMentorSupport flag.
- Booking UI requires mentor selection for those machines.
- Booking backend enforces mentor selection + conflict checks.
- Single booking reserves both resources in same transaction.

### Acceptance criteria

- Attempting to book support-required machine without mentor fails.
- Mentor and machine conflict checks both trigger correctly.
- Successful booking persists machineId + mentorId together.

## Phase 4: Public Project Discovery

### Deliverables

- Add private/public visibility control when creating/managing projects.
- Add a public ongoing-projects section on landing page.
- Add a dedicated public projects route for visitors.
- Keep existing visual language and responsiveness.

### Acceptance criteria

- Public landing page renders dynamic ongoing public projects.
- Visitors can access public projects without sign-in.
- No auth regressions on public routes.
- Mobile/desktop layouts remain stable.

## Phase 5: QA and Stabilization

### Deliverables

- Manual and/or automated checks for role permissions and status transitions.
- Regression checks for existing booking, BOM, and admin flows.
- Update project state documentation.

### Acceptance criteria

- No unauthorized path can bypass stage gates.
- Existing core workflows continue to function.
- Errors are surfaced with actionable messages in UI.

## 5) Dependency Map

- Phase 1 is required before all other phases.
- Phase 2 depends on Phase 1.
- Phase 3 depends on Phase 1.
- Phase 4 can run in parallel with Phase 2/3 after schema stabilization.
- Phase 5 runs after all implemented increments.

## 6) Initial Implementation Start (This Pass)

Work starts with:

1. Phase 1 schema + validation updates.
2. Phase 2 core actions and UI hooks for BOM request lifecycle.
3. Phase 3 booking enforcement and form updates.
4. Phase 4 first feature enhancements (public projects + visibility controls).

