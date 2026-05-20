# Design

## Figma reference

Drop in:

- The Figma file link in `figma-link.md`
- PNG exports of key frames in `figma-exports/` named like `landing.png`, `labs-explore.png`, `lab-detail.png`, `dashboard.png`, `robotics-dashboard.png`, `admin.png`.

When the Figma Dev Mode MCP server is running locally, the agent can pull frames directly without exports.

## Design tokens

Defined in:

- `tailwind.config.ts` — color palette, spacing, radius, font sizes
- `src/app/globals.css` — CSS variables for light/dark (HSL token system)

When in doubt, use semantic tokens (`bg-card`, `text-muted-foreground`, `border-border`) over raw values.

## Motion

Use `ReactiveReveal` and `ReactiveMetric` from `src/components/once-ui/reactive-elements.tsx`. Avoid introducing Framer Motion directly unless a primitive does not cover the case.

## Component inventory

See [`src/components/ui/`](../../src/components/ui) for available primitives. Before building a new one, check if a Radix-based primitive can be composed.

## Accessibility checklist (per surface)

- [ ] Focus-visible rings on all interactive elements
- [ ] `aria-current="page"` on the active nav item
- [ ] Color contrast ≥ 4.5:1 for body text
- [ ] Form fields have associated labels
- [ ] Skip-to-content link on long pages
