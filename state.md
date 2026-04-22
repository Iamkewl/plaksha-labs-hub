# Project State

Last updated: 2026-04-21

## 1) Current Product Scope

Plaksha Makerspace Hub is a role-based makerspace operations platform for students, mentors, and admins.
It currently covers:
- Authentication and authorization
- Machine and material catalogs
- Booking workflows (machine + mentor)
- Project and BOM workflows
- Material request approval and issuing
- Mentor availability management
- Training certification management
- Notification center
- Admin analytics

## 2) Tech and Architecture Snapshot

- Framework: Next.js App Router (TypeScript)
- Auth: NextAuth (Prisma adapter)
- Database: PostgreSQL via Prisma
- UI: custom component library in src/components/ui
- Server-side domain logic: src/app/actions/*.ts
- Route-level protection: src/middleware.ts + src/lib/auth-guard.ts
- Rate limiting: local in-memory fallback + optional Upstash REST

## 3) Implemented Features (Confirmed)

### A. Authentication and Access Control

Implemented:
- Public routes: /, /auth/signin, /api/auth
- Sign in methods:
  - Dev credentials login (email) when AUTH_DEV_BYPASS=true
  - Microsoft Entra ID when configured
- Email domain restriction to @plaksha.edu.in
- Role-based access:
  - ADMIN required for /admin/*
  - MENTOR or ADMIN required for /mentor/*
- Session role refresh from DB every 5 minutes (picks up role changes)
- Unauthorized page (/unauthorized)
- Request throttling in middleware:
  - /api/*: 120 req/min
  - sign-in path: 40 req/min (same page budget)

### B. Landing and App Shell

Implemented:
- Public marketing/entry page with feature overview
- Responsive authenticated app shell
- Role-filtered sidebar navigation
- Notification bell with unread count
- Sign-out action

### C. Role-Specific Dashboard

Implemented:
- Student dashboard:
  - upcoming bookings
  - active projects
  - pending material request count
  - recent notifications
- Mentor dashboard:
  - today sessions
  - upcoming sessions
  - supervised projects
  - active availability slots
- Admin dashboard:
  - users/machines/bookings today
  - pending BOM + material requests
  - low-stock alerts
  - recent activity
  - quick actions

### D. Machine Catalog and Admin Machine Management

Implemented:
- Browse machines (/catalog/machines)
- Filters: search, category, status
- Machine details (/catalog/machines/[id]):
  - status, location, pricing, training requirement
  - safety requirements
  - specifications (JSON)
  - trained users list
  - upcoming bookings list
  - weekly booking calendar visualization
- Admin machine CRUD:
  - create: /admin/machines/new
  - edit: /admin/machines/[id]/edit
  - delete action available in server action

### E. Material Catalog and Admin Material Management

Implemented:
- Browse materials (/catalog/materials)
- Filters: search, category, low-stock toggle
- Material details (/catalog/materials/[id]):
  - stock and threshold
  - low-stock indicator
  - pricing and unit
- Admin material CRUD:
  - create: /admin/materials/new
  - edit: /admin/materials/[id]/edit
  - delete action available in server action

### F. Booking Workflow (Machine + Mentor)

Implemented:
- Booking list page (/bookings): upcoming and past/cancelled sections
- New booking page (/bookings/new) with tabs:
  - machine booking
  - mentor session booking
- Client-side checks in form:
  - same-resource time overlap warning
  - training gate warning
- Server-side booking enforcement:
  - future-only bookings
  - machine status must be AVAILABLE
  - training required where machine requires it
  - overlap prevention for machine, mentor, and self
  - serializable transaction on create
- Booking status actions:
  - confirm (admin or assigned mentor)
  - cancel (owner/admin/assigned mentor)
- Transactional email trigger on CONFIRMED/CANCELLED (provider dependent)

### G. Projects and Team Management

Implemented:
- Project list (/projects)
- Project creation (/projects/new)
  - optional mentor assignment
  - creator auto-added as LEAD
- Project detail (/projects/[id]):
  - member list and roles
  - mentor display
  - BOM history summary
- Member management:
  - add member (lead/admin/mentor of project)
  - remove member with lead safety checks

### H. BOM (Bill of Materials) Workflow

Implemented:
- BOM creation UI (/projects/[id]/bom/new)
  - multi-line item builder
  - live cost totals
- BOM detail (/projects/[id]/bom/[bomId])
  - itemized costs
  - status display
  - material request status table (post approval)
- BOM lifecycle actions:
  - DRAFT creation
  - submit for approval
  - admin approve/reject
- Versioning:
  - auto-incremented per project
- On BOM approval:
  - material requests auto-created for BOM items
  - lead notifications created

### I. Material Request Workflow

Implemented:
- Admin review page (/admin/material-requests)
- Status filters: ALL, PENDING, APPROVED, PARTIALLY_ISSUED, ISSUED, REJECTED
- Actions:
  - approve quantity
  - issue quantity (stock decremented)
- Partial issue support in backend logic
- Request status progression tracked with approver/issuer metadata

### J. Mentor Availability

Implemented:
- Mentor availability page (/mentor/availability)
- Add recurring weekly slots or one-off dated slots
- Toggle active/paused
- Delete slot
- Availability revalidation touches booking form route

### K. Training Management (Admin)

Implemented:
- Training records page (/admin/training)
- Add training record (student + machine)
- Duplicate training prevention
- Delete training record
- Training check utility supports machine booking gate

### L. Notifications

Implemented:
- Notifications list page (/notifications)
- Unread count in app shell
- Mark single notification read
- Mark all notifications read
- Notification generation wired from key workflows (BOMs, requests, etc.)

### M. Analytics (Admin)

Implemented:
- Analytics page (/admin/analytics)
- Machine utilization:
  - bookings by machine
  - machine status breakdown
- Material analytics:
  - top issued materials
  - low-stock list
- Booking analytics:
  - booking status counts
  - daily trend chart (last 7 days)
- User analytics:
  - role distribution
  - top users by booking count

### N. Error and Resilience UX

Implemented:
- Global error boundary page
- App section error page
- Custom not-found page

## 4) Route Inventory (Page Routes)

Public:
- /
- /auth/signin
- /unauthorized

Authenticated app:
- /dashboard
- /bookings
- /bookings/new
- /catalog/machines
- /catalog/machines/[id]
- /catalog/materials
- /catalog/materials/[id]
- /projects
- /projects/new
- /projects/[id]
- /projects/[id]/bom/new
- /projects/[id]/bom/[bomId]
- /notifications
- /mentor/availability (mentor/admin)

Admin:
- /admin/users
- /admin/training
- /admin/material-requests
- /admin/analytics
- /admin/purchase-orders
- /admin/machines/new
- /admin/machines/[id]/edit
- /admin/materials/new
- /admin/materials/[id]/edit

## 5) Known Gaps / Partial Areas

- Purchase Orders is intentionally placeholder-only ("Coming Soon").
- SMTP email provider path is currently a stub (no transport integration).
- Material request UI does not expose an "Issue" action for PARTIALLY_ISSUED rows, although backend supports issuing from PARTIALLY_ISSUED.
- In availability creation, admins can access mentor availability pages but new slots are created for session.user.id, not an arbitrary mentor.
- NotificationType enum is reused for some project events with TRAINING_COMPLETED as fallback semantic type.

## 6) Overall Status

Core makerspace workflows are implemented end-to-end for authentication, booking, project/BOM management, approvals, inventory issuing, training, notifications, and analytics.
Primary unfinished functional area is purchase order lifecycle management.
