import { expect, test, type Page } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { rm } from "node:fs/promises";
import { resolveStoragePath } from "../src/lib/storage-keys";
import path from "node:path";

async function login(page: Page) {
  expect(process.env.ADMIN_EMAIL, "ADMIN_EMAIL is required").toBeTruthy();
  expect(process.env.ADMIN_PASSWORD, "ADMIN_PASSWORD is required").toBeTruthy();
  await page.goto("/admin/login");
  await page.getByLabel(/email/i).fill(process.env.ADMIN_EMAIL!);
  await page.getByLabel(/password/i).fill(process.env.ADMIN_PASSWORD!);
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page).toHaveURL(/\/admin$/);
}
test("Our Team immediately precedes Contact Us on desktop and mobile", async ({ page }) => {
  await page.goto("/team");
  const nav = page.getByRole("navigation", { name: "Primary navigation" });
  await expect(nav.getByRole("link")).toHaveText(["Home", "About", "Our Companies", "Projects", "Impact", "News", "Careers", "Our Team", "Contact Us"]);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  await expect(nav.getByRole("link", { name: "Our Team", exact: true })).toBeVisible();
  await nav.getByRole("link", { name: "Our Team", exact: true }).click();
  await expect(page).toHaveURL(/\/team$/);
});
test("anonymous visitors cannot open Team admin routes", async ({ page }) => {
  for (const route of ["/admin/team", "/admin/team/new", "/admin/team/missing", "/admin/team/missing/edit"]) { await page.goto(route); await expect(page).toHaveURL(/\/admin\/login/); }
});
test("Team database CRUD, media selection, privacy, filtering, duplicate slug and founder portfolio", async ({ page, context }) => {
  test.setTimeout(180000);
  const db = new PrismaClient(); const slug = `team-e2e-${Date.now()}`; const name = `Team E2E ${Date.now()}`;
  const errors: string[] = []; page.on("pageerror", error => errors.push(error.message)); page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
  let mediaId = ""; let directMediaId = ""; let memberId = "";
  try {
    await login(page);
    await page.getByRole("link", { name: /Our Team$/ }).click();
    await expect(page.getByRole("heading", { name: "Our Team", exact: true })).toBeVisible();
    const upload = await page.request.post("/api/admin/media", { multipart: { file: { name: `${slug}.png`, mimeType: "image/png", buffer: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aM1sAAAAASUVORK5CYII=", "base64") }, folder: "team-tests" } });
    expect(upload.status()).toBe(201); mediaId = (await upload.json()).id;
    const media = await db.mediaAsset.findUniqueOrThrow({ where: { id: mediaId } });
    await page.getByRole("link", { name: "Add team member", exact: true }).click();
    await page.getByLabel("Full name", { exact: true }).fill(name);
    await page.getByLabel("URL slug", { exact: true }).fill(slug);
    await page.getByLabel("Primary title", { exact: true }).fill("Test Director");
    await page.getByLabel("Short biography", { exact: true }).fill("Leading purposeful technology and community projects.");
    await page.getByLabel("Full biography", { exact: true }).fill("A test biography for the complete team workflow.");
    await page.getByLabel("Email", { exact: true }).fill("private-team@example.com");
    await page.getByLabel("Profile photo", { exact: true }).selectOption(media.url);
    const directUpload = page.waitForResponse(response => response.url().endsWith("/api/admin/media") && response.request().method() === "POST");
    await page.locator('input[type="file"]').first().setInputFiles({ name: `${slug}-direct.png`, mimeType: "image/png", buffer: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aM1sAAAAASUVORK5CYII=", "base64") });
    const directResponse = await directUpload; expect(directResponse.status()).toBe(201); const directAsset = (await directResponse.json()).asset as { id: string; url: string }; directMediaId = directAsset.id;
    await expect(page.getByText(/Image selected:/)).toBeVisible();
    await page.getByLabel("Published", { exact: true }).check();
    await page.getByRole("button", { name: "Add skills", exact: true }).click(); await page.getByLabel("Skills 1", { exact: true }).fill("Engineering");
    await page.getByRole("button", { name: "Save team member" }).click();
    await expect(page).toHaveURL(/\/admin\/team\/c[a-z0-9]+$/); memberId = page.url().split("/").pop()!;
    expect((await db.teamMember.findUniqueOrThrow({ where: { id: memberId } })).photo).toBe(directAsset.url);
    const visitor = await context.newPage();
    await visitor.goto("/team"); await expect(visitor.getByRole("heading", { name, exact: true })).toBeVisible();
    await visitor.locator(`a[href="/team/${slug}"]`).last().click();
    await expect(visitor.getByTestId("standard-profile")).toBeVisible();
    await expect(visitor.getByText("private-team@example.com")).toHaveCount(0);
    await expect(visitor.getByRole("img", { name, exact: true })).toBeVisible();
    await expect.poll(() => visitor.getByRole("img", { name, exact: true }).evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    expect(await visitor.locator('script[type="application/ld+json"]').textContent()).not.toContain("private-team@example.com");
    await page.getByRole("link", { name: "Edit team member", exact: true }).click();
    await page.getByLabel("Primary title", { exact: true }).fill("Updated Test Director");
    await page.getByLabel("Display email, phone and location publicly").check();
    await page.getByRole("button", { name: "Save team member" }).click(); await expect(page).toHaveURL(new RegExp(`/admin/team/${memberId}$`));
    await visitor.reload(); await expect(visitor.getByText("Updated Test Director", { exact: true })).toBeVisible(); await expect(visitor.getByRole("link", { name: /private-team@example.com/ })).toBeVisible();
    await page.getByRole("button", { name: "Unpublish", exact: true }).click(); await expect(page.getByRole("button", { name: "Publish", exact: true })).toBeVisible();
    await visitor.goto("/team"); await expect(visitor.getByRole("heading", { name, exact: true })).toHaveCount(0);
    expect((await visitor.request.get(`/team/${slug}`)).status()).toBe(404);
    await page.getByRole("button", { name: "Publish", exact: true }).click(); await expect(page.getByRole("button", { name: "Unpublish", exact: true })).toBeVisible();
    await page.getByLabel("Display order", { exact: true }).fill("19"); await page.getByRole("button", { name: "Save order" }).click();
    await expect.poll(async () => (await db.teamMember.findUniqueOrThrow({ where: { id: memberId } })).displayOrder).toBe(19);
    await page.goto("/admin/team"); await page.getByLabel("Search team").fill(name); await page.getByLabel("Status", { exact: true }).selectOption("published"); await page.getByRole("button", { name: "Filter team" }).click(); await expect(page.getByRole("heading", { name, exact: true })).toBeVisible();
    await page.goto("/admin/team/new"); await page.getByLabel("Full name", { exact: true }).fill("Duplicate member"); await page.getByLabel("URL slug", { exact: true }).fill(slug); await page.getByLabel("Primary title", { exact: true }).fill("Director"); await page.getByRole("button", { name: "Save team member" }).click(); await expect(page.getByRole("alert").filter({ hasText: "already in use" })).toBeVisible();
    await page.goto(`/admin/team/${memberId}/edit`); await page.getByLabel("Profile type", { exact: true }).selectOption("FOUNDER_PORTFOLIO");
    await page.getByLabel("Technology & development", { exact: true }).fill("Building platforms and digital systems for lasting impact.");
    await page.getByLabel("Vision / philosophy", { exact: true }).fill("Technology should create opportunity for everyone.");
    for (const section of ["leadership", "experience", "education", "achievements"]) {
      await page.getByRole("button", { name: `Add ${section}`, exact: true }).click(); await page.getByLabel(`${section[0].toUpperCase()}${section.slice(1)} Title 1`, { exact: true }).fill(`Test ${section}`);
    }
    await page.getByRole("button", { name: "Add portfolio project" }).click(); await page.getByLabel("Project Name 1", { exact: true }).fill("Independent test system"); await page.getByLabel("Project Description 1", { exact: true }).fill("A database-editable product showcase.");
    await page.getByLabel("Technologies 1 (comma separated)").fill("TypeScript,PostgreSQL");
    await page.getByRole("button", { name: "Save team member" }).click(); await expect(page).toHaveURL(new RegExp(`/admin/team/${memberId}$`));
    await visitor.goto(`/team/${slug}`); await expect(visitor.getByTestId("founder-portfolio")).toBeVisible(); await expect(visitor.getByTestId("standard-profile")).toHaveCount(0); await expect(visitor.getByText("Independent test system", { exact: true })).toBeVisible(); await expect.poll(() => visitor.getByRole("img", { name, exact: true }).evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    for (const width of [1440, 1280, 768, 390]) {
      await visitor.setViewportSize({ width, height: 900 }); await visitor.emulateMedia({ reducedMotion: "reduce" }); await visitor.reload();
      await expect(visitor.getByRole("heading", { name, exact: true })).toBeVisible();
      expect(await visitor.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
      await visitor.screenshot({ path: `test-results/founder-${width}.png`, fullPage: true, caret: "initial" });
    }
    await page.getByRole("link", { name: "Edit team member", exact: true }).click(); await page.getByLabel("URL slug", { exact: true }).fill(`${slug}-renamed`); await page.getByRole("button", { name: "Save team member" }).click(); await expect(page).toHaveURL(new RegExp(`/admin/team/${memberId}$`));
    expect((await visitor.request.get(`/team/${slug}`)).status()).toBe(404); expect((await visitor.request.get(`/team/${slug}-renamed`)).status()).toBe(200);
    page.once("dialog", dialog => dialog.accept()); await page.getByRole("button", { name: "Delete", exact: true }).click(); await expect(page).toHaveURL(/\/admin\/team$/);
    expect(await db.teamMember.findUnique({ where: { id: memberId } })).toBeNull(); expect(await db.teamPortfolioProject.count({ where: { teamMemberId: memberId } })).toBe(0);
    await visitor.goto("/team"); await expect(visitor.getByRole("heading", { name, exact: true })).toHaveCount(0); expect((await visitor.request.get(`/team/${slug}-renamed`)).status()).toBe(404);
    expect(await db.auditLog.count({ where: { entityType: "TeamMember", entityId: memberId } })).toBeGreaterThanOrEqual(7);
    await visitor.close(); expect(errors).toEqual([]);
  } finally {
    await db.teamMember.deleteMany({ where: { slug: { startsWith: slug } } });
    for (const assetId of [mediaId, directMediaId]) { if (assetId) { const asset = await db.mediaAsset.findUnique({ where: { id: assetId } }); if (asset) { await db.mediaAsset.delete({ where: { id: assetId } }); if (process.env.STORAGE_PROVIDER !== "s3") await rm(resolveStoragePath(path.resolve(process.env.LOCAL_STORAGE_PATH || ".storage"), asset.storageKey), { force: true }); } } }
    await db.$disconnect();
  }
});
