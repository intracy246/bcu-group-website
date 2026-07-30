"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CareerDTO } from "@/lib/career-service";

type CareersDirectoryProps = {
  jobs: CareerDTO[];
};
function getCompanyTheme(company: string) {
  if (company === "Ready Food Company") {
    return "rfc";
  }

  if (company === "SmartCycle Technologies") {
    return "smartcycle";
  }

  return "bcu";
}

export default function CareersDirectory({
  jobs,
}: CareersDirectoryProps) {
  const [companyFilter, setCompanyFilter] =
    useState("All");

  const [employmentFilter, setEmploymentFilter] =
    useState("All");

  const [searchQuery, setSearchQuery] = useState("");
  const companyFilters = useMemo(() => ["All", ...Array.from(new Set(jobs.map((job) => job.company)))], [jobs]);
  const employmentFilters = useMemo(() => ["All", ...Array.from(new Set(jobs.map((job) => job.employmentType)))], [jobs]);

  const filteredJobs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesCompany =
        companyFilter === "All" ||
        job.company === companyFilter;

      const matchesEmployment =
        employmentFilter === "All" ||
        job.employmentType === employmentFilter;

      const matchesSearch =
        query.length === 0 ||
        job.title.toLowerCase().includes(query) ||
        job.department.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query) ||
        job.summary.toLowerCase().includes(query);

      return (
        matchesCompany &&
        matchesEmployment &&
        matchesSearch
      );
    });
  }, [
    companyFilter,
    employmentFilter,
    jobs,
    searchQuery,
  ]);

  const clearFilters = () => {
    setCompanyFilter("All");
    setEmploymentFilter("All");
    setSearchQuery("");
  };

  return (
    <section id="open-positions" className="careers-directory section">
      <div className="section-container">
        <div className="careers-directory__heading">
          <div className="section-heading">
            <p className="section-kicker">Open Positions</p>

            <h2>
              Find your place
              <br />
              <span>inside BCU Group.</span>
            </h2>
          </div>

          <p>
            Explore current opportunities across BCU Group,
            Ready Food Company and SmartCycle Technologies.
          </p>
        </div>

        <div className="careers-directory__toolbar">
          <div className="careers-directory__filters">
            {companyFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                className={`career-filter-button ${
                  companyFilter === filter
                    ? "career-filter-button--active"
                    : ""
                }`}
                onClick={() => setCompanyFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="careers-directory__controls">
            <label>
              <span>Search jobs</span>

              <input
                type="search"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Role, department or location..."
              />
            </label>

            <label>
              <span>Employment type</span>

              <select
                value={employmentFilter}
                onChange={(event) =>
                  setEmploymentFilter(
                    event.target.value
                  )
                }
              >
                {employmentFilters.map((filter) => (
                  <option key={filter} value={filter}>
                    {filter}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="careers-directory__results">
          <div>
            <strong>{filteredJobs.length}</strong>
            <span>
              {filteredJobs.length === 1
                ? "Open position"
                : "Open positions"}
            </span>
          </div>

          {(companyFilter !== "All" ||
            employmentFilter !== "All" ||
            searchQuery.length > 0) && (
            <button type="button" onClick={clearFilters}>
              Clear filters
              <span aria-hidden="true">×</span>
            </button>
          )}
        </div>

        {filteredJobs.length > 0 ? (
          <div className="careers-list">
            {filteredJobs.map((job, index) => {
              const theme = getCompanyTheme(job.company);

              return (
                <article
                  key={job.id}
                  className={`career-card career-card--${theme}`}
                >
                  <div className="career-card__number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="career-card__main">
                    <div className="career-card__company">
                      <span>{job.company}</span>
                      <span>{job.department}</span>
                    </div>

                    <h3>{job.title}</h3>

                    <p>{job.summary}</p>

                    <div className="career-card__details">
                      <span>{job.location}</span>
                      <span>{job.employmentType}</span>
                      <span>{job.workMode}</span>
                    </div>
                  </div>

                  <div className="career-card__action">
                    {job.featured && <span>Featured role</span>}

                    <Link href={`/careers/${job.slug}`}>
                      View Position
                      <span aria-hidden="true">↗</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="careers-empty-state">
            <span>No positions found</span>

            <h2>No jobs match your selected filters.</h2>

            <p>
              Clear the current filters to view all available
              opportunities.
            </p>

            <button type="button" onClick={clearFilters}>
              View all positions
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
