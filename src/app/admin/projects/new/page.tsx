import ProjectForm from "@/components/admin/ProjectForm";
import { prisma } from "@/lib/prisma";

export default async function NewAdminProjectPage() {
  const companies=await prisma.company.findMany({where:{status:"ACTIVE"},select:{id:true,name:true},orderBy:{sortOrder:"asc"}});
  return <ProjectForm mode="create" companies={companies} />;
}
