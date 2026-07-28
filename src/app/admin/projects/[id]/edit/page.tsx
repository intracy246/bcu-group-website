"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProjectForm from "@/components/admin/ProjectForm";
import { getAdminProjectById } from "@/lib/admin-project-store";
import type { AdminProject } from "@/types/admin-project";

export default function EditAdminProjectPage() {
  const params = useParams<{ id: string }>();

  const [project, setProject] =
    useState<AdminProject | null>(null);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setProject(getAdminProjectById(params.id) ?? null);
    setLoaded(true);
  }, [params.id]);

  if (!loaded) {
    return (
      <div className="admin-project-loading">
        Loading project...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="admin-empty-state">
        <span>Project Not Found</span>
        <h3>The requested project does not exist.</h3>
      </div>
    );
  }

  return (
    <ProjectForm
      mode="edit"
      project={project}
    />
  );
}