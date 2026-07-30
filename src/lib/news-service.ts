import "server-only";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { safeParagraphArray, safeStringArray } from "@/lib/json-safety";

export type PublicNewsArticleDTO = {
  id: string; title: string; slug: string; excerpt: string; content: string[];
  category: string; company: string; companyId: string | null; status: "Draft" | "Published" | "Archived";
  featured: boolean; coverImage: string; coverImageAlt: string; author: string;
  publishedAt: string; readingTime: string; tags: string[]; seoTitle: string; seoDescription: string;
  createdAt: string; updatedAt: string;
};

export type NewsDTO = PublicNewsArticleDTO;

const includeCompany = { company: { select: { id: true, name: true } } } satisfies Prisma.NewsArticleInclude;
type ArticleWithCompany = Prisma.NewsArticleGetPayload<{ include: typeof includeCompany }>;

export function toNewsDTO(article: ArticleWithCompany): PublicNewsArticleDTO {
  return {
    id: article.id, title: article.title, slug: article.slug, excerpt: article.excerpt,
    content: safeParagraphArray(article.content), category: article.category,
    company: article.company?.name ?? "BCU Group", companyId: article.companyId,
    status: article.status === "PUBLISHED" ? "Published" : article.status === "ARCHIVED" ? "Archived" : "Draft",
    featured: article.featured, coverImage: article.coverImage ?? "", coverImageAlt: article.coverImageAlt ?? article.title,
    author: article.author, publishedAt: article.publishedAt?.toISOString().slice(0, 10) ?? "",
    readingTime: `${article.readingTime} min read`, tags: safeStringArray(article.tags),
    seoTitle: article.seoTitle ?? "", seoDescription: article.seoDescription ?? "",
    createdAt: article.createdAt.toISOString(), updatedAt: article.updatedAt.toISOString(),
  };
}

export async function listPublishedNews(): Promise<PublicNewsArticleDTO[]> {
  const tomorrow = new Date();
  tomorrow.setUTCHours(24, 0, 0, 0);
  const rows = await prisma.newsArticle.findMany({
    where: { status: "PUBLISHED", publishedAt: { lt: tomorrow } }, include: includeCompany,
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
  });
  return rows.map(toNewsDTO);
}

export async function getPublishedNewsBySlug(slug: string): Promise<PublicNewsArticleDTO | null> {
  const tomorrow = new Date();
  tomorrow.setUTCHours(24, 0, 0, 0);
  const row = await prisma.newsArticle.findFirst({ where: { slug, status: "PUBLISHED", publishedAt: { lt: tomorrow } }, include: includeCompany });
  return row ? toNewsDTO(row) : null;
}

export async function listAdminNews(): Promise<PublicNewsArticleDTO[]> {
  const rows = await prisma.newsArticle.findMany({ include: includeCompany, orderBy: [{ updatedAt: "desc" }] });
  return rows.map(toNewsDTO);
}

export async function getAdminNewsById(id: string): Promise<PublicNewsArticleDTO | null> {
  const row = await prisma.newsArticle.findUnique({ where: { id }, include: includeCompany });
  return row ? toNewsDTO(row) : null;
}
