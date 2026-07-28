"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createAdminProject,
  updateAdminProject,
} from "@/lib/admin-project-store";
import type {
  AdminProject,
  AdminProjectCompany,
  AdminProjectFormData,
  AdminProjectStatus,
} from "@/types/admin-project";

type ProjectFormProps = {
  mode: "create" | "edit";
  project?: AdminProject;
};

function createSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const initialFormData: AdminProjectFormData = {
  name: "",
  slug: "",
  company: "SmartCycle Technologies",
  category: "",
  status: "Draft",
  summary: "",
  description: "",
  logo: "",
  coverImage: "",
  featured: false,
  displayOrder: 1,
};

export default function ProjectForm({
  mode,
  project,
}: ProjectFormProps) {
  const router = useRouter();

  const [formData, setFormData] =
    useState<AdminProjectFormData>(
      project
        ? {
            name: project.name,
            slug: project.slug,
            company: project.company,
            category: project.category,
            status: project.status,
            summary: project.summary,
            description: project.description,
            logo: project.logo,
            coverImage: project.coverImage,
            featured: project.featured,
            displayOrder: project.displayOrder,
          }
        : initialFormData
    );

  const [slugEdited, setSlugEdited] = useState(
    Boolean(project)
  );

  const [error, setError] = useState("");

  const pageTitle = useMemo(
    () =>
      mode === "create"
        ? "Create New Project"
        : `Edit ${project?.name ?? "Project"}`,
    [mode, project]
  );

  const updateField = <
    Key extends keyof AdminProjectFormData,
  >(
    key: Key,
    value: AdminProjectFormData[Key]
  ) => {
    setFormData((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleNameChange = (value: string) => {
    setFormData((current) => ({
      ...current,
      name: value,
      slug: slugEdited
        ? current.slug
        : createSlug(value),
    }));
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError("");

    if (
      !formData.name.trim() ||
      !formData.slug.trim() ||
      !formData.category.trim() ||
      !formData.summary.trim()
    ) {
      setError(
        "Project name, slug, category and summary are required."
      );
      return;
    }

    if (mode === "create") {
      const createdProject =
        createAdminProject(formData);

      router.push(
        `/admin/projects/${createdProject.id}`
      );
      return;
    }

    if (!project) {
      setError("The project could not be identified.");
      return;
    }

    updateAdminProject(project.id, formData);
    router.push(`/admin/projects/${project.id}`);
  };

  return (
    <div className="admin-project-form-page">
      <div className="admin-form-page__header">
        <div>
          <Link href="/admin/projects">
            ← Back to Projects
          </Link>

          <p>Project Management</p>
          <h2>{pageTitle}</h2>

          <span>
            Add and manage project information displayed
            across the BCU Group website.
          </span>
        </div>
      </div>

      <form
        className="admin-project-form"
        onSubmit={handleSubmit}
      >
        <section className="admin-form-section">
          <div className="admin-form-section__heading">
            <span>01</span>

            <div>
              <h3>Basic Information</h3>
              <p>
                Project identity, ownership and
                classification.
              </p>
            </div>
          </div>

          <div className="admin-form-grid">
            <label className="admin-form-field">
              <span>Project name *</span>

              <input
                type="text"
                value={formData.name}
                onChange={(event) =>
                  handleNameChange(event.target.value)
                }
                placeholder="Example: SmartCampus360"
                required
              />
            </label>

            <label className="admin-form-field">
              <span>Slug *</span>

              <input
                type="text"
                value={formData.slug}
                onChange={(event) => {
                  setSlugEdited(true);
                  updateField(
                    "slug",
                    createSlug(event.target.value)
                  );
                }}
                placeholder="smartcampus360"
                required
              />
            </label>

            <label className="admin-form-field">
              <span>Company *</span>

              <select
                value={formData.company}
                onChange={(event) =>
                  updateField(
                    "company",
                    event.target
                      .value as AdminProjectCompany
                  )
                }
              >
                <option>BCU Group</option>
                <option>Ready Food Company</option>
                <option>
                  SmartCycle Technologies
                </option>
              </select>
            </label>

            <label className="admin-form-field">
              <span>Category *</span>

              <input
                type="text"
                value={formData.category}
                onChange={(event) =>
                  updateField(
                    "category",
                    event.target.value
                  )
                }
                placeholder="Education Technology"
                required
              />
            </label>

            <label className="admin-form-field">
              <span>Status</span>

              <select
                value={formData.status}
                onChange={(event) =>
                  updateField(
                    "status",
                    event.target
                      .value as AdminProjectStatus
                  )
                }
              >
                <option>Draft</option>
                <option>Published</option>
                <option>Archived</option>
              </select>
            </label>

            <label className="admin-form-field">
              <span>Display order</span>

              <input
                type="number"
                min="1"
                value={formData.displayOrder}
                onChange={(event) =>
                  updateField(
                    "displayOrder",
                    Number(event.target.value)
                  )
                }
              />
            </label>

            <label className="admin-form-field admin-form-field--full">
              <span>Summary *</span>

              <textarea
                rows={4}
                value={formData.summary}
                onChange={(event) =>
                  updateField(
                    "summary",
                    event.target.value
                  )
                }
                placeholder="Provide a concise project summary."
                required
              />
            </label>

            <label className="admin-form-field admin-form-field--full">
              <span>Full description</span>

              <textarea
                rows={9}
                value={formData.description}
                onChange={(event) =>
                  updateField(
                    "description",
                    event.target.value
                  )
                }
                placeholder="Explain what the project does, who it serves and its intended impact."
              />
            </label>
          </div>
        </section>

        <section className="admin-form-section">
          <div className="admin-form-section__heading">
            <span>02</span>

            <div>
              <h3>Branding and Media</h3>
              <p>
                Add paths for the logo and project cover
                image.
              </p>
            </div>
          </div>

          <div className="admin-form-grid">
            <label className="admin-form-field">
              <span>Logo path</span>

              <input
                type="text"
                value={formData.logo}
                onChange={(event) =>
                  updateField(
                    "logo",
                    event.target.value
                  )
                }
                placeholder="/brands/smartcycle-new.png"
              />
            </label>

            <label className="admin-form-field">
              <span>Cover image path</span>

              <input
                type="text"
                value={formData.coverImage}
                onChange={(event) =>
                  updateField(
                    "coverImage",
                    event.target.value
                  )
                }
                placeholder="/projects/project-cover.jpg"
              />
            </label>

            <label className="admin-form-checkbox">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(event) =>
                  updateField(
                    "featured",
                    event.target.checked
                  )
                }
              />

              <span>
                Feature this project on priority areas of
                the website.
              </span>
            </label>
          </div>
        </section>

        {error && (
          <div className="admin-form-error">
            {error}
          </div>
        )}

        <div className="admin-form-actions">
          <Link href="/admin/projects">
            Cancel
          </Link>

          <button
            type="submit"
            className="admin-primary-button"
          >
            {mode === "create"
              ? "Create Project"
              : "Save Changes"}

            <span>→</span>
          </button>
        </div>
      </form>
    </div>
  );
}