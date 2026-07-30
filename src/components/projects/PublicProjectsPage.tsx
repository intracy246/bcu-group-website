import Link from "next/link";
import ProjectsDirectory from "@/components/projects/ProjectsDirectory";
import type { CompanyProfile } from "@/data/companies";
import type { ProjectDTO } from "@/lib/project-service";

export default function PublicProjectsPage({ projects }: { projects: ProjectDTO[] }) {
  const grouped = Array.from(new Set(projects.map((project) => project.companySlug))).map((slug) => {
    const rows=projects.filter((project)=>project.companySlug===slug); const first=rows[0]!;
    return {id:first.companyId,name:first.company,shortName:first.company,slug,legalName:first.company,tagline:"",description:"",mission:"",vision:"",logo:first.logo,theme:slug==="rfc"?"rfc":"smartcycle",sectors:Array.from(new Set(rows.map(row=>row.category))),projects:rows.map(row=>({id:row.id,name:row.name,slug:row.slug,summary:row.summary,description:row.description,category:row.category,status:"Active" as const,featured:row.featured,tags:row.tags}))} satisfies CompanyProfile;
  });
  return <><section className="projects-page-hero"><div className="projects-page-hero__grid"/><div className="projects-page-hero__gold-glow"/><div className="section-container projects-page-hero__container"><div className="projects-page-hero__content"><p className="section-kicker">BCU Group Portfolio</p><h1>Projects designed to <span>transform industries.</span></h1><p>Explore published businesses, technologies and strategic initiatives across BCU Group.</p><div className="projects-page-hero__actions"><a href="#project-directory" className="button button--gold">Explore All Projects</a><Link href="/companies" className="button button--outline">View Our Companies</Link></div></div><div className="projects-page-hero__metrics"><div><strong>{projects.length}</strong><span>Published projects</span></div><div><strong>{projects.filter(item=>item.featured).length}</strong><span>Featured projects</span></div><div><strong>{grouped.length}</strong><span>Operating companies</span></div></div></div></section><div id="project-directory"><ProjectsDirectory companies={grouped}/></div></>;
}
