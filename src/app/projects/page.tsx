import PublicProjectsPage from "@/components/projects/PublicProjectsPage";
import { listPublishedProjects } from "@/lib/project-service";

export const dynamic = "force-dynamic";
export default async function ProjectsPage() {
  return <PublicProjectsPage projects={await listPublishedProjects()} />;
}
