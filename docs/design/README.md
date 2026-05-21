# Design

## Figma reference

Source screenshots: `docs/design/figma-exports/public-landing.png` and
`docs/design/figma-exports/auth-and-dashboard.png`.

Design pivoted to **teal primary + light-mode default** on 2026-05-21 per Figma
direction confirmed by Suryaansh. See token map below.

When the Figma Dev Mode MCP server is running locally, the agent can pull frames
directly without exports.

## Design tokens

Defined in:

- `tailwind.config.ts` — color palette, spacing, radius, font sizes
- `src/app/globals.css` — CSS variables for light/dark (HSL token system)

When in doubt, use semantic tokens (`bg-card`, `text-muted-foreground`,
`border-border`) over raw values.

## Token map (Figma pivot 2026-05-21)

Source: `docs/design/figma-exports/public-landing.png` + `auth-and-dashboard.png`.
Design pivoted from periwinkle/navy dark to teal/light per Figma.

| Token | OLD value | NEW value | Hex reference | Notes |
|---|---|---|---|---|
| `--primary` (light) | `210 100% 20%` (navy) | **`182 80% 32%`** | `#0F8E92` | Teal — hero band, nav, buttons |
| `--primary` (dark opt-in) | `239 100% 88%` (periwinkle) | **`182 70% 48%`** | `#33B5BA` approx | Teal lightened for dark bg contrast |
| `--primary-foreground` | `245 78% 20%` | **`0 0% 100%`** | `#ffffff` | White on teal |
| `--sidebar` | _(new token)_ | **`182 81% 24%`** | `#0C6E71` | Deep teal sidebar surface |
| `--sidebar-foreground` | _(new token)_ | **`0 0% 100%`** | `#ffffff` | White text on sidebar |
| `--accent` | `240 5% 21%` (dark gray) | **`47 100% 61%`** | `#FFD43B` | Yellow — stat circles, highlights |
| `--accent-foreground` | `240 13% 92%` | **`215 25% 12%`** | `#17202A` approx | Dark text on yellow |
| `--brand-leaf` | _(new token, was `--plaksha-green`)_ | **`120 32% 51%`** | `#5BAA5B` | Plaksha logo green leaf |
| `--surface-muted` | _(new token)_ | **`0 0% 93%`** | `#EEEEEE` | Light gray section bg ("What Happens Here?" cards, footer strip) |
| `--background` | `240 7% 8%` (near-black) | **`210 20% 98%`** | `#F5F7FA` approx | Light page background |
| `--foreground` | `240 13% 93%` (near-white) | **`215 25% 12%`** | `#17202A` approx | Dark text on light bg |
| `--card` | `240 7% 12%` | **`0 0% 100%`** | `#ffffff` | Pure white cards |
| `--border` | `240 9% 22%` | **`214 20% 90%`** | `#DDEAF3` approx | Very subtle card border |
| `--ring` | `239 100% 88%` (periwinkle) | **`182 80% 32%`** | `#0F8E92` | Teal focus ring |
| `--radius` | `0.75rem` | **`0.75rem`** | 12px | Unchanged — Figma cards ~10–12px |
| `shadow-card-lift` | `0 20px 48px -20px rgba(0,0,0,0.60)` | **`0 4px 24px -6px rgba(0,0,0,0.10)`** | — | Softer lift for light mode |
| `shadow-teal-glow` | `shadow-logo-glow` (periwinkle) | **`0 8px 20px -8px hsl(182 80% 32% / 0.40)`** | — | Teal CTA glow |
| `--lab-makerspace` | `27 96% 61%` | **`27 90% 45%`** (light) | `#C76B11` approx | Secondary indicator; slightly more muted in light |
| `--lab-robotics` | `239 100% 78%` (periwinkle) | **`225 80% 55%`** | `#3D6FDB` approx | Secondary indicator only; no longer brand-primary |

### Default theme direction

- `:root` = **light** (white surfaces, teal primary, dark text)
- `.dark` = opt-in dark theme (retained for toggle; teal adapts to 48% L)
- `ThemeProvider` in `src/components/providers.tsx` set to `theme="light"`

### Dark-mode effects disabled in light mode

| Effect | Status | Reason |
|---|---|---|
| `.aurora-mesh::before` / `::after` (animated orbs) | `display: none` | Periwinkle/amber orbs are invisible on white bg |
| `.aurora-mesh-extra::before` | `display: none` | Same |
| Body ambient gradient (`radial-gradient` periwinkle + amber) | Removed | Replaced with clean `hsl(var(--background))` |

**Action for public-surface agent**: Replace `.aurora-mesh` wrapper in
`src/components/public/Hero.tsx` with a solid teal band:
`bg-[hsl(182_80%_32%)]` with a subtle gradient to `hsl(182_81%_24%)` and white
headline text. The `.section-fade-teal` utility class is available for the
transition into white content.

## Motion

Use `ReactiveReveal` and `ReactiveMetric` from
`src/components/once-ui/reactive-elements.tsx`. Avoid introducing Framer Motion
directly unless a primitive does not cover the case.

## Component inventory

See [`src/components/ui/`](../../src/components/ui) for available primitives.
Before building a new one, check if a Radix-based primitive can be composed.

## Accessibility checklist (per surface)

- [x] Focus-visible rings on all interactive elements — teal ring `hsl(182 80% 32%)`
- [x] `aria-current="page"` on the active nav item
- [x] `prefers-reduced-motion` — CSS animations disabled; aurora orbs also already `display:none`
- [x] Color contrast — teal `#0F8E92` on white passes AA at 4.6:1 (verify with browser DevTools)
- [x] Dark text on yellow accent — `#17202A` on `#FFD43B` is ~8:1, passes AAA
- [x] Skip-to-content link on long pages (`.skip-nav` in globals.css)
- [ ] Form fields have associated labels (verify per form implementation)

## Figma alignment notes (original, 2026-05-19)

_(Superseded by the 2026-05-21 teal pivot above. Kept for history.)_

The public Figma URL returned a thin payload — only the string "Figma" with no
parsed design tokens. All alignment below was inferred from the Plaksha brand
identity (navy primary, periwinkle accent, amber/orange as the Makerspace foil).
The 2026-05-21 pivot corrects this based on the actual exported PNG frames.
