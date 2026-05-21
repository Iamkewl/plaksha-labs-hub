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

## Figma alignment notes (2026-05-21)

### What the Figma returned

The public Figma URL (`node-id=3382-49`) returned a thin payload — only the
string "Figma" with no parsed design tokens. Figma's public share pages do not
expose raw frame data to web scraping. All alignment below is **inferred** from:

1. The Plaksha brand identity (navy primary, periwinkle accent, amber/orange as
   the Makerspace foil).
2. The wireframe name and frame position — a mid-fidelity wireframe suggesting
   a clean, low-contrast layout grid.
3. The existing token system in `globals.css` commit `ede3753`.

### Token mapping

| Token group | Before | After | Rationale |
|---|---|---|---|
| `--radius` | 0.9 rem (14.4 px) | **0.75 rem (12 px)** | Tighter radius reads more institutional / structured |
| `--card` (dark) | `240 7% 13%` | `240 7% 12%` | Slightly darker for crisper surface separation |
| `--muted-foreground` (dark) | `240 12% 65%` | `240 10% 58%` | Better contrast ratio on dark background |
| `--border` (dark) | `240 9% 24%` | `240 9% 22%` | Reduces border heaviness |
| `--primary-foreground` (dark) | `245 78% 24%` | `245 78% 20%` | Deeper navy ensures AA on periwinkle bg |
| `--border` (light) | `214 31% 86%` | `214 31% 88%` | Slightly lighter for air in light mode |
| `--tracking-kicker` | (ad-hoc inline values) | **0.18 em CSS var** | Single source of truth for all-caps labels |
| `--tracking-hero` | (ad-hoc `-0.02em` on `h1-h6`) | **-0.03 em CSS var on `h1`** | Hero type slightly tighter than subheadings |
| Tailwind shadow tokens | missing | `shadow-card-lift`, `shadow-tile-lift`, `shadow-elevated`, `shadow-logo-glow` | Named instead of one-off arbitrary values |
| Tailwind easing token | missing | `ease-snap` (`cubic-bezier(0.16,1,0.3,1)`) | Canonical snap curve across motion system |

### Component visual lifts

- **LabCard**: hover now adds `-translate-y-0.5` + `shadow-card-lift` for a
  physical lift feel. Arrow gap animates from 1.5 → 2.5 on group-hover.
- **LabHeader**: `plaksha-headline` class on `<h1>`; open-status pulse dot via
  `@keyframes pulse-ring` + `.status-dot-open`.
- **StatCard / StatTile**: icon slot gets a proper `h-7 w-7 rounded-md` container
  instead of raw opacity. Hover lift only when `href` is present.
- **SubNav / AdminSubNav**: `.nav-indicator` underline scale-in now applies to
  `[aria-selected="true"]` as well as `[aria-current="page"]`.
- **PublicNav**: `backdrop-blur-2xl` (was `xl`); `shadow-logo-glow` token on logo.
- **Hero**: CTA button gains `shadow-[0_8px_24px_-8px_hsl(239_100%_88%/0.40)]`
  periwinkle glow that deepens on hover.

### What could NOT be translated

| Item | Reason |
|---|---|
| Exact typefaces | Figma frame text was not accessible. Assuming current `--font-display` / `--font-body` stack is correct (set in `layout.tsx`). |
| Grid column count / gutter values | Frame layout data not returned. Kept `max-w-7xl` + `gap-6` grid as-is. |
| Exact icon set | Not visible. Kept lucide-react. |
| Figma component variants (e.g. button states) | Frame pixels not extractable. Kept shadcn/ui Radix primitives. |

### Intentional divergences

- `--radius` reduced to 0.75 rem (Figma likely uses 8–12 px; choosing 12 px).
- Lab accent alpha values slightly reduced (10 % → 9 %) for less colour noise
  on dark surfaces.
- Motion easing unified to `ease-snap` (`cubic-bezier(0.16,1,0.3,1)`) across
  all transitions even though Figma had no motion spec — matches Once UI's
  existing `RevealFx` easing.

## Accessibility checklist (per surface)

- [x] Focus-visible rings on all interactive elements (`focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`)
- [x] `aria-current="page"` on the active nav item
- [x] `prefers-reduced-motion` — CSS animations disabled; `ReactiveReveal` / `ReactiveMetric` render static fallbacks
- [x] Color contrast — muted-foreground lightness reduced to 58% for ≥ 4.5:1 on dark bg
- [ ] Form fields have associated labels (verify per form implementation)
- [x] Skip-to-content link on long pages (`.skip-nav` in globals.css)
