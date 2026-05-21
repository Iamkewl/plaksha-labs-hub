// Sign in then screenshot /dashboard. Uses credentials form so navigation completes.
import { chromium } from "playwright";
import { resolve } from "node:path";

const BASE = "http://localhost:3000";
const OUT = resolve(process.cwd(), "docs/audit/screenshots");

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

page.on("console", (m) => {
  if (m.type() === "error") console.log("[err]", m.text().slice(0, 180));
});

console.log("→ signin page");
await page.goto(`${BASE}/auth/signin`, { waitUntil: "domcontentloaded", timeout: 180_000 });
await page.waitForLoadState("networkidle", { timeout: 60_000 }).catch(() => {});

console.log("→ filling credentials");
await page.fill('input[type="email"], #email', "admin@plaksha.edu.in");
await page.fill('input[type="password"], #password', "AlphaTest@123");
const submitBtn = page.getByRole("button", { name: /^sign in$/i }).first();
await Promise.all([
  page.waitForURL((u) => !u.toString().includes("/auth/signin"), { timeout: 60_000 }).catch(() => {}),
  submitBtn.click(),
]);

console.log("→ post-signin URL:", page.url());

// Now navigate to /dashboard explicitly
console.log("→ goto /dashboard");
await page.goto(`${BASE}/dashboard`, { waitUntil: "domcontentloaded", timeout: 180_000 });
await page.waitForLoadState("networkidle", { timeout: 60_000 }).catch(() => {});
console.log("→ final URL:", page.url());

await page.waitForTimeout(800);
await page.screenshot({ path: resolve(OUT, "99-dashboard-debug.png"), fullPage: true });

const navItems = await page
  .locator("aside[aria-label='App navigation'] a, aside[aria-label='App navigation'] button")
  .evaluateAll((els) =>
    els.map((e) => {
      const cs = window.getComputedStyle(e);
      const r = e.getBoundingClientRect();
      return {
        tag: e.tagName,
        text: e.textContent?.trim().slice(0, 40),
        href: e.getAttribute("href"),
        display: cs.display,
        visibility: cs.visibility,
        opacity: cs.opacity,
        height: Math.round(r.height),
        width: Math.round(r.width),
        color: cs.color,
      };
    })
  );
console.log("\n=== NAV ITEMS (count:", navItems.length, ") ===");
for (const i of navItems) console.log(JSON.stringify(i));

await browser.close();
console.log(`\n→ screenshot: ${resolve(OUT, "99-dashboard-debug.png")}`);
