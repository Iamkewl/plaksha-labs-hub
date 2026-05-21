// scripts/ui-sweep.mjs
// Headless screenshot + textual audit of the running dev server.
// Run: node scripts/ui-sweep.mjs
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const OUT = resolve(process.cwd(), "docs/audit/screenshots");
if (!existsSync(OUT)) await mkdir(OUT, { recursive: true });

const ROUTES_PUBLIC = [
  { name: "01-landing", path: "/" },
  { name: "02-signin", path: "/auth/signin" },
  { name: "03-signup", path: "/auth/signup" },
  { name: "04-labs", path: "/labs" },
];

const ROUTES_APP = [
  { name: "10-dashboard", path: "/dashboard" },
  { name: "11-projects", path: "/projects" },
  { name: "12-catalog-machines", path: "/catalog/machines" },
  { name: "13-catalog-materials", path: "/catalog/materials" },
  { name: "14-bookings", path: "/bookings" },
  { name: "15-notifications", path: "/notifications" },
];

const ROUTES_ADMIN = [
  { name: "20-admin", path: "/admin" },
  { name: "21-admin-users", path: "/admin/users" },
  { name: "22-admin-material-requests", path: "/admin/material-requests" },
  { name: "23-admin-requests", path: "/admin/requests" },
  { name: "24-admin-analytics", path: "/admin/analytics" },
  { name: "25-admin-purchase-orders", path: "/admin/purchase-orders" },
];

const findings = [];

function record(route, kind, detail) {
  findings.push({ route: route.path, kind, detail });
}

async function audit(page, route) {
  const url = `${BASE}${route.path}`;
  console.log(`→ ${route.name.padEnd(30)} ${url}`);
  const errors = [];
  page.removeAllListeners("console");
  page.removeAllListeners("pageerror");
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`console.error: ${msg.text()}`);
  });
  page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));

  try {
    const resp = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await page.waitForLoadState("networkidle", { timeout: 30_000 }).catch(() => {});
    const status = resp?.status() ?? 0;
    if (status >= 400) record(route, "http", `HTTP ${status}`);

    // Visual audit: low-contrast text on the sidebar (dark text on teal)
    const sidebarText = await page.$$eval("aside[aria-label='App navigation'] *", (els) =>
      els
        .filter((e) => e.textContent && e.textContent.trim().length > 0)
        .map((e) => {
          const cs = window.getComputedStyle(e);
          // Walk up to find effective bg color
          let bg = cs.backgroundColor;
          let p = e.parentElement;
          while (p && (bg === "rgba(0, 0, 0, 0)" || bg === "transparent")) {
            bg = window.getComputedStyle(p).backgroundColor;
            p = p.parentElement;
          }
          return {
            text: e.textContent.trim().slice(0, 60),
            color: cs.color,
            bg,
          };
        })
        .filter((r) => {
          // Skip elements on a yellow accent background (New Project pill etc.)
          const bgMatch = r.bg.match(/rgb\((\d+),\s*(\d+),\s*(\d+)/);
          if (bgMatch && +bgMatch[1] > 200 && +bgMatch[2] > 180 && +bgMatch[3] < 120) {
            return false; // yellow-ish bg → dark fg is intended
          }
          const m = r.color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)/);
          if (!m) return false;
          const [r1, g1, b1] = [+m[1], +m[2], +m[3]];
          const isDarkish = (r1 + g1 + b1) / 3 < 120;
          return isDarkish;
        })
    ).catch(() => []);
    if (sidebarText.length) {
      record(route, "sidebar-dark-text", sidebarText.slice(0, 4));
    }

    // Title check
    const title = await page.title();
    if (title.toLowerCase().includes("makerspace") && !route.path.includes("makerspace")) {
      record(route, "title-mentions-makerspace", title);
    }

    // Visible "Makerhub" branding leftover
    const makerhub = await page.locator("text=/makerhub/i").count().catch(() => 0);
    if (makerhub > 0) record(route, "leftover-makerhub", `${makerhub} occurrence(s)`);

    // Overflow / horizontal scroll
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    if (overflow) record(route, "horizontal-overflow", "scrollWidth > clientWidth");

    // Screenshot
    await page.screenshot({
      path: resolve(OUT, `${route.name}.png`),
      fullPage: true,
    });
  } catch (e) {
    record(route, "navigation-error", String(e.message || e));
  }
  if (errors.length) record(route, "js-errors", errors.slice(0, 5));
}

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "no-preference",
});
const page = await ctx.newPage();

// 1. Public routes (no auth)
for (const r of ROUTES_PUBLIC) await audit(page, r);

// 2. Sign in via dev-bypass — click the Admin button
try {
  console.log("→ signing in via dev-bypass (Admin)");
  await page.goto(`${BASE}/auth/signin`, { waitUntil: "networkidle", timeout: 60_000 });
  // Look for a dev-bypass admin button — fall back to filling the form
  const adminBtn = page.getByRole("button", { name: /admin/i }).first();
  if (await adminBtn.isVisible().catch(() => false)) {
    await adminBtn.click();
  } else {
    await page.fill('input[type="email"], input[name="email"], #email', "admin@plaksha.edu.in");
    await page.fill('input[type="password"], input[name="password"], #password', "AlphaTest@123");
    await page.getByRole("button", { name: /sign in/i }).first().click();
  }
  await page.waitForURL(/(dashboard|admin|labs|^\/$)/, { timeout: 30_000 }).catch(() => {});
  await page.waitForLoadState("networkidle", { timeout: 30_000 }).catch(() => {});
} catch (e) {
  console.log("sign-in failed:", e.message);
  findings.push({ route: "/auth/signin", kind: "signin-failed", detail: e.message });
}

// 3. App routes
for (const r of [...ROUTES_APP, ...ROUTES_ADMIN]) await audit(page, r);

await browser.close();

const report = {
  base: BASE,
  ranAt: new Date().toISOString(),
  totalRoutes: ROUTES_PUBLIC.length + ROUTES_APP.length + ROUTES_ADMIN.length,
  findings,
};
await writeFile(resolve(OUT, "../audit-report.json"), JSON.stringify(report, null, 2));
console.log(`\nDone. Screenshots → ${OUT}`);
console.log(`Findings (${findings.length}):`);
for (const f of findings) console.log(`  [${f.kind}] ${f.route} — ${JSON.stringify(f.detail).slice(0, 140)}`);
