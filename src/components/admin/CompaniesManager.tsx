"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { CompanyProfile } from "@/data/companies";

type CompaniesManagerProps = {
  companies: CompanyProfile[];
};

type CompanyStatus = "All" | "Active" | "Draft" | "Archived";

function getIndustry(company: CompanyProfile) {
  if (company.theme === "rfc") {
    return "Food, Agriculture & Cold Chain";
  }

  if (company.theme === "smartcycle") {
    return "Technology, AI & Digital Infrastructure";
  }

  return company.sectors?.[0] ?? "Diversified";
}

function getCompanyStatus(company: CompanyProfile) {
  return company.projects.length > 0 ? "Active" : "Draft";
}

export default function CompaniesManager({
  companies,
}: CompaniesManagerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<CompanyStatus>("All");

  const filteredCompanies = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return companies.filter((company) => {
      const status = getCompanyStatus(company);

      const matchesStatus =
        statusFilter === "All" || status === statusFilter;

      const matchesSearch =
        query.length === 0 ||
        company.name.toLowerCase().includes(query) ||
        company.shortName.toLowerCase().includes(query) ||
        company.tagline.toLowerCase().includes(query) ||
        getIndustry(company).toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [companies, searchQuery, statusFilter]);

  return (
    <div className="admin-companies-page">
      <section className="admin-page-intro">
        <div>
          <p>Company Management</p>

          <h2>
            Manage BCU Group
            <span>companies.</span>
          </h2>

          <p>
            Add, edit, publish and manage subsidiaries,
            company profiles, branding and portfolio
            information.
          </p>
        </div>

        <Link
          href="/admin/companies/new"
          className="admin-primary-button"
        >
          Add Company
          <span>＋</span>
        </Link>
      </section>

      <section className="admin-company-summary">
        <article>
          <span>Total Companies</span>
          <strong>{companies.length}</strong>
          <p>Registered group companies</p>
        </article>

        <article>
          <span>Active Companies</span>
          <strong>
            {
              companies.filter(
                (company) =>
                  getCompanyStatus(company) === "Active"
              ).length
            }
          </strong>
          <p>Visible on the public website</p>
        </article>

        <article>
          <span>Total Projects</span>
          <strong>
            {companies.reduce(
              (total, company) =>
                total + company.projects.length,
              0
            )}
          </strong>
          <p>Projects and business units</p>
        </article>

        <article>
          <span>Strategic Sectors</span>
          <strong>
            {
              new Set(
                companies.flatMap(
                  (company) => company.sectors
                )
              ).size
            }
          </strong>
          <p>Industries across the group</p>
        </article>
      </section>

      <section className="admin-data-panel">
        <div className="admin-data-panel__toolbar">
          <div>
            <p>Company Directory</p>
            <h3>All companies</h3>
          </div>

          <div className="admin-company-controls">
            <label className="admin-search-field">
              <span>Search companies</span>

              <input
                type="search"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Search by name or industry..."
              />
            </label>

            <label className="admin-select-field">
              <span>Status</span>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as CompanyStatus
                  )
                }
              >
                <option>All</option>
                <option>Active</option>
                <option>Draft</option>
                <option>Archived</option>
              </select>
            </label>
          </div>
        </div>

        <div className="admin-table-result">
          <strong>{filteredCompanies.length}</strong>
          <span>
            {filteredCompanies.length === 1
              ? "Company"
              : "Companies"}
          </span>
        </div>

        {filteredCompanies.length > 0 ? (
          <div className="admin-company-table">
            <div className="admin-company-table__header">
              <span>Company</span>
              <span>Industry</span>
              <span>Status</span>
              <span>Projects</span>
              <span>Theme</span>
              <span>Actions</span>
            </div>

            {filteredCompanies.map((company) => {
              const status = getCompanyStatus(company);

              return (
                <article
                  key={company.id}
                  className={`admin-company-row admin-company-row--${company.theme}`}
                >
                  <div className="admin-company-row__identity">
                    <div className="admin-company-row__logo">
                      <Image
                        src={company.logo}
                        alt={`${company.name} logo`}
                        fill
                        sizes="64px"
                      />
                    </div>

                    <div>
                      <strong>{company.name}</strong>
                      <span>{company.shortName}</span>
                      <small>{company.tagline}</small>
                    </div>
                  </div>

                  <div className="admin-company-row__industry">
                    <strong>{getIndustry(company)}</strong>
                    <span>{company.sectors.length} sectors</span>
                  </div>

                  <div>
                    <span
                      className={`admin-status-badge admin-status-badge--${status.toLowerCase()}`}
                    >
                      <i />
                      {status}
                    </span>
                  </div>

                  <div className="admin-company-row__projects">
                    <strong>{company.projects.length}</strong>
                    <span>Projects</span>
                  </div>

                  <div>
                    <span className="admin-theme-badge">
                      {company.theme}
                    </span>
                  </div>

                  <div className="admin-company-row__actions">
                    <Link
                      href={`/companies/${company.slug}`}
                      target="_blank"
                      aria-label={`View ${company.name}`}
                    >
                      View
                    </Link>

                    <Link
                      href={`/admin/companies/${company.slug}/edit`}
                    >
                      Edit
                    </Link>

                    <button type="button">
                      More
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="admin-empty-state">
            <span>No Companies Found</span>

            <h3>No companies match the selected filters.</h3>

            <p>
              Change the search keyword or selected status.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("All");
              }}
            >
              Clear Filters
            </button>
          </div>
        )}

        <div className="admin-table-footer">
          <p>
            Showing {filteredCompanies.length} of{" "}
            {companies.length} companies
          </p>

          <div>
            <button type="button" disabled>
              Previous
            </button>

            <button
              type="button"
              className="admin-pagination-active"
            >
              1
            </button>

            <button type="button" disabled>
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}