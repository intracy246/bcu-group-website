"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CompanyProfile, ProjectStatus } from "@/data/companies";

type ProjectsDirectoryProps = {
  companies: CompanyProfile[];
};

type CompanyFilter = "all" | "rfc" | "smartcycle";

const statusOptions: Array<"All" | ProjectStatus> = [
  "All",
  "Active",
  "Development",
  "Expansion",
  "Planned",
  "Research",
];

export default function ProjectsDirectory({
  companies,
}: ProjectsDirectoryProps) {
  const [companyFilter, setCompanyFilter] =
    useState<CompanyFilter>("all");

  const [statusFilter, setStatusFilter] =
    useState<"All" | ProjectStatus>("All");

  const [searchQuery, setSearchQuery] = useState("");

  const allProjects = useMemo(
    () =>
      companies.flatMap((company) =>
        company.projects.map((project) => ({
          ...project,
          companyName: company.name,
          companyShortName: company.shortName,
          companySlug: company.slug,
          companyTheme: company.theme,
        }))
      ),
    [companies]
  );

  const filteredProjects = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return allProjects.filter((project) => {
      const matchesCompany =
        companyFilter === "all" ||
        project.companySlug === companyFilter;

      const matchesStatus =
        statusFilter === "All" ||
        project.status === statusFilter;

      const matchesSearch =
        normalizedQuery.length === 0 ||
        project.name.toLowerCase().includes(normalizedQuery) ||
        project.summary.toLowerCase().includes(normalizedQuery) ||
        project.category.toLowerCase().includes(normalizedQuery) ||
        project.tags.some((tag) =>
          tag.toLowerCase().includes(normalizedQuery)
        );

      return matchesCompany && matchesStatus && matchesSearch;
    });
  }, [
    allProjects,
    companyFilter,
    searchQuery,
    statusFilter,
  ]);

  const clearFilters = () => {
    setCompanyFilter("all");
    setStatusFilter("All");
    setSearchQuery("");
  };

  return (
    <section className="projects-directory section">
      <div className="section-container">
        <div className="projects-directory__toolbar">
          <div className="projects-directory__company-filters">
            <button
              type="button"
              className={
                companyFilter === "all"
                  ? "project-filter-button project-filter-button--active"
                  : "project-filter-button"
              }
              onClick={() => setCompanyFilter("all")}
            >
              All Projects
            </button>

            <button
              type="button"
              className={
                companyFilter === "rfc"
                  ? "project-filter-button project-filter-button--rfc project-filter-button--active"
                  : "project-filter-button project-filter-button--rfc"
              }
              onClick={() => setCompanyFilter("rfc")}
            >
              Ready Food Company
            </button>

            <button
              type="button"
              className={
                companyFilter === "smartcycle"
                  ? "project-filter-button project-filter-button--smartcycle project-filter-button--active"
                  : "project-filter-button project-filter-button--smartcycle"
              }
              onClick={() => setCompanyFilter("smartcycle")}
            >
              SmartCycle Technologies
            </button>
          </div>

          <div className="projects-directory__controls">
            <label className="projects-search">
              <span>Search projects</span>

              <input
                type="search"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Search by name, sector or keyword..."
              />
            </label>

            <label className="projects-status-filter">
              <span>Project status</span>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as "All" | ProjectStatus
                  )
                }
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="projects-directory__results">
          <div>
            <strong>{filteredProjects.length}</strong>
            <span>
              {filteredProjects.length === 1
                ? "Project found"
                : "Projects found"}
            </span>
          </div>

          {(companyFilter !== "all" ||
            statusFilter !== "All" ||
            searchQuery.length > 0) && (
            <button
              type="button"
              onClick={clearFilters}
              className="projects-clear-button"
            >
              Clear filters
              <span aria-hidden="true">×</span>
            </button>
          )}
        </div>

        {filteredProjects.length > 0 ? (
          <div className="projects-portfolio-grid">
            {filteredProjects.map((project, index) => (
              <article
                key={project.id}
                className={`portfolio-project-card portfolio-project-card--${project.companyTheme}`}
              >
                <div className="portfolio-project-card__glow" />

                <div className="portfolio-project-card__header">
                  <span>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span
                    className={`portfolio-project-card__status portfolio-project-card__status--${project.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {project.status}
                  </span>
                </div>

                <div className="portfolio-project-card__company">
                  <span>{project.companyShortName}</span>
                  <p>{project.category}</p>
                </div>

                <div className="portfolio-project-card__content">
                  {project.shortName && (
                    <p className="portfolio-project-card__short-name">
                      {project.shortName}
                    </p>
                  )}

                  <h2>{project.name}</h2>

                  <p>{project.summary}</p>
                </div>

                <div className="portfolio-project-card__tags">
                  {project.tags.slice(0, 4).map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>

                <div className="portfolio-project-card__footer">
                  <div>
                    <span>Parent company</span>
                    <strong>{project.companyName}</strong>
                  </div>

                  <Link
                    href={`/companies/${project.companySlug}/projects/${project.slug}`}
                  >
                    View Project
                    <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="projects-empty-state">
            <span>0 results</span>

            <h2>No projects match your filters.</h2>

            <p>
              Change the company, status or search keyword to
              view available projects.
            </p>

            <button type="button" onClick={clearFilters}>
              View all projects
            </button>
          </div>
        )}
      </div>
    </section>
  );
}