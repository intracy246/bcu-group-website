import "server-only";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const counts = { _count: { select: { projects: true, articles: true, careers: true } } } satisfies Prisma.CompanyInclude;
type CompanyRow = Prisma.CompanyGetPayload<{ include: typeof counts }>;
export type CompanyDTO = {
  id:string;name:string;slug:string;shortName:string;summary:string;description:string;logoUrl:string;
  coverImageUrl:string;websiteUrl:string;email:string;phone:string;location:string;industry:string;
  status:"Draft"|"Active"|"Inactive"|"Archived";featured:boolean;sortOrder:number;seoTitle:string;
  seoDescription:string;createdAt:string;updatedAt:string;related:{projects:number;news:number;careers:number};
};
export function toCompanyDTO(row:CompanyRow):CompanyDTO{return{id:row.id,name:row.name,slug:row.slug,shortName:row.shortName,summary:row.summary,description:row.description,logoUrl:row.logoUrl??"",coverImageUrl:row.coverImageUrl??"",websiteUrl:row.websiteUrl??"",email:row.email??"",phone:row.phone??"",location:row.location??"",industry:row.industry??"",status:row.status==="ACTIVE"?"Active":row.status==="INACTIVE"?"Inactive":row.status==="ARCHIVED"?"Archived":"Draft",featured:row.featured,sortOrder:row.sortOrder,seoTitle:row.seoTitle??"",seoDescription:row.seoDescription??"",createdAt:row.createdAt.toISOString(),updatedAt:row.updatedAt.toISOString(),related:{projects:row._count.projects,news:row._count.articles,careers:row._count.careers}};}
export async function listAdminCompanies():Promise<CompanyDTO[]>{return(await prisma.company.findMany({include:counts,orderBy:[{sortOrder:"asc"},{name:"asc"}]})).map(toCompanyDTO);}
export async function getAdminCompany(id:string):Promise<CompanyDTO|null>{const row=await prisma.company.findUnique({where:{id},include:counts});return row?toCompanyDTO(row):null;}
export async function listPublicCompanies():Promise<CompanyDTO[]>{return(await prisma.company.findMany({where:{status:"ACTIVE"},include:counts,orderBy:[{sortOrder:"asc"},{name:"asc"}]})).map(toCompanyDTO);}
