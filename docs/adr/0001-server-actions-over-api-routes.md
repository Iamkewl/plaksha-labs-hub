# ADR-0001: Server Actions over API Routes

- **Status:** Accepted
- **Date:** 2026-05-20
- **Deciders:** Plaksha Labs Hub team

## Context

The original Makerspace app used Next.js server actions (`"use server"`) for all reads and writes. The only `app/api/*` route is the NextAuth handler. Several pre-existing actions live in `src/app/actions/` (bookings, projects, materials, machines, ...).

As we add Labs Hub features (checkouts, procurement, asset CRUD) we need to decide whether to continue with server actions or introduce REST API routes.

## Decision

**Continue using server actions as the primary read/write surface.** Reserve `app/api/*` for:

- NextAuth (already there)
- Webhooks from third parties
- Future mobile-app or external-system consumers

## Consequences

Positive:

- Eliminates manual fetch/serialization boilerplate; server actions are called as typed functions from server and client components.
- Single source of truth for auth and validation (`requireAuth` + Zod) — no separate request parsing.
- `revalidatePath` integrates cleanly with the App Router cache.

Negative:

- Server actions are tightly coupled to Next.js; if we ever extract the API, we will need to wrap actions in route handlers.
- Harder to call from non-Next clients during the transition.

Neutral:

- Form submissions and `useTransition`-based mutations both work; choose per-feature.

## Alternatives considered

- **Full REST under `/api`** — clearer separation but doubles the boilerplate for auth, validation, and cache invalidation, and adds a serialization hop for in-app calls.
- **tRPC** — strong typing across boundaries, but adds a dependency and a router layer we do not currently need.
