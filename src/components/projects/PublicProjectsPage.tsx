"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ProjectsDirectory from "@/components/projects/ProjectsDirectory";
import { companies as sourceCompanies } from "@/data/companies";
import {
  ADMIN_PROJECTS_STORAGE_KEY,
  ADMIN_PROJECTS_UPDATED_EVENT,
  getAdminProjects,
} from "@/lib/admin-project-store";
import type { AdminProject } from "@/types/admin-project";

type GenericRecord = Record<string, unknown>;

function createSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getProjectSlug(project: GenericRecord) {
  const slug = project.slug;
  const id = project.id;
  const name = project.name;
  const title = project.title;

  if (typeof slug === "string" && slug.trim()) {
    return slug;
  }

  if (typeof id === "string" && id.trim()) {
    return id;
  }

  if (typeof name === "string" && name.trim()) {
    return createSlug(name);
  }

  if (typeof title === "string" && title.trim()) {
    return createSlug(title);
  }

  return "";
}

function getCompanyAdminName(company: GenericRecord) {
  const slug =
    typeof company.slug === "string"
      ? company.slug.toLowerCase()
      : "";

  const name =
    typeof company.name === "string"
      ? company.name.toLowerCase()
      : "";

  if (
    slug.includes("rfc") ||
    name.includes("ready food")
  ) {
    return "Ready Food Company";
  }

  if (
    slug.includes("smartcycle") ||
    name.includes("smartcycle")
  ) {
    return "SmartCycle Technologies";
  }

  return "BCU Group";
}

function createPublicProject(
  adminProject: AdminProject
): GenericRecord {
  return {
    id: adminProject.id,
    name: adminProject.name,
    title: adminProject.name,
    slug: adminProject.slug,
    category: adminProject.category,

    summary: adminProject.summary,
    shortDescription: adminProject.summary,
    excerpt: adminProject.summary,
    tagline: adminProject.summary,

    description: adminProject.description,
    fullDescription: adminProject.description,
    overview: adminProject.description,

    logo: adminProject.logo,
    image: adminProject.coverImage,
    coverImage: adminProject.coverImage,
    featuredImage: adminProject.coverImage,
    thumbnail: adminProject.coverImage,

    featured: adminProject.featured,

    status:
      adminProject.status === "Draft"
        ? "Development"
        : adminProject.status,

    adminStatus: adminProject.status,

    displayOrder: adminProject.displayOrder,
    order: adminProject.displayOrder,

    createdAt: adminProject.createdAt,
    updatedAt: adminProject.updatedAt,
  };
}

function buildSyncedCompanies(
  adminProjects: AdminProject[]
) {
  const originalCompanies =
    sourceCompanies as unknown as GenericRecord[];

  return originalCompanies.map((company) => {
    const companyName = getCompanyAdminName(company);

    const companyAdminProjects =
      adminProjects.filter(
        (project) => project.company === companyName
      );

    const originalProjects = Array.isArray(
      company.projects
    )
      ? (company.projects as GenericRecord[])
      : [];

    const syncedProjects = companyAdminProjects.map(
      (adminProject) => {
        const originalProject =
          originalProjects.find(
            (project) =>
              getProjectSlug(project) ===
              adminProject.slug
          );

        return {
          ...(originalProject ?? {}),
          ...createPublicProject(adminProject),
        };
      }
    );

    return {
      ...company,
      projects: syncedProjects,
    };
  });
}

export default function PublicProjectsPage() {
  const [adminProjects, setAdminProjects] = useState<
    AdminProject[]
  >([]);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadProjects = () => {
      setAdminProjects(getAdminProjects());
      setLoaded(true);
    };

    loadProjects();

    const handleProjectsUpdated = () => {
      loadProjects();
    };

    const handleStorage = (
      event: StorageEvent
    ) => {
      if (
        event.key ===
        ADMIN_PROJECTS_STORAGE_KEY
      ) {
        loadProjects();
      }
    };

    window.addEventListener(
      ADMIN_PROJECTS_UPDATED_EVENT,
      handleProjectsUpdated
    );

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () => {
      window.removeEventListener(
        ADMIN_PROJECTS_UPDATED_EVENT,
        handleProjectsUpdated
      );

      window.removeEventListener(
        "storage",
        handleStorage
      );
    };
  }, []);

  const syncedCompanies = useMemo(
    () => buildSyncedCompanies(adminProjects),
    [adminProjects]
  );

  const projectCount = adminProjects.length;

  const featuredCount = adminProjects.filter(
    (project) => project.featured
  ).length;

  const developmentCount = adminProjects.filter(
    (project) =>
      project.status === "Draft"
  ).length;

  const operatingCompanies =
    syncedCompanies.filter((company) => {
      const projects = Array.isArray(company.projects)
        ? company.projects
        : [];

      return projects.length > 0;
    }).length;

  if (!loaded) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#050505",
          color: "#d4af37",
        }}
      >
        Loading BCU Group projects...
      </main>
    );
  }

  return (
    <>
      <section className="projects-page-hero">
        <div className="projects-page-hero__grid" />
        <div className="projects-page-hero__gold-glow" />
        <div className="projects-page-hero__green-glow" />
        <div className="projects-page-hero__blue-glow" />

        <div className="section-container projects-page-hero__container">
          <div className="projects-page-hero__content">
            <p className="section-kicker">
              BCU Group Portfolio
            </p>

            <h1>
              Projects designed to
              <span>transform industries.</span>
            </h1>

            <p>
              Explore the businesses, technologies and strategic
              initiatives being developed by Ready Food Company and
              SmartCycle Technologies.
            </p>

            <div className="projects-page-hero__actions">
              <a
                href="#project-directory"
                className="button button--gold"
              >
                Explore All Projects
                <span aria-hidden="true">↓</span>
              </a>

              <Link
                href="/companies"
                className="button button--outline"
              >
                View Our Companies
              </Link>
            </div>
          </div>

          <div className="projects-page-hero__metrics">
            <div>
              <strong>{projectCount}</strong>
              <span>
                Total projects and business units
              </span>
            </div>

            <div>
              <strong>{featuredCount}</strong>
              <span>
                Featured strategic projects
              </span>
            </div>

            <div>
              <strong>{developmentCount}</strong>
              <span>
                Currently in development
              </span>
            </div>

            <div>
              <strong>{operatingCompanies}</strong>
              <span>Operating companies</span>
            </div>
          </div>
        </div>
      </section>

      <section className="projects-introduction section">
        <div className="section-container projects-introduction__grid">
          <div className="section-heading">
            <p className="section-kicker">
              Portfolio Architecture
            </p>

            <h2>
              Two companies.
              <br />
              Multiple sectors.
              <br />
              <span>One group vision.</span>
            </h2>
          </div>

          <div className="projects-introduction__copy">
            <p>
              Every BCU project belongs to a specialised subsidiary
              responsible for its commercial development, operations,
              technology and market growth.
            </p>

            <p>
              Ready Food Company develops food, dairy, cold-chain,
              logistics and consumer service businesses. SmartCycle
              Technologies develops artificial intelligence,
              institutional software and digital infrastructure.
            </p>

            <p>
              This portfolio is designed to expand as BCU creates
              additional companies, projects and investment sectors.
            </p>
          </div>
        </div>
      </section>

      <div id="project-directory">
        <ProjectsDirectory
          companies={
            syncedCompanies as never
          }
        />
      </div>

      <section className="projects-governance section">
        <div className="section-container">
          <div className="section-header-row">
            <div className="section-heading">
              <p className="section-kicker">
                Project Development
              </p>

              <h2>
                From ambitious idea
                <br />
                <span>to operating enterprise.</span>
              </h2>
            </div>
          </div>

          <div className="projects-governance__grid">
            <article>
              <span>01</span>
              <h3>Opportunity Identification</h3>
              <p>
                BCU identifies important commercial, institutional
                and community challenges with potential for scalable
                solutions.
              </p>
            </article>

            <article>
              <span>02</span>
              <h3>Research and Design</h3>
              <p>
                The business model, technology, market demand,
                operating requirements and impact potential are
                evaluated.
              </p>
            </article>

            <article>
              <span>03</span>
              <h3>Development and Pilot</h3>
              <p>
                The subsidiary develops an initial operational
                version and validates it with customers, partners or
                institutions.
              </p>
            </article>

            <article>
              <span>04</span>
              <h3>Commercial Expansion</h3>
              <p>
                Proven projects receive investment, partnerships,
                infrastructure and organisational support for
                expansion.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="projects-partnership section">
        <div className="projects-partnership__glow" />

        <div className="section-container projects-partnership__content">
          <p className="section-kicker">
            Investment and Partnerships
          </p>

          <h2>
            Build the next
            <span>African solution with us.</span>
          </h2>

          <p>
            BCU Group welcomes strategic investors, government
            institutions, development partners, universities,
            technology companies and commercial collaborators.
          </p>

          <Link
            href="/contact"
            className="button button--gold"
          >
            Discuss a Partnership
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </>
  );
}