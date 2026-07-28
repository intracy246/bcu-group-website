"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  deleteAdminProject,
  getAdminProjects,
} from "@/lib/admin-project-store";
import type {
  AdminProject,
  AdminProjectCompany,
  AdminProjectStatus,
} from "@/types/admin-project";

type StatusFilter = "All" | AdminProjectStatus;
type CompanyFilter = "All" | AdminProjectCompany;

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default function ProjectsManager() {
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("All");
  const [companyFilter, setCompanyFilter] =
    useState<CompanyFilter>("All");

  useEffect(() => {
    setProjects(getAdminProjects());
  }, []);

  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return projects
      .filter((project) => {
        const matchesSearch =
          query.length === 0 ||
          project.name.toLowerCase().includes(query) ||
          project.category.toLowerCase().includes(query) ||
          project.company.toLowerCase().includes(query) ||
          project.summary.toLowerCase().includes(query);

        const matchesStatus =
          statusFilter === "All" ||
          project.status === statusFilter;

        const matchesCompany =
          companyFilter === "All" ||
          project.company === companyFilter;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesCompany
        );
      })
      .sort(
        (first, second) =>
          first.displayOrder - second.displayOrder
      );
  }, [
    companyFilter,
    projects,
    searchQuery,
    statusFilter,
  ]);

  const handleDelete = (project: AdminProject) => {
    const confirmed = window.confirm(
      `Delete "${project.name}"?\n\nThis action will remove the project from the current admin data.`
    );

    if (!confirmed) {
      return;
    }

    deleteAdminProject(project.id);

    setProjects((current) =>
      current.filter((item) => item.id !== project.id)
    );
  };

  const publishedCount = projects.filter(
    (project) => project.status === "Published"
  ).length;

  const draftCount = projects.filter(
    (project) => project.status === "Draft"
  ).length;

  const featuredCount = projects.filter(
    (project) => project.featured
  ).length;

  return (
    <div className="admin-projects-page">
      <section className="admin-page-intro">
        <div>
          <p>Project Management</p>

          <h2>
            Manage every
            <span>BCU Group project.</span>
          </h2>

          <p>
            Create, view, edit, publish and remove projects
            belonging to BCU Group, Ready Food Company and
            SmartCycle Technologies.
          </p>
        </div>

        <Link
          href="/admin/projects/new"
          className="admin-primary-button"
        >
          Add Project
          <span>＋</span>
        </Link>
      </section>

      <section className="admin-company-summary">
        <article>
          <span>Total Projects</span>
          <strong>{projects.length}</strong>
          <p>Registered group projects</p>
        </article>

        <article>
          <span>Published</span>
          <strong>{publishedCount}</strong>
          <p>Visible public projects</p>
        </article>

        <article>
          <span>Draft Projects</span>
          <strong>{draftCount}</strong>
          <p>Projects under preparation</p>
        </article>

        <article>
          <span>Featured</span>
          <strong>{featuredCount}</strong>
          <p>Priority portfolio projects</p>
        </article>
      </section>

      <section className="admin-data-panel">
        <div className="admin-data-panel__toolbar">
          <div>
            <p>Project Directory</p>
            <h3>All projects</h3>
          </div>

          <div className="admin-project-controls">
            <label className="admin-search-field">
              <span>Search projects</span>

              <input
                type="search"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Project, company or category..."
              />
            </label>

            <label className="admin-select-field">
              <span>Company</span>

              <select
                value={companyFilter}
                onChange={(event) =>
                  setCompanyFilter(
                    event.target.value as CompanyFilter
                  )
                }
              >
                <option>All</option>
                <option>BCU Group</option>
                <option>Ready Food Company</option>
                <option>SmartCycle Technologies</option>
              </select>
            </label>

            <label className="admin-select-field">
              <span>Status</span>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as StatusFilter
                  )
                }
              >
                <option>All</option>
                <option>Published</option>
                <option>Draft</option>
                <option>Archived</option>
              </select>
            </label>
          </div>
        </div>

        <div className="admin-table-result">
          <strong>{filteredProjects.length}</strong>
          <span>
            {filteredProjects.length === 1
              ? "Project"
              : "Projects"}
          </span>
        </div>

        {filteredProjects.length > 0 ? (
          <div className="admin-project-table">
            <div className="admin-project-table__header">
              <span>Project</span>
              <span>Company</span>
              <span>Category</span>
              <span>Status</span>
              <span>Updated</span>
              <span>Actions</span>
            </div>

            {filteredProjects.map((project) => (
              <article
                key={project.id}
                className="admin-project-row"
              >
                <div className="admin-project-row__identity">
                  <div className="admin-project-row__logo">
                    {project.logo ? (
                      <Image
                        src={project.logo}
                        alt={`${project.name} logo`}
                        fill
                        sizes="62px"
                      />
                    ) : (
                      <span>
                        {project.name
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div>
                    <strong>{project.name}</strong>
                    <span>/{project.slug}</span>
                    <small>{project.summary}</small>
                  </div>
                </div>

                <div className="admin-project-row__company">
                  <strong>{project.company}</strong>

                  {project.featured && (
                    <span>Featured</span>
                  )}
                </div>

                <div className="admin-project-row__category">
                  <span>{project.category}</span>
                </div>

                <div>
                  <span
                    className={`admin-status-badge admin-status-badge--${project.status.toLowerCase()}`}
                  >
                    <i />
                    {project.status}
                  </span>
                </div>

                <div className="admin-project-row__date">
                  <strong>
                    {formatDate(project.updatedAt)}
                  </strong>
                  <span>Last update</span>
                </div>

                <div className="admin-project-row__actions">
                  <Link
                    href={`/admin/projects/${project.id}`}
                  >
                    View
                  </Link>

                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                  >
                    Edit
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDelete(project)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="admin-empty-state">
            <span>No Projects Found</span>

            <h3>
              No projects match the selected filters.
            </h3>

            <p>
              Change the filters or create a new project.
            </p>

            <Link
              href="/admin/projects/new"
              className="admin-primary-button"
            >
              Create Project
              <span>＋</span>
            </Link>
          </div>
        )}

        <div className="admin-table-footer">
          <p>
            Showing {filteredProjects.length} of{" "}
            {projects.length} projects
          </p>
        </div>
      </section>
    </div>
  );
}