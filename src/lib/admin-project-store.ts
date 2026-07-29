import { starterAdminProjects } from "@/data/admin-projects";
import type {
  AdminProject,
  AdminProjectFormData,
} from "@/types/admin-project";

export const ADMIN_PROJECTS_STORAGE_KEY =
  "BCU_ADMIN_PROJECTS_V2";

export const ADMIN_PROJECTS_UPDATED_EVENT =
  "bcu-admin-projects-updated";

function canUseStorage() {
  return typeof window !== "undefined";
}

function notifyProjectsUpdated() {
  if (!canUseStorage()) {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(ADMIN_PROJECTS_UPDATED_EVENT)
  );
}

function saveProjects(projects: AdminProject[]) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(
    ADMIN_PROJECTS_STORAGE_KEY,
    JSON.stringify(projects)
  );

  notifyProjectsUpdated();
}

export function getAdminProjects(): AdminProject[] {
  if (!canUseStorage()) {
    return starterAdminProjects;
  }

  const storedProjects = window.localStorage.getItem(
    ADMIN_PROJECTS_STORAGE_KEY
  );

  if (!storedProjects) {
    saveProjects(starterAdminProjects);
    return starterAdminProjects;
  }

  try {
    const parsedProjects = JSON.parse(
      storedProjects
    ) as AdminProject[];

    if (!Array.isArray(parsedProjects)) {
      throw new Error("Invalid projects data");
    }

    return parsedProjects;
  } catch {
    saveProjects(starterAdminProjects);
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

export function getAdminProjectBySlug(
  slug: string
): AdminProject | undefined {
  return getAdminProjects().find(
    (project) => project.slug === slug
  );
}

export function createAdminProject(
  formData: AdminProjectFormData
): AdminProject {
  const projects = getAdminProjects();
  const timestamp = new Date().toISOString();

  const newProject: AdminProject = {
    ...formData,
    id: crypto.randomUUID(),
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  saveProjects([newProject, ...projects]);

  return newProject;
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

  const updatedProjects = projects.map((project) =>
    project.id === id ? updatedProject : project
  );

  saveProjects(updatedProjects);

  return updatedProject;
}

export function deleteAdminProject(id: string) {
  const projects = getAdminProjects();

  const remainingProjects = projects.filter(
    (project) => project.id !== id
  );

  saveProjects(remainingProjects);
}

export function resetAdminProjects() {
  saveProjects(starterAdminProjects);
}