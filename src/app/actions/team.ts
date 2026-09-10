"use server";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { teamInputSchema } from "@/lib/team-validation";
type Result = { ok: true; id: string } | { ok: false; error: string };
function refresh(slugs: string[]) {
  for (const path of ["/team", "/admin/team", "/sitemap.xml", ...slugs.map(s => `/team/${s}`)]) revalidatePath(path);
  revalidatePath("/admin/team/[id]", "page"); revalidatePath("/admin/team/[id]/edit", "page");
}
function failure(error: unknown): Result {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return { ok: false, error: "That profile slug is already in use. Choose another slug." };
  return { ok: false, error: error instanceof Error && error.message.startsWith("Selected") ? error.message : "Unable to save the team change. Please try again." };
}
export async function saveTeamAction(id: string | null, input: unknown): Promise<Result> {
  const user = await requireUser(["SUPER_ADMIN", "ADMIN", "EDITOR"]);
  const parsed = teamInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: `${parsed.error.issues[0]?.path.join(".")}: ${parsed.error.issues[0]?.message}` };
  if (id !== null && !z.string().cuid().safeParse(id).success) return { ok: false, error: "Invalid member." };
  try {
    const saved = await prisma.$transaction(async tx => {
      const { portfolioProjects, ...data } = parsed.data;
      const urls = [...new Set([data.photo, ...portfolioProjects.map(p => p.image)].filter(Boolean))];
      const assets = await tx.mediaAsset.findMany({ where: { url: { in: urls }, storageKey: { startsWith: "public/" }, mimeType: { in: ["image/jpeg", "image/png", "image/webp"] } } });
      if (assets.length !== urls.length) throw new Error("Selected images must exist in the public media library.");
      const projectIds = [...new Set(portfolioProjects.map(p => p.projectId).filter(Boolean))];
      if (await tx.project.count({ where: { id: { in: projectIds } } }) !== projectIds.length) throw new Error("Selected project no longer exists.");
      const previous = id ? await tx.teamMember.findUniqueOrThrow({ where: { id } }) : null;
      const projects = portfolioProjects.map(p => ({ ...p, projectId: p.projectId || null }));
      const row = id ? await tx.teamMember.update({ where: { id }, data: { ...data, portfolioProjects: { deleteMany: {}, create: projects } } }) : await tx.teamMember.create({ data: { ...data, portfolioProjects: { create: projects } } });
      await tx.auditLog.create({ data: { userId: user.id, action: id ? "UPDATE" : "CREATE", entityType: "TeamMember", entityId: row.id, summary: `${id ? "Updated" : "Created"} ${row.name}` } });
      return { row, previous };
    });
    refresh([saved.row.slug, ...(saved.previous ? [saved.previous.slug] : [])]);
    return { ok: true, id: saved.row.id };
  } catch (error) { return failure(error); }
}
const changeSchema = z.discriminatedUnion("action", [z.object({ action: z.literal("delete") }), z.object({ action: z.literal("publish"), published: z.boolean() }), z.object({ action: z.literal("order"), displayOrder: z.number().int().min(0).max(100000) })]);
export async function changeTeamAction(id: string, input: unknown): Promise<Result> {
  const user = await requireUser(["SUPER_ADMIN", "ADMIN", "EDITOR"]);
  const parsed = changeSchema.safeParse(input);
  if (!z.string().cuid().safeParse(id).success || !parsed.success) return { ok: false, error: "Invalid team change." };
  try {
    const row = await prisma.$transaction(async tx => {
      const previous = await tx.teamMember.findUniqueOrThrow({ where: { id } });
      const change = parsed.data;
      if (change.action === "delete") await tx.teamMember.delete({ where: { id } });
      else await tx.teamMember.update({ where: { id }, data: change.action === "publish" ? { published: change.published } : { displayOrder: change.displayOrder } });
      await tx.auditLog.create({ data: { userId: user.id, action: change.action.toUpperCase(), entityType: "TeamMember", entityId: id, summary: `${change.action} ${previous.name}`, metadata: change } });
      return previous;
    });
    refresh([row.slug]); return { ok: true, id };
  } catch (error) { return failure(error); }
}
