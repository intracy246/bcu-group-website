import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base=(process.env.NEXT_PUBLIC_SITE_URL??"http://localhost:3000").replace(/\/$/,"");
  const tomorrow = new Date();
  tomorrow.setUTCHours(24, 0, 0, 0);
  const [news,projects,companies,careers]=await Promise.all([
    prisma.newsArticle.findMany({where:{status:"PUBLISHED",publishedAt:{lt:tomorrow}},select:{slug:true,updatedAt:true}}),
    prisma.project.findMany({where:{status:"PUBLISHED"},select:{slug:true,updatedAt:true,company:{select:{slug:true}}}}),
    prisma.company.findMany({where:{status:"ACTIVE"},select:{slug:true,updatedAt:true}}),
    prisma.career.findMany({where:{status:"OPEN"},select:{slug:true,updatedAt:true}}),
  ]);
  const staticRoutes=["","/about","/companies","/projects","/impact","/news","/careers","/contact"].map(route=>({url:`${base}${route}`,lastModified:new Date()}));
  return [...staticRoutes,
    ...news.map(item=>({url:`${base}/news/${item.slug}`,lastModified:item.updatedAt})),
    ...projects.map(item=>({url:`${base}/companies/${item.company.slug}/projects/${item.slug.replace(`${item.company.slug}-`,"")}`,lastModified:item.updatedAt})),
    ...companies.map(item=>({url:`${base}/companies/${item.slug}`,lastModified:item.updatedAt})),
    ...careers.map(item=>({url:`${base}/careers/${item.slug}`,lastModified:item.updatedAt})),
  ];
}
