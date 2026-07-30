"use server";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { mapContentStatus } from "@/lib/content-status";
import { slugSchema } from "@/lib/validation";

const newsInputSchema = z.object({
  title: z.string().trim().min(3).max(180), slug: slugSchema,
  excerpt: z.string().trim().min(10).max(600),
  content: z.array(z.string().trim().min(1).max(10000)).min(1),
  category: z.string().trim().min(2).max(80), companyId: z.string().cuid().nullable(),
  status: z.enum(["Draft", "Published", "Archived"]), featured: z.boolean(),
  coverImage: z.string().trim().max(2048), coverImageAlt: z.string().trim().max(240),
  author: z.string().trim().min(2).max(120), publishedAt: z.string().date().or(z.literal("")),
  readingTime: z.string().trim().regex(/^\d+/), tags: z.array(z.string().trim().min(1).max(50)).max(20),
  seoTitle: z.string().trim().max(70), seoDescription: z.string().trim().max(180),
});
export type NewsInput = z.input<typeof newsInputSchema>;
export type MutationResult = { ok: true; id: string } | { ok: false; error: string };

function refreshNews(slug?: string) {
  revalidatePath("/news"); revalidatePath("/admin/news"); revalidatePath("/");
  if (slug) revalidatePath(`/news/${slug}`);
}

export async function saveNewsAction(id: string | null, input: NewsInput): Promise<MutationResult> {
  const user = await requireUser(["SUPER_ADMIN", "ADMIN", "EDITOR"]);
  const parsed = newsInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid article." };
  if (parsed.data.companyId && !(await prisma.company.findUnique({ where: { id: parsed.data.companyId }, select: { id: true } }))) return { ok: false, error: "Selected company no longer exists." };
  const data = {
    title: parsed.data.title, slug: parsed.data.slug, excerpt: parsed.data.excerpt,
    content: { paragraphs: parsed.data.content }, category: parsed.data.category,
    companyId: parsed.data.companyId, status: mapContentStatus(parsed.data.status),
    featured: parsed.data.featured, coverImage: parsed.data.coverImage || null,
    coverImageAlt: parsed.data.coverImageAlt || parsed.data.title, author: parsed.data.author,
    publishedAt: parsed.data.publishedAt ? new Date(`${parsed.data.publishedAt}T00:00:00.000Z`) : null,
    readingTime: Number.parseInt(parsed.data.readingTime, 10), tags: parsed.data.tags,
    seoTitle: parsed.data.seoTitle || null, seoDescription: parsed.data.seoDescription || null,
  } satisfies Prisma.NewsArticleUncheckedCreateInput;
  try {
    const previous = id ? await prisma.newsArticle.findUnique({ where: { id }, select: { slug: true } }) : null;
    const saved = id ? await prisma.newsArticle.update({ where: { id }, data }) : await prisma.newsArticle.create({ data });
    await prisma.auditLog.create({ data: { userId: user.id, action: id ? "UPDATE" : "CREATE", entityType: "NewsArticle", entityId: saved.id, summary: `${id ? "Updated" : "Created"} ${saved.title}` } });
    refreshNews(saved.slug); if (previous?.slug && previous.slug !== saved.slug) refreshNews(previous.slug);
    return { ok: true, id: saved.id };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return { ok: false, error: "That article slug is already in use." };
    return { ok: false, error: "The article could not be saved." };
  }
}

export async function deleteNewsAction(id: string): Promise<MutationResult> {
  const user = await requireUser(["SUPER_ADMIN", "ADMIN", "EDITOR"]);
  const article = await prisma.newsArticle.findUnique({ where: { id }, select: { slug: true, title: true } });
  if (!article) return { ok: false, error: "Article not found." };
  await prisma.$transaction([
    prisma.newsArticle.delete({ where: { id } }),
    prisma.auditLog.create({ data: { userId: user.id, action: "DELETE", entityType: "NewsArticle", entityId: id, summary: `Deleted ${article.title}` } }),
  ]);
  refreshNews(article.slug);
  return { ok: true, id };
}
