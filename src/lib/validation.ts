import { z } from "zod";

export const slugSchema = z
  .string()
  .trim()
  .min(2)
  .max(120)
  .transform((value) =>
    value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
  );

export const emailSchema = z.string().trim().toLowerCase().email().max(254);
export const safeUrlSchema = z.string().trim().url().max(2048);
export const structuredTextSchema = z.object({
  paragraphs: z.array(z.string().trim().min(1).max(10000)).min(1),
});

export const contactMessageSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: emailSchema,
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  organisation: z.string().trim().max(150).optional().or(z.literal("")),
  subject: z.string().trim().min(3).max(160),
  message: z.string().trim().min(10).max(5000),
  website: z.string().max(0).optional(),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(10).max(200),
});

export const applicationSchema = z.object({
  careerId: z.string().cuid(),
  applicantName: z.string().trim().min(2).max(100),
  email: emailSchema,
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  location: z.string().trim().max(120).optional().or(z.literal("")),
  coverLetter: z.string().trim().min(50).max(10000),
  cvUrl: safeUrlSchema,
  portfolioUrl: safeUrlSchema.optional().or(z.literal("")),
});
