import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { toPublicTeam } from "./team-mapping";
export const teamInclude = { portfolioProjects: { orderBy: [{ displayOrder: "asc" as const }, { id: "asc" as const }], include: { project: { include: { company: true } } } } };
export const getPublicTeamMember = cache(async (slug: string) => {
  const row = await prisma.teamMember.findFirst({ where: { slug, published: true }, include: teamInclude });
  return row ? toPublicTeam(row) : null;
});
export async function getTeamFormOptions() {
  const [media, projects] = await Promise.all([
    prisma.mediaAsset.findMany({ where: { mimeType: { in: ["image/jpeg", "image/png", "image/webp"] }, storageKey: { startsWith: "public/" } }, select: { url: true, fileName: true }, orderBy: { createdAt: "desc" } }),
    prisma.project.findMany({ select: { id: true, title: true }, orderBy: { title: "asc" } }),
  ]);
  return { media, projects };
}
