# Plaksha Labs Hub — Documentation

Engineering documentation for the Plaksha Labs Hub platform, a multi-lab management system unifying the Plaksha Makerspace with the Robotics Lab and future labs.

## Map

| Doc | When to read it |
| --- | --- |
| [architecture.md](./architecture.md) | New to the codebase; understanding how routes, data, and auth fit together |
| [conventions.md](./conventions.md) | Before opening a PR — naming, structure, server actions vs API routes, etc. |
| [data-model.md](./data-model.md) | Adding or modifying a Prisma model |
| [deployment.md](./deployment.md) | Shipping to production or staging |
| [contributing.md](./contributing.md) | First-time contributor setup |
| [adr/](./adr/) | Architecture Decision Records — why we picked X over Y |
| [design/](./design/) | Figma references, design tokens, and UI guidelines |

## Status

- **Stage:** Active development (target: feature-complete 2026-05-21 19:00 IST)
- **Primary repo branch:** `master`
- **Production:** not yet deployed
- **Live demo:** local dev only (`npm run dev`)

## Quick links

- Sitemap: see [architecture.md#sitemap](./architecture.md#sitemap)
- Lab onboarding (adding a new lab): see [conventions.md#adding-a-lab](./conventions.md#adding-a-lab)
- Why server actions and not API routes: [adr/0001-server-actions.md](./adr/0001-server-actions.md)
