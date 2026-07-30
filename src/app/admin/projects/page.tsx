import ProjectsManager from "@/components/admin/ProjectsManager";
import { listAdminProjects } from "@/lib/project-service";

export default async function AdminProjectsPage() {
  return <ProjectsManager initialProjects={await listAdminProjects()} />;
}
