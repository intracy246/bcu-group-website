import "server-only";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { safeParagraphArray, safeStringArray } from "@/lib/json-safety";

const includeCompany = { company: { select: { id: true, name: true, shortName: true, slug: true, logoUrl: true, industry: true } } } satisfies Prisma.ProjectInclude;
type Row = Prisma.ProjectGetPayload<{ include: typeof includeCompany }>;
export type ProjectDTO = {
  id:string; name:string; slug:string; summary:string; description:string; category:string;
  status:"Draft"|"Published"|"Archived"; featured:boolean; tags:string[]; logo:string; coverImage:string;
  coverImageAlt:string; companyId:string; company:string; companySlug:string; location:string;
  startDate:string|null; completionDate:string|null; displayOrder:number; seoTitle:string; seoDescription:string;
  createdAt:string; updatedAt:string;
};
export function toProjectDTO(row: Row): ProjectDTO {
  return { id:row.id,name:row.title,slug:row.slug.replace(`${row.company.slug}-`,""),summary:row.summary,
    description:safeParagraphArray(row.description).join("\n\n"),category:row.category,
    status:row.status==="PUBLISHED"?"Published":row.status==="ARCHIVED"?"Archived":"Draft",
    featured:row.featured,tags:safeStringArray(row.tags),logo:row.company.logoUrl??"",coverImage:row.coverImageUrl??"",
    coverImageAlt:row.coverImageAlt??row.title,companyId:row.companyId,company:row.company.name,companySlug:row.company.slug,
    location:row.location??"",startDate:row.startDate?.toISOString()??null,completionDate:row.completionDate?.toISOString()??null,
    displayOrder:row.sortOrder,seoTitle:row.seoTitle??"",seoDescription:row.seoDescription??"",
    createdAt:row.createdAt.toISOString(),updatedAt:row.updatedAt.toISOString() };
}
export async function listPublishedProjects() {
  return (await prisma.project.findMany({where:{status:"PUBLISHED",company:{status:"ACTIVE"}},include:includeCompany,orderBy:[{sortOrder:"asc"},{title:"asc"}]})).map(toProjectDTO);
}
export async function listAdminProjects() {
  return (await prisma.project.findMany({include:includeCompany,orderBy:[{sortOrder:"asc"},{updatedAt:"desc"}]})).map(toProjectDTO);
}
