# Demo Runbook — Makerspace Priority Features (5–7 min)

> Setup and credentials: see **docs/demo-deploy.md**. All accounts use the password set in `SEED_ALPHA_PASSWORD` (default: `AlphaTest@123`).

## Prereqs

Deployed and seeded per docs/demo-deploy.md. Have **3 browser sessions** ready:
- Session A — student **Arjun Patel** (`arjun.patel@plaksha.edu.in`)
- Session B — mentor **Rajesh Kumar** (`rajesh.kumar@plaksha.edu.in`)
- Session C — admin **Lab Manager** (`admin@plaksha.edu.in`)

---

## Scene 1 — Public entry: Explore Labs (~45 s)

_No login needed. Use any browser._

1. Navigate to `/labs`.
2. Point out the filter chips: **All** / **Open now** / **Has divisions**. Click each to show live filtering.
3. Click the **Plaksha Makerspace** card to open `/labs/makerspace`.
4. Walk through the tabs — **Overview** (highlights), **Hours** (Mon–Sat times), **Contact & Location** (Building A, Rooms 101-105).
5. Say: "This is the public-facing entry point — no sign-in required."

---

## Scene 2 — Student Arjun Patel: catalog + BOM + allocation request (~2 min)

_Switch to Session A. Sign in as `arjun.patel@plaksha.edu.in`._

1. After sign-in, land on **`/dashboard`** — note the overview stats and project cards.
2. Click **Machines Catalog** in the sidebar → `/catalog/machines`.
   - Show the machine list with **category filters**, status badges (Available / In Use / Maintenance), and **cost-per-hour** visible on each card.
3. Click **Available Inventory** → `/catalog/materials`.
   - Show materials with **unit cost** (e.g. PLA Filament White ₹1,200/kg, Arduino Uno R3 ₹450/piece).
4. Click **My Projects** → `/projects`.
5. Open **"Smart Campus Weather Station"** → `/projects/{id}`.
6. Click **BOM v1** (status: APPROVED) → `/projects/{id}/bom/{bomId}`.
   - Point out the items table: **PLA Filament (White) — 2 kg × ₹1,200 = ₹2,400** and **Arduino Uno R3 — 3 pcs × ₹450 = ₹1,350**. Total: **₹3,750**.
   - Emphasise the per-item **Unit Cost** and **Subtotal** columns, plus the bold **Total** row.
7. Scroll to the **"Allocate Materials Under This BOM"** card (visible because BOM is APPROVED and Arjun is a member).
   - Select **PLA Filament (White)** from the dropdown, enter quantity **1**, add optional notes, click **Submit Allocation Request**.
   - Page refreshes; the new request appears in the **Material Requests** table below with status `PENDING BOM APPROVAL`.

---

## Scene 3 — Mentor Rajesh Kumar: approve at BOM stage (~1 min)

_Switch to Session B. Sign in as `rajesh.kumar@plaksha.edu.in`._

1. Click **Material Reviews** in the sidebar → `/mentor/material-requests`.
   - The inbox shows Arjun's request: project "Smart Campus Weather Station", BOM v1, material, quantity.
2. Click the **Review** link (or click the project name) → opens the same `/projects/{id}/bom/{bomId}` page.
   - Rajesh sees the **Approve** / **Reject** buttons in the Actions column (he is the assigned mentor).
3. Click **Approve**.
   - Status advances to `PENDING ADMIN APPROVAL`. The request disappears from Rajesh's inbox.

---

## Scene 4 — Admin Lab Manager: approve quantity + issue (~1 min)

_Switch to Session C. Sign in as `admin@plaksha.edu.in`._

1. Click **Material Requests** in the sidebar → `/admin/material-requests`.
   - Default filter shows **PENDING ADMIN APPROVAL** requests. Arjun's request is listed.
2. In the **Actions** column, enter the approved quantity and click **Approve**.
3. Click **Issue** (appears after approval).
   - Status advances to `ISSUED`; stock decrements on the material.
4. Optional: click the **ISSUED** filter chip to confirm the request moved to the Issued queue.

---

## Scene 5 — Fallback highlight: LEAD-approval path (~45 s)

_Still in Session A (Arjun) or open a new session as `sneha.reddy@plaksha.edu.in`._

1. Navigate to `/projects` and open **"Autonomous Line-Follower Robot"**.
   - Point out: **No mentor assigned** (Mentor field is blank).
2. Open its **BOM v1** (status: APPROVED).
   - The approver line reads: *"Approved by Sneha Reddy"* — the project LEAD, not a faculty mentor.
3. Explain: "When no mentor is assigned, the system automatically routes BOM-level approvals to the project LEAD. The admin stage still follows normally."
4. If a material request is submitted here, the **Material Reviews** inbox shows the request to **Sneha Reddy** (`sneha.reddy@plaksha.edu.in`) rather than to any mentor.

---

## DO NOT OPEN on stage

| URL | Reason |
|---|---|
| `/admin/purchase-orders` | Coming Soon — shows placeholder card only |
| `/admin/labs` — Add / Edit / View buttons | Deliberately disabled (coming soon) |
| Any email confirmation dialog | Email transport is a stub; no mail is sent |
| `/auth/signup` Microsoft sign-in button | Labelled "coming soon" on the signup page |
| `/dashboard/checkouts` ("My Checkouts" in sidebar) | Shows placeholder data with fake names ("Arduino Starter Kit", etc.) on a fresh seed |
| `/admin/requests` | Placeholder mock data ("John Doe", "Jane Smith") — use `/admin/material-requests` instead (live, DB-backed) |
| `/dashboard/bookings` | Placeholder mock data ("Dr. Sarah Chen") — use `/bookings` instead |
| `/dashboard/training` | Placeholder mock data — machine names don't match the seeded catalog |

---

## Quick credential reference

| Role | Email | Notes |
|---|---|---|
| Admin / Lab Manager | `admin@plaksha.edu.in` | Scene 4 |
| Mentor | `rajesh.kumar@plaksha.edu.in` | Assigned to Weather Station; Scene 3 |
| Student (Lead) | `arjun.patel@plaksha.edu.in` | Lead on Weather Station; Scene 2 |
| Student (Lead) | `sneha.reddy@plaksha.edu.in` | Lead on Line-Follower Robot; Scene 5 |

All passwords: value of `SEED_ALPHA_PASSWORD` (default `AlphaTest@123`) — see docs/demo-deploy.md.
