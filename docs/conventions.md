# Conventions

## Routes

- Use `(public)` for unauthenticated pages and `(app)` for authed pages. Middleware guards `(app)` via path prefix matching.
- Co-locate `layout.tsx` per feature folder when the feature has its own subnav (see `dashboard/`, `admin/`).
- If a page uses `useSearchParams`, wrap the client component in `<Suspense>` from a server wrapper and set `export const dynamic = "force-dynamic"`.

## Data access

- **Server actions only** for mutations and most reads. Put them in `src/app/actions/<feature>.ts` and prefix the file with `"use server"`.
- Validate every input with Zod before touching Prisma.
- Call `requireAuth()` or `requireRole(...)` at the top of every action.
- `revalidatePath(...)` for the affected route after writes.
- Do not introduce REST API routes unless the consumer is external (mobile, webhook).

## UI

- Compose from `src/components/ui/*` (Radix + cva). Do not bring in additional UI libraries.
- Motion lives in `src/components/once-ui/reactive-elements.tsx`. Use `ReactiveReveal` and `ReactiveMetric` rather than ad-hoc Framer Motion.
- All interactive elements need focus-visible rings and accessible labels.
- Tailwind tokens are in `tailwind.config.ts`. Prefer semantic tokens (`bg-card`, `text-muted-foreground`) over raw colors.

## Adding a lab

1. Insert a `Lab` row (slug, name, description) via seed or admin.
2. (Optional) Insert `LabDivision` rows for sub-organization (e.g. Mechanical/Electronics).
3. Add resources with `labId` set.
4. Create lab-specific pages under `src/app/(app)/labs/<slug>/...` if the lab needs custom dashboards beyond the generic `/labs/[slug]` detail page.
5. Add the lab to the public navigation via `src/lib/placeholder/labs.ts` (until Lab queries are wired) or the corresponding action.

## Adding a server action

```ts
// src/app/actions/checkouts.ts
"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";
import { createCheckoutSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function createCheckout(input: unknown) {
  const session = await requireAuth();
  const data = createCheckoutSchema.parse(input);
  const checkout = await prisma.checkout.create({ data: { ...data, userId: session.user.id } });
  revalidatePath("/dashboard/checkouts");
  return checkout;
}
```

## Commits

Use Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`). Scope with the feature folder when useful (`feat(labs-hub):`, `fix(auth):`).

## Testing

(TBD — no test suite yet. Add Vitest when introducing test coverage.)
