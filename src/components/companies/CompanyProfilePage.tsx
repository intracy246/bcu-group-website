import Image from "next/image";
import Link from "next/link";
import type { CompanyProfile } from "@/data/companies";
import ProjectCard from "./ProjectCard";

type CompanyProfilePageProps = {
  company: CompanyProfile;
};

export default function CompanyProfilePage({
  company,
}: CompanyProfilePageProps) {
  const featuredProjects = company.projects.filter(
    (project) => project.featured
  );

  return (
    <div className={`company-profile company-profile--${company.theme}`}>
      <section className="company-profile-hero">
        <div className="company-profile-hero__grid" />
        <div className="company-profile-hero__glow" />

        <div className="section-container company-profile-hero__container">
          <div className="company-profile-hero__content">
            <Link href="/companies" className="company-profile-back">
              <span aria-hidden="true">←</span>
              BCU Group Companies
            </Link>

            <p className="company-profile-eyebrow">
              A BCU Group Company
            </p>

            <h1>{company.name}</h1>

            <p className="company-profile-tagline">{company.tagline}</p>

            <p className="company-profile-description">
              {company.description}
            </p>

            <div className="company-profile-actions">
              <a href="#projects" className="button company-theme-button">
                Explore Projects
                <span aria-hidden="true">↓</span>
              </a>

              <Link href="/contact" className="button button--outline">
                Partner With Us
              </Link>
            </div>
          </div>

          <div className="company-profile-hero__visual">
            <div className="company-profile-logo-shell">
              <Image
                src={company.logo}
                alt={company.name}
                width={700}
                height={500}
                priority
                className="company-profile-logo"
              />
            </div>

            <div className="company-profile-project-count">
              <strong>{company.projects.length}</strong>
              <span>Projects and business units</span>
            </div>
          </div>
        </div>
      </section>

      <section className="company-overview-section section">
        <div className="section-container">
          <div className="company-overview-grid">
            <div className="company-overview-heading">
              <p className="company-profile-eyebrow">Company Overview</p>
              <h2>
                One company.
                <br />
                Multiple solutions.
              </h2>
            </div>

            <div className="company-overview-copy">
              <div>
                <span>Mission</span>
                <p>{company.mission}</p>
              </div>

              <div>
                <span>Vision</span>
                <p>{company.vision}</p>
              </div>
            </div>
          </div>

          <div className="company-sector-list">
            {company.sectors.map((sector) => (
              <span key={sector}>{sector}</span>
            ))}
          </div>
        </div>
      </section>

      <section
        id="projects"
        className="company-projects-section section"
      >
        <div className="section-container">
          <div className="section-header-row">
            <div className="section-heading">
              <p className="company-profile-eyebrow">Featured Projects</p>
              <h2>
                Building practical
                <br />
                <span>solutions at scale.</span>
              </h2>
            </div>
          </div>

          <div className="project-grid project-grid--featured">
            {featuredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                companySlug={company.slug}
                theme={company.theme}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="company-all-projects-section section">
        <div className="section-container">
          <div className="company-projects-title">
            <div>
              <p className="company-profile-eyebrow">
                Complete Portfolio
              </p>
              <h2>All projects and business units</h2>
            </div>

            <span>{company.projects.length} total</span>
          </div>

          <div className="project-grid">
            {company.projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                companySlug={company.slug}
                theme={company.theme}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}