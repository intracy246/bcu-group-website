import { expect, test } from "@playwright/test";
import { PrismaClient } from "@prisma/client";

test("Companies form uses an exact Description locator", async ({ page }) => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  test.skip(!email || !password, "Administrator credentials are required.");
  await page.goto("/admin/login");
  await page.getByLabel(/email/i).fill(email!);
  await page.getByLabel(/password/i).fill(password!);
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await page.goto("/admin/companies/new");
  await page.getByLabel("Description", { exact: true }).fill("Exact Company description");
});

test("Companies directory renders active database records and hides inactive records", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
  page.on("pageerror", (error) => consoleErrors.push(error.message));
  const prisma = new PrismaClient();
  const suffix = Date.now();
  const activeSlug = `active-company-${suffix}`;
  const inactiveSlug = `inactive-company-${suffix}`;
  try {
    await prisma.company.createMany({ data: [
      { name: "Active Directory Company", shortName: "ADC", slug: activeSlug, summary: "Active company tagline", description: "Active company description", status: "ACTIVE", industry: "Energy, Infrastructure" },
      { name: "Inactive Directory Company", shortName: "IDC", slug: inactiveSlug, summary: "Inactive company tagline", description: "Inactive company description", status: "INACTIVE" },
    ] });
    await page.goto("/companies");
    await expect(page.getByText("Active company tagline")).toBeVisible();
    await expect(page.getByText("Inactive company tagline")).toHaveCount(0);
    await expect(page.locator(`a[href="/companies/${activeSlug}"]`)).toBeVisible();
    await page.screenshot({ path: "test-results/companies-restored.png", fullPage: true });
    expect((await page.goto(`/companies/${activeSlug}`))?.status()).toBe(200);
    expect(consoleErrors).toEqual([]);
  } finally {
    await prisma.company.deleteMany({ where: { slug: { in: [activeSlug, inactiveSlug] } } });
    await prisma.$disconnect();
  }
});
