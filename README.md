# Project

This folder is intentionally separated from the agent control plane for easy sharing.

## Populate Vercel With Dummy Data

The app already has a Prisma seed at `prisma/seed.ts` and an npm script:

- `npm run db:seed`

Use this from your local machine to populate the same Neon database used by Vercel.

### Windows PowerShell

1. Copy `DATABASE_URL` from Vercel Project Settings -> Environment Variables.
2. Run:

```powershell
Set-Location "d:\Downloads\Inventory-local-dev-auth\project"
$env:DATABASE_URL = "<your-vercel-database-url>"
$env:SEED_ALPHA_PASSWORD = "AlphaTest@123"
npm run db:seed
```

### What it creates

- Demo users for ADMIN, MENTOR, STUDENT roles
- Machines and materials catalog data
- Training records
- Mentor availability
- Sample project and bookings

### Demo login after seeding

- Email: `admin@plaksha.edu.in`
- Password: `AlphaTest@123` (or your `SEED_ALPHA_PASSWORD`)
