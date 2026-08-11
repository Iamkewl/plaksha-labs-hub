# Demo Mode & UI Polish — Implementation Walkthrough

This document explains everything that was added or changed to ship
**Task 1 (Interactive Demo / Sandbox Mode)** and **Task 2 (UI/UX
Audit & Minor Tweaks)** for Plaksha Labs Hub.

> TL;DR — A self-contained `/demo` route with a floating control
> panel, a guided 4-step walkthrough, a fully-sandboxed data store
> that lives only in the user's browser, plus a polished
> `EmptyState` component and unified `StatusBadge` system that
> replaced ad-hoc styling across the real app.

---

## 1. Architecture overview

### What ships

| Surface | URL | Audience | Persistence |
|---|---|---|---|
| Demo landing | `/demo` | Anonymous visitors + signed-in users | `localStorage` |
| Demo project | `/demo/projects` | Guided step 1 + 4 | `localStorage` |
| Demo bookings | `/demo/bookings` | Guided step 3 | `localStorage` |
| Demo machine catalog | `/demo/catalog` | Free exploration | `localStorage` |
| Demo inventory | `/demo/inventory` | Guided step 2 | `localStorage` |
| Floating control panel | Always visible | Toggle / reset | `localStorage` |
| Top banner | Visible while `isActive` | Confirms "sandboxed" | n/a |

The demo **never** writes to PostgreSQL. Every mutation goes through
`mutateDemoState` (in `src/lib/demo/demo-store.ts`), which patches an
in-memory object and mirrors it to `localStorage` so refresh keeps the
state.

### Why a separate `/demo` route

- Zero risk of demo data leaking into the real Prisma tables.
- The real `(app)` route group (which calls `requireAuth()`) stays
  untouched — no conditional branching, no edge cases.
- The route group `(public)` already wraps pages with the existing
  `PublicNav` / `PublicFooter`, so navigation feels native.
- A side-rail `DemoSideRail` adds demo-specific navigation without
  having to fork the global layout.

### Why a client-side store + `useSyncExternalStore`

- `useSyncExternalStore` is React 18's official primitive for
  subscribing to an external store with a deterministic
  server/client snapshot. We use the canonical seed as the server
  snapshot, and a `localStorage`-hydrated copy as the client
  snapshot.
- This avoids `useEffect`-driven hydration warnings and means the
  first paint always matches.
- Mutations are O(1) — `useSyncExternalStore` re-renders only the
  components that read the changed slice via `useDemoState()`.

---

## 2. Files added

### Core demo data layer

```
src/lib/demo/
├── demo-types.ts      # TypeScript shapes + the 4-step checklist
├── demo-data.ts       # getInitialDemoState() — canonical seed
└── demo-store.ts      # useSyncExternalStore-backed singleton store
                       # + useDemo() hook + mutation helpers
```

**`demo-data.ts`** ships a realistic sample project called
*Autonomous Robotics Prototype* with:
- 1 demo project, 6 milestones, 3 team members
- 8 demo machines (3D printers, laser cutter, CNC mill, oscilloscope,
  soldering station, UR5e)
- 9 demo materials (PLA, plywood, resin, bearings, screws, ESP32,
  steppers, wire)
- 5 demo bookings across all status types
- 3 demo BOM line items per material

### UI components

```
src/components/demo/
├── DemoProvider.tsx       # Root provider — hydrates + renders
│                          # DemoBanner + DemoFloatingPanel
├── DemoBanner.tsx         # Top amber banner shown while active
├── DemoFloatingPanel.tsx  # Bottom-right pill → expandable panel
├── DemoChecklist.tsx      # 4-step guided walkthrough
└── DemoSideRail.tsx       # Side nav inside /demo/*
```

### `/demo` route

```
src/app/(public)/demo/
├── layout.tsx              # Side rail + max-w container
├── page.tsx                # Landing — overview + KPIs + checklist
├── projects/page.tsx       # Single project deep-dive
├── bookings/page.tsx       # Bookings table + new-booking drawer
├── catalog/page.tsx        # Machine catalog with book action
└── inventory/page.tsx      # Materials grid with reserve action
```

### Reusable UI primitives

```
src/components/ui/
├── empty-state.tsx         # Reusable empty state (3 variants)
└── status-badge.tsx        # Centralized status pill + icon mapping
```

---

## 3. Files modified

| File | Change |
|---|---|
| `src/components/providers.tsx` | Wrap children in `<DemoProvider>` so the floating panel is everywhere |
| `src/components/public/PublicNav.tsx` | Add a "Try Demo" link (desktop + mobile) with amber accent |
| `src/components/public/Hero.tsx` | Add a third amber "Try the demo" CTA in the hero |
| `src/components/shell/nav-config.ts` | Add a "Try the Demo" entry in the signed-in sidebar (`globalItems`) |
| `src/app/(app)/bookings/page.tsx` | Replace ad-hoc status `Badge` map with `<StatusBadge>` + use `<EmptyState>` |
| `src/app/(app)/projects/page.tsx` | Use `<EmptyState>` with a "Tour a sample project" secondary CTA |
| `src/app/(app)/catalog/machines/page.tsx` | Use `<EmptyState>` + `<StatusBadge>` |
| `src/app/(app)/catalog/materials/page.tsx` | Use `<EmptyState>` |
| `src/components/forms/booking-form.tsx` | Add `toast()` success / error feedback around `createBooking` |

---

## 4. How to wire it up

### Already done

- `<DemoProvider>` is mounted in the global `Providers` component, so
  the floating panel + banner show on **every** page.
- "Try Demo" entry points exist in three places: public nav, public
  hero, signed-in sidebar.
- `localStorage` keys:
  - `plaksha-demo-state-v1` — the demo dataset
  - `plaksha-demo-active-v1` — `1` / `0` toggle flag

### To extend (e.g. add a 5th walkthrough step)

1. Add a new `DemoChecklistKey` literal to `src/lib/demo/demo-types.ts`.
2. Append a step object to the exported `DEMO_CHECKLIST` array.
3. Optionally, call `markStep("your_key")` from the relevant
   `/demo/...` page on first interaction.
4. Optionally, reset the new key in `getInitialDemoState()`.

### To reset demo data from anywhere

```ts
import { resetDemoState } from "@/lib/demo/demo-store";
// ... anywhere in a client component
<Button onClick={resetDemoState}>Reset demo</Button>
```

### To branch server actions on demo mode (optional)

The current implementation does **not** branch server actions —
mutations only happen in the `/demo` route, where the data is
client-only. If you later want to run the real server actions but
back them with sandbox data, follow this pattern:

```ts
// src/app/actions/your-thing.ts
"use server";
import { isDemoActive } from "@/lib/demo/demo-store"; // client-only
// ❌ Don't import client modules into server actions.
```

Instead, expose demo flag via a request header / cookie set by the
client, and short-circuit at the top of the action. We left this
out by design — the demo is its own route, not a re-skin of the real
app.

---

## 5. UI/UX polish — what changed and why

### 5.1 Reusable `EmptyState`

Three variants (`default`, `ghost`, `dashed`), each with:
- An icon bubble (primary tint, ring-1)
- Title + description
- Optional primary + secondary action (with icon + variant)
- Optional footer slot for tips

Used in:
- `/bookings` — "No upcoming bookings" with primary CTA `+ New
  booking` and secondary `⚗ Try the demo`
- `/projects` — "No projects yet" with primary `+ Create project`
  and secondary `⚗ Tour a sample project`
- `/catalog/machines` — "No machines found" with `⚗ Tour the demo
  catalog`
- `/catalog/materials` — "No materials found" with `⚗ Tour the demo
  inventory`
- Inside `/demo/*` — every list view also uses it (filtered to
  empty, etc.)

### 5.2 Centralized `StatusBadge`

Replaces 4+ duplicated `statusColors: Record<string, BadgeVariant>`
maps scattered across `bookings/page.tsx`, `bookings/new`,
`catalog/machines`, admin pages, etc.

Single source of truth in `src/components/ui/status-badge.tsx`:
- Maps every status enum from `prisma/schema.prisma` to:
  - A Tailwind colour variant (`success` / `info` / `warning` /
    `danger` / `neutral` / `brand`)
  - A default Lucide icon
  - A friendly label (with a `prettify()` fallback)
- Component is a span, not the old `<div>` Badge — so it sits
  nicely inline with table cells.

### 5.3 Toast feedback

`useToast` was already wired (it lives at `src/hooks/use-toast.ts`).
The `<Toaster />` is mounted in `(app)/layout.tsx`, but no form
called `toast()`. Now:
- `booking-form.tsx` shows a success toast on create + a destructive
  toast on error.
- The demo pages toast on every mutation (book, reserve, toggle
  milestone, reset) so users immediately see their action took
  effect.

### 5.4 Mobile / responsive

- `DemoFloatingPanel` uses `w-[360px] max-w-[calc(100vw-2rem)]` and
  is anchored bottom-right.
- `DemoSideRail` is hidden on `< lg`, so mobile users still see the
  content fully.
- `BookingsTable` and the BOM table both wrap in `overflow-x-auto`,
  so wide tables scroll horizontally on small screens.
- Empty states use `flex-wrap` so the CTAs don't overflow.
- PublicNav already had a mobile hamburger — we added the "Try Demo"
  item to that menu.

### 5.5 Visual consistency

- New components use the existing token system:
  - Teal primary — `hsl(182 80% 32%)` / `bg-primary/15`
  - Card borders — `border-white/10`
  - Hover lift — `hover:shadow-tile-lift` and the `-translate-y-0.5`
    micro-interaction that the project already uses
  - Shadow scale — `shadow-[0_18px_42px_-32px_rgba(0,0,0,0.6)]` on
    bigger cards
- Demo accent — `amber-400` (`#FBBF24`) chosen so the demo chrome
  never visually clashes with the brand teal.

---

## 6. Testing notes

```bash
# typecheck
npx tsc --noEmit
# → clean

# lint
npx next lint
# → no warnings or errors

# build
npx next build
# → 5 demo routes pre-rendered as static
```

### Manual checklist

- [ ] Click `Try Demo` in public nav → land on `/demo` → floating
  pill changes to "Demo Mode · 0/4"
- [ ] Click `Start tour` → pill badge updates as you visit each step
- [ ] On `/demo/projects` toggle a milestone → banner toast + progress
  bar moves + status auto-derives (`ACTIVE` → `BUILD` → `REVIEW` →
  `SHIPPED`)
- [ ] On `/demo/inventory` click `Reserve 1 unit` → stock decrements
  + toast
- [ ] On `/demo/catalog` click `Book` → drawer opens → confirm →
  toast + appears in `/demo/bookings`
- [ ] Click `Reset demo` in floating panel → all stock, milestones,
  and bookings snap back
- [ ] Refresh the page → state persists (because of localStorage)
- [ ] Click `Exit demo` → banner disappears, pill reverts to "Try
  Demo"
- [ ] Real `/bookings` page when empty now shows the
  `<EmptyState>` with both the primary "New booking" and secondary
  "Try the demo" actions
- [ ] Real `/catalog/machines` machine card status is now the
  consistent `<StatusBadge>` (teal = available, sky = in use, amber
  = maintenance)

---

## 7. Future work (not in this PR)

- **Replay mode** — record a visitor's clicks and replay them as a
  recorded screencast.
- **Sandbox schema** — currently the demo lives in localStorage; if
  you want a server-side multi-user demo (e.g. for sales demos),
  add a `labId = "DEMO"` and a Prisma seed in `prisma/seed.ts` that
  uses it.
- **Deep-link to step** — `?step=reserve_inventory` could open the
  panel and scroll to that step.
- **Demo tour analytics** — fire a single `fetch` per step complete
  to measure funnel.
- **Internationalize** — all copy is in `lib/demo/demo-types.ts` so
  the four step descriptions are easy to swap into other languages.

---

## 8. What I deliberately did NOT touch

- The Prisma schema — no migration was needed.
- Auth — NextAuth flow is unchanged.
- The Once UI theme provider — the demo uses the same
  `ThemeProvider` as the rest of the app.
- Real booking / project / inventory flows — only their *empty
  states* and *status badges* were re-styled. The data layer is
  untouched.
- The mobile sidebar — already has a slide animation and works
  well; left alone.

If you want me to take this further — e.g. add a "sandbox schema"
in Prisma, deep-link a specific demo step, or wire the demo into
the admin analytics — happy to follow up.
