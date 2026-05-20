# Architecture

## High-level

Plaksha Labs Hub is a **Next.js 14 App Router** monolith. It serves:

- A public marketing surface (`/`, `/labs`, `/labs/[slug]`) for unauthenticated visitors.
- An authenticated student/mentor/admin app (`/dashboard`, `/labs/robotics/dashboard`, `/admin`, `/bookings`, `/projects`, `/catalog`).

The same Next process handles SSR, static generation, server actions, and the NextAuth route. There is no separate API service.

## Sitemap

```
/                                  public landing
/labs                              explore labs (public)
/labs/[slug]                       lab detail (public; supports /labs/makerspace, /labs/robotics)
/auth/signin                       sign-in
/auth/error                        auth error

(app) — protected by middleware
/dashboard                         student home
/dashboard/bookings                my bookings
/dashboard/checkouts               my checkouts
/dashboard/projects                my projects
/dashboard/training                my certifications
/bookings, /bookings/new           legacy booking views
/catalog/machines, /catalog/materials   discovery
/projects, /projects/[id]          project workspace
/labs/robotics/dashboard           robotics lab dashboard (Mechanical/Electronics/Shared tabs)
/admin                             admin overview
/admin/labs                        lab management
/admin/assets                      asset inventory
/admin/requests                    procurement queue
/admin/{machines,materials,users,training,analytics,...}   legacy admin
/mentor/availability               mentor self-service
/notifications                     in-app notifications
```

## Layered structure

```
src/
├── app/
│   ├── (public)/       unauthenticated routes (landing, /labs)
│   ├── (app)/          authenticated routes — middleware-guarded
│   ├── actions/        "use server" server actions (the real API surface)
│   ├── api/            NextAuth route handler only
│   └── auth/           sign-in / error pages
├── components/
│   ├── ui/             shadcn-style Radix primitives (button, card, table, ...)
│   ├── once-ui/        motion / reactive elements
│   ├── public/         landing + nav
│   ├── labs/           lab explore + detail
│   ├── dashboard/      student dashboard
│   ├── robotics/       robotics lab dashboard
│   ├── admin/          admin shell
│   └── app-shell.tsx   authed sidebar layout
├── lib/
│   ├── auth.ts, auth-guard.ts   NextAuth v5 config + requireAuth/requireRole
│   ├── prisma.ts                shared PrismaClient
│   ├── validations.ts           Zod schemas
│   ├── notifications.ts         in-app notifs
│   ├── rate-limit.ts            request throttling
│   └── placeholder/             temporary in-memory data — swap for Prisma
└── middleware.ts       role-based route gating
```

## Data flow

1. **Read path** — server components call server actions in `src/app/actions/*` which use the shared Prisma client.
2. **Write path** — client components import a server action and call it from a transition. Server action runs `requireAuth` / `requireRole`, validates with Zod, mutates via Prisma, then `revalidatePath`.
3. **No REST/RPC layer.** API routes (`/api/*`) are reserved for NextAuth.

## Auth

- **NextAuth v5 (beta.25)** with three providers: Credentials, Microsoft Entra ID, and a dev bypass.
- JWT session strategy with role on the token. `middleware.ts` decodes the token and refreshes role from DB on each request to handle role changes mid-session.
- Guards: `requireAuth()` for any signed-in user, `requireRole(...roles)` for role-gated pages.

## Multi-lab model

- A `Lab` row owns `LabDivision`s (e.g. Mechanical, Electronics) and `LabRole`s (per-user per-lab membership).
- Resources are partitioned by `labId` (nullable on legacy tables `Machine`, `Material`, `Booking`, `Project`, `MaterialRequest`).
- New resource types (`Asset`, `InventoryItem`, `Checkout`, `ProcurementRequest`) are lab-scoped from day one.

See [data-model.md](./data-model.md) for the field-level breakdown.

## Build & runtime

- Node 20+, Next 14.2.21, Prisma 6.2.1, Postgres.
- `npm run dev` for local. `npm run build` for prod bundle.
- Dynamic routes use `force-dynamic` when they read auth/searchParams.
