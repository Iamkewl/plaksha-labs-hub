# Deploying Plaksha Labs Hub to Vercel

Path chosen: **Neon Postgres + credentials auth + Vercel auto-subdomain**.

Total time: ~20–30 min.

---

## 1. Provision the database (Neon) — 5 min

1. Go to <https://console.neon.tech> → **Sign up with GitHub**.
2. Create a project:
   - **Name:** `plaksha-labs-hub`
   - **Postgres version:** 16 (default)
   - **Region:** `AWS Asia Pacific (Mumbai)` — closest to Plaksha
3. After creation Neon shows a connection string that looks like:
   ```
   postgresql://USER:PASSWORD@ep-XXXX.ap-south-1.aws.neon.tech/neondb?sslmode=require
   ```
   **Copy it — you'll paste it into Vercel in step 3.** Keep this tab open; you'll grab a second pooled URL in a moment.

4. In Neon's left nav click **Connection Details** → toggle **Pooled connection**. Copy the pooled URL (it ends with `-pooler.ap-south-1...`). This is what the app uses at runtime; the un-pooled URL is what Prisma migrations use.

You now have **two** URLs:
- `DATABASE_URL` → the **pooled** connection
- `DIRECT_URL` → the **un-pooled** connection (Neon shows this when you toggle Pooled off)

---

## 2. Tell Prisma about the direct URL — 2 min

Open `prisma/schema.prisma`. The `datasource db` block needs a `directUrl` so migrations run against the un-pooled endpoint. Find this block:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Change it to:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

Commit + push this change before the Vercel deploy:

```bash
git add prisma/schema.prisma
git commit -m "chore(prisma): add directUrl for Neon pooled deployments"
git push
```

---

## 3. Create the Vercel project — 5 min

1. Go to <https://vercel.com/new>. Sign in with GitHub.
2. Click **Import** next to `Iamkewl/plaksha-labs-hub`.
3. **Framework Preset:** Vercel auto-detects Next.js. Leave it.
4. **Root Directory:** leave as `./`.
5. **Build & Output Settings:**
   - Build command: leave default (`next build`) — `postinstall: prisma generate` already handles Prisma client generation.
   - Install command: leave default (`npm install`).
6. **Environment Variables** — click **Add**:

| Name | Value | Notes |
|---|---|---|
| `DATABASE_URL` | pooled Neon URL from step 1 | Required |
| `DIRECT_URL` | un-pooled Neon URL from step 1 | Required for migrations |
| `AUTH_SECRET` | `2hZxHRstWU/ZptuymsokA+Nfz6dkZDRYbmkglPrVDww=` | Pre-generated for this prototype |
| `AUTH_URL` | leave blank for now | Fill in after the first deploy with the real `https://plaksha-labs-hub.vercel.app` |
| `AUTH_TRUST_HOST` | `true` | Required for NextAuth on Vercel |
| `AUTH_DEV_BYPASS` | `false` | Disables the dev shortcut buttons |
| `NEXT_PUBLIC_AUTH_DEV_BYPASS` | `false` | Same, client-side |
| `AUTH_CREDENTIALS_ENABLED` | `true` | Keeps the email+password form active |
| `NEXT_PUBLIC_AUTH_CREDENTIALS_ENABLED` | `true` | Same, client-side |
| `SEED_ALPHA_PASSWORD` | `PlakshaProto2026!` | Initial admin password — login as `admin@plaksha.edu.in` + this value |

**Login after seeding:**
- Email: `admin@plaksha.edu.in`
- Password: `PlakshaProto2026!`

(These are baked in for the prototype. Rotate before going to real users.)

7. Click **Deploy**. First build takes 3–5 min.

---

## 4. Run the initial migration + seed — 5 min

Vercel doesn't run migrations automatically. You do this **once** from your local machine, pointing at the production DB.

```bash
# Export production env locally just for this command
$env:DATABASE_URL = "<the pooled URL from Neon>"
$env:DIRECT_URL   = "<the un-pooled URL from Neon>"
$env:SEED_ALPHA_PASSWORD = "PlakshaProto2026!"

# Apply schema
npx prisma migrate deploy

# Seed initial admin + sample lab data
npx prisma db seed
```

Expected output:
- `migrate deploy` reports the migrations that were applied.
- `db seed` prints "Seeding database..." and then the rows it upserted.

Now `admin@plaksha.edu.in / <SEED_ALPHA_PASSWORD>` is the production login.

---

## 5. Verify production — 3 min

1. Open the URL Vercel gave you (e.g. `https://plaksha-labs-hub.vercel.app`).
2. Public landing should render with the teal hero, role cards, feature grid.
3. Click **Sign in** → enter `admin@plaksha.edu.in` + your seed password.
4. You should land on `/dashboard` with the teal sidebar and all admin sections accessible.
5. Try `/admin/material-requests` and click an Approve/Reject button — confirm the action completes (this is the only flow Codex marked as needing manual validation).

---

## 6. Fix the AUTH_URL — 1 min

After the first deploy, go back to **Vercel → Settings → Environment Variables**:

- Update `AUTH_URL` to the real production URL: `https://plaksha-labs-hub.vercel.app`
- Hit **Redeploy** (Deployments tab → ⋯ → Redeploy on the latest deployment)

This prevents NextAuth from misreading callback URLs in some edge cases.

---

## Adding Microsoft Entra ID later

When Plaksha IT gives you the Azure app credentials, add three more env vars and redeploy:

```
AUTH_MICROSOFT_ENTRA_ID_ID=<client id>
AUTH_MICROSOFT_ENTRA_ID_SECRET=<client secret>
AUTH_MICROSOFT_ENTRA_ID_TENANT_ID=<tenant id>
```

The "Continue with Microsoft" button on `/auth/signin` activates automatically.

---

## Adding a custom Plaksha domain later

1. Vercel → Settings → Domains → **Add** → `labs.plaksha.edu.in`.
2. Vercel gives you a CNAME target. Plaksha IT adds the CNAME record.
3. Once DNS resolves, update `AUTH_URL` to the new domain + redeploy.

---

## Troubleshooting

- **Build fails with `prisma generate` error**: check `DATABASE_URL` is set in Vercel env vars (Prisma needs it at build time too).
- **First request takes 30s**: Neon free tier "scales to zero" after 5 min idle. First request after idle wakes the DB — this is normal. Upgrade to Neon Launch ($19/mo) to eliminate.
- **`Failed to fetch /api/auth/session`**: `AUTH_TRUST_HOST` is missing or `AUTH_URL` is wrong.
- **Sign-in succeeds but immediately bounces to /auth/signin**: cookie domain mismatch — usually `AUTH_URL` mismatch with the actual hostname. Fix env var + redeploy.
- **Slow dev compile on localhost**: expected (Once UI bundle is 4800 modules). Production is pre-compiled so this doesn't affect users.

---

## Cost expectation

| Service | Free tier covers | When you'd pay |
|---|---|---|
| Vercel Hobby | This project comfortably | If you exceed 100 GB bandwidth/mo or need team features |
| Neon Free | 3 GB storage, 1 project, scale-to-zero | If DB grows past 3 GB or you want always-on |

Demo/jury usage: $0.
