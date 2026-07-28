import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { companies, getCompanyBySlug } from "@/data/companies";

type ProjectPageProps = {
  params: Promise<{
    companySlug: string;
    projectSlug: string;
  }>;
};

export function generateStaticParams() {
  return companies.flatMap((company) =>
    company.projects.map((project) => ({
      companySlug: company.slug,
      projectSlug: project.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { companySlug, projectSlug } = await params;
  const company = getCompanyBySlug(companySlug);
  const project = company?.projects.find(
    (item) => item.slug === projectSlug
  );

  if (!company || !project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: project.name,
    description: project.summary,
  };
}

export default async function ProjectPage({
  params,
}: ProjectPageProps) {
  const { companySlug, projectSlug } = await params;
  const company = getCompanyBySlug(companySlug);

  if (!company) {
    notFound();
  }

  const project = company.projects.find(
    (item) => item.slug === projectSlug
  );

  if (!project) {
    notFound();
  }

  const relatedProjects = company.projects
    .filter((item) => item.id !== project.id)
    .slice(0, 3);

  return (
    <div
      className={`project-detail-page project-detail-page--${company.theme}`}
    >
      <section className="project-detail-hero">
        <div className="project-detail-hero__grid" />
        <div className="project-detail-hero__glow" />

        <div className="section-container project-detail-hero__container">
          <div>
            <Link
              href={`/companies/${company.slug}`}
              className="project-detail-back"
            >
              <span aria-hidden="true">←</span>
              Back to {company.shortName}
            </Link>

            <div className="project-detail-meta">
              <span>{project.category}</span>
              <span>{project.status}</span>
            </div>

            {project.shortName && (
              <p className="project-detail-short-name">
                {project.shortName}
              </p>
            )}

            <h1>{project.name}</h1>

            <p className="project-detail-summary">{project.summary}</p>

            <div className="project-detail-actions">
              <Link href="/contact" className="button project-theme-button">
                Discuss This Project
                <span aria-hidden="true">↗</span>
              </Link>

              <a href="#overview" className="button button--outline">
                Project Overview
              </a>
            </div>
          </div>

          <aside className="project-detail-panel">
            <p>Project Information</p>

            <div>
              <span>Parent Company</span>
              <strong>{company.name}</strong>
            </div>

            <div>
              <span>Category</span>
              <strong>{project.category}</strong>
            </div>

            <div>
              <span>Status</span>
              <strong>{project.status}</strong>
            </div>

            <div>
              <span>Portfolio</span>
              <strong>{company.projects.length} Projects</strong>
            </div>
          </aside>
        </div>
      </section>

      <section id="overview" className="project-overview-section section">
        <div className="section-container project-overview-grid">
          <div className="section-heading">
            <p className="project-detail-eyebrow">Project Overview</p>

            <h2>
              Designed for
              <br />
              <span>practical impact.</span>
            </h2>
          </div>

          <div className="project-overview-copy">
            <p>{project.description}</p>

            <div className="project-detail-tags">
              {project.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="project-capability-section section">
        <div className="section-container">
          <div className="section-header-row">
            <div className="section-heading">
              <p className="project-detail-eyebrow">Project Direction</p>

              <h2>
                Built to grow from
                <br />
                <span>concept to infrastructure.</span>
              </h2>
            </div>
          </div>

          <div className="project-capability-grid">
            <article>
              <span>01</span>
              <h3>Problem Definition</h3>
              <p>
                The project begins by identifying a measurable institutional,
                commercial or community challenge.
              </p>
            </article>

            <article>
              <span>02</span>
              <h3>Solution Design</h3>
              <p>
                Technology, operations and business requirements are combined
                into one scalable solution.
              </p>
            </article>

            <article>
              <span>03</span>
              <h3>Pilot Implementation</h3>
              <p>
                Initial deployment validates performance, usability and
                operational impact.
              </p>
            </article>

            <article>
              <span>04</span>
              <h3>Expansion</h3>
              <p>
                Proven solutions can be expanded across institutions,
                industries, regions and countries.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="related-projects-section section">
        <div className="section-container">
          <div className="project-related-heading">
            <div>
              <p className="project-detail-eyebrow">
                More From {company.shortName}
              </p>
              <h2>Related projects</h2>
            </div>

            <Link href={`/companies/${company.slug}`}>
              View Complete Portfolio
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="project-related-grid">
            {relatedProjects.map((relatedProject) => (
              <Link
                key={relatedProject.id}
                href={`/companies/${company.slug}/projects/${relatedProject.slug}`}
                className="project-related-card"
              >
                <span>{relatedProject.category}</span>
                <h3>{relatedProject.name}</h3>
                <p>{relatedProject.summary}</p>
                <strong aria-hidden="true">↗</strong>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}