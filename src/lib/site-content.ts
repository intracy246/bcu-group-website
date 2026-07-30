import "server-only";

import { cache } from "react";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

export const safeJsonSchema: z.ZodType<unknown> = z.lazy(() =>
  z.union([
    z.string().max(20_000),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(safeJsonSchema).max(200),
    z.record(z.string().max(100), safeJsonSchema),
  ]),
);

export type PublicPageSection = {
  key: string;
  type: string;
  content: unknown;
  sortOrder: number;
};

export const getPublicPageSections = cache(
  async (pageKey: string): Promise<PublicPageSection[]> => {
    const page = await prisma.sitePage.findUnique({
      where: { key: pageKey },
      select: {
        status: true,
        sections: {
          where: { visible: true },
          orderBy: { sortOrder: "asc" },
          select: { key: true, type: true, content: true, sortOrder: true },
        },
      },
    });
    if (!page || page.status !== "PUBLISHED") return [];
    return page.sections.map((section) => ({
      ...section,
      content: safeJsonSchema.parse(section.content),
    }));
  },
);

export function sectionRecord(
  sections: PublicPageSection[],
  key: string,
): Record<string, unknown> | null {
  const content = sections.find((section) => section.key === key)?.content;
  return content && typeof content === "object" && !Array.isArray(content)
    ? (content as Record<string, unknown>)
    : null;
}

export function contentText(
  content: Record<string, unknown> | null,
  field: string,
  fallback: string,
): string {
  const value = content?.[field];
  return typeof value === "string" && value.trim() ? value : fallback;
}
