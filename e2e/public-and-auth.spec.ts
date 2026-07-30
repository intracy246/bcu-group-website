import { expect, test } from "@playwright/test";

const publicRoutes = [
  "/",
  "/about",
  "/companies",
  "/projects",
  "/impact",
  "/news",
  "/careers",
  "/contact",
  "/api/health",
];

test("public routes and health endpoint respond successfully", async ({ request }) => {
  for (const route of publicRoutes) {
    const response = await request.get(route);
    expect(response.ok(), `${route} returned ${response.status()}`).toBeTruthy();
  }
});

test("anonymous administrators are redirected to login", async ({ page }) => {
  await page.goto("/admin/messages");
  await expect(page).toHaveURL(/\/admin\/login/);
});

test("existing administrator can login, view the CMS routes, and logout", async ({ page }) => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  test.skip(!email || !password, "ADMIN_EMAIL and ADMIN_PASSWORD are required.");

  await page.goto("/admin/login");
  await page.getByLabel(/email/i).fill(email!);
  await page.getByLabel(/password/i).fill(password!);
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page).toHaveURL(/\/admin$/);

  for (const route of ["/admin/messages", "/admin/media", "/admin/settings", "/admin/content"]) {
    await page.goto(route);
    await expect(page).not.toHaveURL(/\/admin\/login/);
  }

  await page.request.post("/api/auth/logout");
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login/);
});
