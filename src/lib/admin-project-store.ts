import { starterAdminProjects } from "@/data/admin-projects";
import type {
  AdminProject,
  AdminProjectFormData,
} from "@/types/admin-project";

const STORAGE_KEY = "BCU_ADMIN_PROJECTS";

function canUseStorage() {
  return typeof window !== "undefined";
}

export function getAdminProjects(): AdminProject[] {
  if (!canUseStorage()) {
    return starterAdminProjects;
  }

  const storedProjects = window.localStorage.getItem(STORAGE_KEY);

  if (!storedProjects) {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(starterAdminProjects)
    );

    return starterAdminProjects;
  }

  try {
    return JSON.parse(storedProjects) as AdminProject[];
  } catch {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(starterAdminProjects)
    );

    return starterAdminProjects;
  }
}

export function getAdminProjectById(
  id: string
): AdminProject | undefined {
  return getAdminProjects().find(
    (project) => project.id === id
  );
}

export function createAdminProject(
  formData: AdminProjectFormData
): AdminProject {
  const projects = getAdminProjects();
  const timestamp = new Date().toISOString();

  const project: AdminProject = {
    ...formData,
    id: crypto.randomUUID(),
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([project, ...projects])
  );

  return project;
}

export function updateAdminProject(
  id: string,
  formData: AdminProjectFormData
): AdminProject | undefined {
  const projects = getAdminProjects();
  const existingProject = projects.find(
    (project) => project.id === id
  );

  if (!existingProject) {
    return undefined;
  }

  const updatedProject: AdminProject = {
    ...existingProject,
    ...formData,
    updatedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      projects.map((project) =>
        project.id === id ? updatedProject : project
      )
    )
  );

  return updatedProject;
}

export function deleteAdminProject(id: string) {
  const projects = getAdminProjects();

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      projects.filter((project) => project.id !== id)
    )
  );
}