import { expect, test, type Page } from "@playwright/test";

async function login(page: Page) {
  await page.goto("/admin/login");
  await page.getByLabel(/email/i).fill(process.env.ADMIN_EMAIL!);
  await page.getByLabel(/password/i).fill(process.env.ADMIN_PASSWORD!);
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page).toHaveURL(/\/admin$/);
}

async function expectNoOverflow(page: Page) {
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
}

test("Team and Users management surfaces remain usable on desktop and mobile", async ({ page }) => {
  test.skip(!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD, "Administrator credentials are required.");
  test.setTimeout(180_000);
  page.setDefaultNavigationTimeout(90_000);
  await login(page);
  for (const viewport of [{ width: 1440, height: 900, name: "1440" }, { width: 390, height: 844, name: "390" }]) {
    await page.setViewportSize(viewport);
    await page.goto("/admin/team");
    await expect(page.getByRole("heading", { name: "Team management", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Add Team Member", exact: true })).toBeVisible();
    await expect(page.getByLabel("Search team")).toBeVisible();
    await expectNoOverflow(page);
    await page.screenshot({ path: `test-results/admin-team-${viewport.name}.png`, fullPage: true });
    await page.goto("/admin/users");
    await expect(page.getByRole("heading", { name: "Administrator accounts", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Add administrator", exact: true })).toBeVisible();
    await expect(page.getByLabel("Role").first()).toBeVisible();
    await expectNoOverflow(page);
    await page.screenshot({ path: `test-results/admin-users-${viewport.name}.png`, fullPage: true });
  }
});