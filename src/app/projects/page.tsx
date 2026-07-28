import Link from "next/link";
import ProjectsDirectory from "@/components/projects/ProjectsDirectory";
import { companies } from "@/data/companies";

const projectCount = companies.reduce(
  (total, company) => total + company.projects.length,
  0
);

const featuredCount = companies.reduce(
  (total, company) =>
    total +
    company.projects.filter((project) => project.featured).length,
  0
);

const developmentCount = companies.reduce(
  (total, company) =>
    total +
    company.projects.filter(
      (project) => project.status === "Development"
    ).length,
  0
);

export default function ProjectsPage() {
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
              <span>Total projects and business units</span>
            </div>

            <div>
              <strong>{featuredCount}</strong>
              <span>Featured strategic projects</span>
            </div>

            <div>
              <strong>{developmentCount}</strong>
              <span>Currently in development</span>
            </div>

            <div>
              <strong>{companies.length}</strong>
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
        <ProjectsDirectory companies={companies} />
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

          <Link href="/contact" className="button button--gold">
            Discuss a Partnership
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </>
  );
}