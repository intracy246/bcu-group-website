import { expect, test, type Page } from "@playwright/test";

async function login(page: Page) {
  await page.goto("/admin/login");
  await page.getByLabel(/email/i).fill(process.env.ADMIN_EMAIL!);
  await page.getByLabel(/password/i).fill(process.env.ADMIN_PASSWORD!);
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page).toHaveURL(/\/admin$/);
}

async function expectNoPageOverflow(page: Page) {
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
}

test("admin mobile drawer and representative routes stay usable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await login(page);
  await expectNoPageOverflow(page);
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  await expect(page.getByRole("navigation", { name: "Admin navigation" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Close navigation menu" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Open navigation menu" })).toBeVisible();
  for (const route of ["/admin/team", "/admin/companies", "/admin/projects", "/admin/news", "/admin/messages", "/admin/media", "/admin/users", "/admin/settings", "/admin/content"]) {
    await page.goto(route);
    await expectNoPageOverflow(page);
  }
  await page.goto("/admin/team");
  await page.getByRole("link", { name: "Edit", exact: true }).first().click();
  await expect(page).toHaveURL(/\/admin\/team\/[^/]+\/edit$/);
  await expectNoPageOverflow(page);
  await page.goto("/admin");
  await page.screenshot({ path: "test-results/admin-dashboard-390.png", fullPage: true });
  await page.goto("/admin/team");
  await page.screenshot({ path: "test-results/admin-team-390.png", fullPage: true });
  await page.goto("/admin/media");
  await page.screenshot({ path: "test-results/admin-media-390.png", fullPage: true });
});

test("admin desktop remains constrained and usable", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await login(page);
  await expectNoPageOverflow(page);
  await expect(page.getByRole("button", { name: "Open navigation menu" })).toBeHidden();
  await page.screenshot({ path: "test-results/admin-dashboard-1440.png", fullPage: true });
  await page.goto("/admin/companies");
  await expectNoPageOverflow(page);
});

test("public routes keep responsive width and heading hierarchy", async ({ page }) => {
  for (const width of [390, 430, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["/", "/about", "/companies", "/projects", "/impact", "/news", "/careers", "/contact", "/team"]) {
      await page.goto(route);
      await expectNoPageOverflow(page);
    }
    if (width === 390) {
      await page.screenshot({ path: "test-results/public-home-390.png", fullPage: true });
      await page.goto("/team");
      await page.screenshot({ path: "test-results/public-team-390.png", fullPage: true });
      await page.goto("/companies");
      await page.screenshot({ path: "test-results/public-companies-390.png", fullPage: true });
    }
    if (width === 1440) {
      await page.goto("/");
      await page.screenshot({ path: "test-results/public-home-1440.png", fullPage: true });
    }
  }
});
