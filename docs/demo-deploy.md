# Demo Deployment Runbook — Vercel + Neon

Concise steps to deploy and seed the Plaksha Labs Hub demo on Vercel (Next.js 14)
with a Neon PostgreSQL database.

---

## 1. Required Vercel Environment Variables

Set these in the Vercel project dashboard under **Settings > Environment Variables**
(target: Production + Preview, or Production only for the live demo).

| Variable | Value / Notes |
|---|---|
| `DATABASE_URL` | Neon **pooled** connection string (pgbouncer) — used by Prisma at runtime |
| `DIRECT_URL` | Neon **direct** (un-pooled) connection string — used by Prisma for migrations |
| `AUTH_SECRET` | Random 32-byte base64 string — generate with `openssl rand -base64 32` |
| `AUTH_URL` | Full public URL of the deployment, e.g. `https://plaksha-labs-hub.vercel.app` |
| `AUTH_DEV_BYPASS` | `false` in production |
| `AUTH_CREDENTIALS_ENABLED` | `true` — enables email+password login for the demo accounts |
| `NEXT_PUBLIC_AUTH_CREDENTIALS_ENABLED` | `true` |
| `SEED_ALPHA_PASSWORD` | Password used when seeding demo accounts (default: `AlphaTest@123`). Set this **before** running the seed; all demo accounts will use this password. |

> Microsoft Entra ID vars (`AUTH_MICROSOFT_ENTRA_ID_*`) are optional for the demo;
> leave them unset to skip SSO.

---

## 2. Apply Schema and Seed Against the Production Database

Run these commands from your local shell with the production credentials exported.
**This writes to the live Neon database — confirm you are targeting the correct project.**

```bash
# Export production credentials (replace with your actual values)
export DATABASE_URL="postgresql://user:password@ep-xxx.neon.tech/dbname?sslmode=require"
export DIRECT_URL="postgresql://user:password@ep-xxx.neon.tech/dbname?sslmode=require"
export SEED_ALPHA_PASSWORD="AlphaTest@123"

# Apply schema (creates / updates all tables; safe to re-run)
npx prisma db push

# Seed demo data (idempotent — safe to re-run; existing rows are upserted or skipped)
npm run db:seed
```

> On Windows PowerShell, use `$env:DATABASE_URL = "..."` syntax instead of `export`.

---

## 3. Demo Login Accounts

All accounts are created (or updated) by the seed with the password set in
`SEED_ALPHA_PASSWORD` at seed time (default: **AlphaTest@123**).

| Role | Email | Notes |
|---|---|---|
| Admin / Lab Manager | `admin@plaksha.edu.in` | Full admin access; approves BOMs and material requests |
| Mentor | `rajesh.kumar@plaksha.edu.in` | Assigned mentor for Smart Campus Weather Station |
| Mentor | `priya.sharma@plaksha.edu.in` | Available Tue/Thu mornings |
| Student (Lead) | `arjun.patel@plaksha.edu.in` | Lead on Weather Station; can raise allocation requests immediately (BOM v1 pre-approved) |
| Student (Lead) | `sneha.reddy@plaksha.edu.in` | Lead on Autonomous Line-Follower Robot (no-mentor project; LEAD-approval path demo) |
| Student | `vikram.singh@plaksha.edu.in` | Member on Line-Follower Robot |
| Student | `ananya.gupta@plaksha.edu.in` | Member on Weather Station |

### Demo flow from login

1. Log in as **arjun.patel@plaksha.edu.in** — the Weather Station project already has an
   APPROVED BOM (v1), so Arjun can immediately raise a material allocation request.
2. Log in as **sneha.reddy@plaksha.edu.in** — demonstrates the no-mentor fallback path:
   the Line-Follower Robot BOM was approved by the project LEAD (Sneha) rather than a mentor.
3. Log in as **admin@plaksha.edu.in** to approve allocation requests, view the low-stock
   widget, and manage the catalog.
