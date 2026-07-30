import { notFound } from "next/navigation";
import ProjectForm from "@/components/admin/ProjectForm";
import { listAdminProjects } from "@/lib/project-service";
import { prisma } from "@/lib/prisma";
export default async function Page({params}:{params:Promise<{id:string}>}){const id=(await params).id;const [projects,companies]=await Promise.all([listAdminProjects(),prisma.company.findMany({select:{id:true,name:true},orderBy:{sortOrder:"asc"}})]);const project=projects.find(item=>item.id===id);if(!project)notFound();return <ProjectForm mode="edit" project={project} companies={companies}/>;}
