# Deployment

## Environments

| Env | URL | Branch | DB |
| --- | --- | --- | --- |
| local | http://localhost:3000 | any | local Postgres or hosted dev DB |
| staging | TBD | `master` (auto) | hosted Postgres |
| production | TBD | tag-based release | hosted Postgres |

## Environment variables

| Var | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | yes | Postgres connection string |
| `NEXTAUTH_SECRET` | yes | JWT signing secret |
| `NEXTAUTH_URL` | yes (prod) | Canonical app URL |
| `AZURE_AD_CLIENT_ID` | optional | Entra ID SSO |
| `AZURE_AD_CLIENT_SECRET` | optional | Entra ID SSO |
| `AZURE_AD_TENANT_ID` | optional | Entra ID SSO |
| `EMAIL_FROM` | optional | Outbound transactional email sender |
| `RESEND_API_KEY` | optional | Email provider key |
| `DEV_AUTH_BYPASS` | dev only | Set to `true` to enable the dev provider |

## First-time setup

```bash
npm install
npx prisma generate
npx prisma migrate deploy   # applies prisma/migrations/*
npx prisma db seed          # idempotent for new multi-lab data; fails if Makerspace seed already ran
npm run build
npm start
```

## Subsequent deploys

```bash
git pull
npm install
npx prisma migrate deploy
npm run build
# restart node process
```

## Pre-deploy checklist

- [ ] `npm run build` succeeds locally
- [ ] `npx prisma migrate dev --create-only` produces an empty diff (schema and migrations are in sync)
- [ ] All new env vars are set in the target environment
- [ ] Manual smoke test of: sign-in, dashboard load, create booking, view lab page

## Known issues

- NextAuth v5 beta emits `jose`/`edge-runtime` warnings during `next build` — non-blocking, will resolve when v5 stable lands.
- `makerspace-projects` page errors at build time without `DATABASE_URL` set in the build env. Use `--no-lint` and ensure DB is reachable from the build container, or skip prebuild for that route.
