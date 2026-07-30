import "server-only";

import { cache } from "react";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const navigationItemSchema = z.object({
  label: z.string().min(1).max(80),
  href: z.string().startsWith("/"),
  visible: z.boolean().default(true),
});

const publicSettingsSchema = z.object({
  siteName: z.string().default("BCU Group"),
  siteDescription: z.string().default("Building communities. Creating opportunity."),
  publicWebsiteUrl: z.string().url().default("http://localhost:3000"),
  mainEmail: z.string().email().or(z.literal("")).default("info@bcu.co.tz"),
  mainPhone: z.string().default(""),
  officeAddress: z.string().default("Dar es Salaam, Tanzania"),
  defaultSeoTitle: z.string().default("BCU Group"),
  defaultSeoDescription: z.string().default("Building communities. Creating opportunity."),
  defaultOpenGraphImage: z.string().default(""),
  organisationName: z.string().default("Beneficium Communis Universitas Limited"),
  organisationLogo: z.string().default("/brands/bcu-logo.png"),
  maintenanceMode: z.boolean().default(false),
  header: z.object({
    logo: z.string().default("/brands/bcu-logo.png"),
    siteLabel: z.string().default("BCU GROUP"),
    contactLabel: z.string().default("Contact Us"),
    contactUrl: z.string().startsWith("/").default("/contact"),
    navigation: z.array(navigationItemSchema).default([]),
  }).default({
    logo: "/brands/bcu-logo.png",
    siteLabel: "BCU GROUP",
    contactLabel: "Contact Us",
    contactUrl: "/contact",
    navigation: [],
  }),
  footer: z.object({
    description: z.string().default("A diversified African corporate group investing in technology, food systems, innovation and sustainable community development."),
    copyright: z.string().default("Beneficium Communis Universitas Limited. All rights reserved."),
  }).default({
    description: "A diversified African corporate group investing in technology, food systems, innovation and sustainable community development.",
    copyright: "Beneficium Communis Universitas Limited. All rights reserved.",
  }),
  socialLinks: z.record(z.string(), z.string().url().or(z.literal(""))).default({}),
});

export type PublicSiteSettings = z.infer<typeof publicSettingsSchema>;

const defaults: PublicSiteSettings = publicSettingsSchema.parse({
  publicWebsiteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
});

export const getPublicSiteSettings = cache(async (): Promise<PublicSiteSettings> => {
  const records = await prisma.siteSetting.findMany();
  const values = Object.fromEntries(records.map((record) => [record.key, record.value]));
  return publicSettingsSchema.parse({ ...defaults, ...values });
});

export { publicSettingsSchema };
