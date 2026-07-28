import Image from "next/image";
import Link from "next/link";
import { companies } from "@/data/companies";

export default function CompaniesPage() {
  return (
    <>
      <section className="companies-page-hero">
        <div className="companies-page-hero__grid" />
        <div className="companies-page-hero__glow" />

        <div className="section-container companies-page-hero__content">
          <p className="section-kicker">Our Companies</p>

          <h1>
            Independent companies.
            <span>One shared vision.</span>
          </h1>

          <p>
            BCU Group establishes and develops specialised companies capable of
            solving major African challenges through disciplined execution,
            technology, investment and long-term thinking.
          </p>
        </div>
      </section>

      <section className="companies-directory section">
        <div className="section-container">
          <div className="companies-directory__intro">
            <div className="section-heading">
              <p className="section-kicker">BCU Portfolio</p>

              <h2>
                Built to lead
                <br />
                <span>different industries.</span>
              </h2>
            </div>

            <p>
              Each BCU subsidiary operates with its own market focus, brand,
              products and strategy while benefiting from group governance,
              shared capabilities and long-term investment.
            </p>
          </div>

          <div className="companies-directory__grid">
            {companies.map((company, index) => (
              <article
                key={company.id}
                className={`company-directory-card company-directory-card--${company.theme}`}
              >
                <div className="company-directory-card__glow" />

                <div className="company-directory-card__header">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>A BCU Group Company</p>
                </div>

                <div className="company-directory-card__logo">
                  <Image
                    src={company.logo}
                    alt={company.name}
                    width={700}
                    height={420}
                    className="company-directory-card__image"
                  />
                </div>

                <div className="company-directory-card__content">
                  <p className="company-directory-card__legal">
                    {company.legalName}
                  </p>

                  <h2>{company.tagline}</h2>

                  <p>{company.description}</p>

                  <div className="company-directory-card__sectors">
                    {company.sectors.map((sector) => (
                      <span key={sector}>{sector}</span>
                    ))}
                  </div>

                  <div className="company-directory-card__footer">
                    <div>
                      <strong>{company.projects.length}</strong>
                      <span>Projects and business units</span>
                    </div>

                    <Link href={`/companies/${company.slug}`}>
                      Explore Company
                      <span aria-hidden="true">↗</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="companies-model section">
        <div className="section-container companies-model__grid">
          <div className="section-heading">
            <p className="section-kicker">How We Operate</p>

            <h2>
              Group strength.
              <br />
              <span>Company independence.</span>
            </h2>
          </div>

          <div className="companies-model__list">
            <article>
              <span>01</span>
              <div>
                <h3>Strategic Direction</h3>
                <p>
                  BCU Group provides long-term vision, corporate strategy and
                  investment direction.
                </p>
              </div>
            </article>

            <article>
              <span>02</span>
              <div>
                <h3>Independent Operations</h3>
                <p>
                  Each subsidiary develops its own products, teams, customers
                  and operating model.
                </p>
              </div>
            </article>

            <article>
              <span>03</span>
              <div>
                <h3>Shared Capabilities</h3>
                <p>
                  Companies can benefit from shared technology, governance,
                  finance, legal support and partnerships.
                </p>
              </div>
            </article>

            <article>
              <span>04</span>
              <div>
                <h3>Scalable Growth</h3>
                <p>
                  The structure allows BCU to add new subsidiaries and projects
                  without rebuilding the corporate ecosystem.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="companies-expansion section">
        <div className="companies-expansion__glow" />

        <div className="section-container companies-expansion__content">
          <p className="section-kicker">Future Growth</p>

          <h2>
            Designed to expand
            <span>beyond two companies.</span>
          </h2>

          <p>
            The BCU corporate structure is prepared to support future
            subsidiaries across finance, energy, health, mobility, real estate
            and other strategic sectors.
          </p>

          <Link href="/contact" className="button button--gold">
            Partner With BCU
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </>
  );
}