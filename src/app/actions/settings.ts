"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { publicSettingsSchema } from "@/lib/site-settings";

export async function saveSettingsAction(form: FormData) {
  const actor = await requireUser(["SUPER_ADMIN"]);
  const parsed = publicSettingsSchema.parse({
    siteName: form.get("siteName"),
    siteDescription: form.get("siteDescription"),
    publicWebsiteUrl: form.get("publicWebsiteUrl"),
    mainEmail: form.get("mainEmail"),
    mainPhone: form.get("mainPhone"),
    officeAddress: form.get("officeAddress"),
    defaultSeoTitle: form.get("defaultSeoTitle"),
    defaultSeoDescription: form.get("defaultSeoDescription"),
    defaultOpenGraphImage: form.get("defaultOpenGraphImage"),
    organisationName: form.get("organisationName"),
    organisationLogo: form.get("organisationLogo"),
    maintenanceMode: form.get("maintenanceMode") === "on",
    header: JSON.parse(z.string().parse(form.get("header"))),
    footer: JSON.parse(z.string().parse(form.get("footer"))),
    socialLinks: JSON.parse(z.string().parse(form.get("socialLinks"))),
  });
  const entries = Object.entries(parsed);
  await prisma.$transaction(async (tx) => {
    for (const [key, value] of entries) {
      await tx.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    }
    await tx.auditLog.create({
      data: {
        userId: actor.id,
        action: "UPDATE",
        entityType: "SiteSetting",
        summary: "Updated public site settings",
      },
    });
  });
  for (const path of ["/", "/about", "/impact", "/contact", "/sitemap.xml", "/admin/settings"]) {
    revalidatePath(path);
  }
}
