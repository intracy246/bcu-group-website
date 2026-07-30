"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { safeJsonSchema } from "@/lib/site-content";

const sectionSchema = z.object({
  id: z.string().cuid(),
  key: z.string().regex(/^[a-z0-9-]+$/).max(80),
  type: z.string().regex(/^[a-z0-9-]+$/).max(80),
  sortOrder: z.coerce.number().int().min(0).max(1000),
  visible: z.boolean(),
  content: safeJsonSchema,
});

export async function savePageSectionAction(form: FormData) {
  const actor = await requireUser(["SUPER_ADMIN", "ADMIN", "EDITOR"]);
  const parsed = sectionSchema.parse({
    id: form.get("id"),
    key: form.get("key"),
    type: form.get("type"),
    sortOrder: form.get("sortOrder"),
    visible: form.get("visible") === "on",
    content: JSON.parse(z.string().max(100_000).parse(form.get("content"))),
  });
  const existing = await prisma.pageSection.findUnique({
    where: { id: parsed.id },
    select: { page: { select: { slug: true, key: true } } },
  });
  if (!existing) throw new Error("Page section not found.");
  await prisma.$transaction([
    prisma.pageSection.update({
      where: { id: parsed.id },
      data: {
        key: parsed.key,
        type: parsed.type,
        sortOrder: parsed.sortOrder,
        visible: parsed.visible,
        content: parsed.content as never,
      },
    }),
    prisma.auditLog.create({
      data: {
        userId: actor.id,
        action: "UPDATE",
        entityType: "PageSection",
        entityId: parsed.id,
        summary: `Updated ${existing.page.key}/${parsed.key}`,
      },
    }),
  ]);
  revalidatePath(existing.page.slug);
  revalidatePath("/admin/content");
}
