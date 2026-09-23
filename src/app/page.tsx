import Image from "next/image";
import Link from "next/link";

const impactNumbers = [
  {
    value: "2",
    label: "Core Companies",
  },
  {
    value: "10+",
    label: "Innovation Projects",
  },
  {
    value: "4",
    label: "Strategic Sectors",
  },
  {
    value: "1",
    label: "Unified African Vision",
  },
];

const strategicAreas = [
  {
    number: "01",
    title: "Technology",
    description:
      "Building intelligent digital systems that modernise institutions, businesses and public services.",
  },
  {
    number: "02",
    title: "Food Systems",
    description:
      "Developing reliable food, dairy, cold-chain, logistics and consumer service businesses.",
  },
  {
    number: "03",
    title: "Innovation",
    description:
      "Transforming ambitious African ideas into scalable products, companies and infrastructure.",
  },
  {
    number: "04",
    title: "Community Impact",
    description:
      "Creating sustainable economic opportunity through partnerships, technology and enterprise.",
  },
];

export default function Home() {
  return (
    <>
      <section className="hero-section">
        <div className="hero-grid-pattern" />
        <div className="hero-gold-orb hero-gold-orb--one" />
        <div className="hero-gold-orb hero-gold-orb--two" />

        <div className="hero-container">
          <div className="hero-content">
            <div className="eyebrow">
              <span className="eyebrow-line" />
              African Corporate Group
            </div>

            <h1 className="hero-title">
              Building Africa&apos;s
              <span>future.</span>
            </h1>

            <p className="hero-description">
              BCU Group builds and invests in companies that strengthen food
              systems, accelerate digital transformation and create sustainable
              opportunities for communities.
            </p>

            <div className="hero-actions">
              <Link href="/companies" className="button button--gold">
                Explore Our Companies
                <span aria-hidden="true">↗</span>
              </Link>

              <Link href="/about" className="button button--outline">
                Discover BCU
              </Link>
            </div>

            <div className="hero-trust">
              <span className="hero-trust-line" />
              <p>Technology · Food · Innovation · Impact</p>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-logo-ring hero-logo-ring--outer" />
            <div className="hero-logo-ring hero-logo-ring--inner" />

            <div className="hero-logo-shell">
              <div className="hero-logo-glow" />

              <Image
                src="/brands/bcu-logo.png"
                alt="Beneficium Communis Universitas"
                width={560}
                height={560}
                priority
                className="hero-logo"
              />
            </div>

            <div className="floating-label floating-label--top">
              <span>Corporate Vision</span>
              <strong>AFRICA 2040</strong>
            </div>

            <div className="floating-label floating-label--bottom">
              <span>Built for</span>
              <strong>GENERATIONAL IMPACT</strong>
            </div>
          </div>
        </div>

        <a href="#vision" className="scroll-indicator">
          <span>Scroll to explore</span>
          <div className="scroll-indicator-line" />
        </a>
      </section>

      <section id="vision" className="vision-section section">
        <div className="section-container vision-layout">
          <div className="section-heading">
            <p className="section-kicker">Our Purpose</p>

            <h2>
              One group.
              <br />
              Multiple industries.
              <br />
              <span>Shared prosperity.</span>
            </h2>
          </div>

          <div className="vision-content">
            <p className="vision-lead">
              Beneficium Communis Universitas exists to build institutions,
              businesses and technologies capable of improving lives at scale.
            </p>

            <p>
              Through strategic subsidiaries and long-term investments, BCU
              Group addresses critical African opportunities in technology,
              food production, infrastructure, service delivery and sustainable
              economic development.
            </p>

            <Link href="/about" className="text-link">
              Learn more about BCU
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="companies-section section">
        <div className="section-container">
          <div className="section-header-row">
            <div className="section-heading">
              <p className="section-kicker">Our Companies</p>
              <h2>
                Purpose-built companies.
                <br />
                <span>One powerful group.</span>
              </h2>
            </div>

            <Link href="/companies" className="text-link desktop-only-link">
              View all companies
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="company-grid">
            <article className="company-card company-card--rfc">
              <div className="company-card-background" />

              <div className="company-card-top">
                <div className="company-number">01</div>
                <div className="company-sector">
                  Food · Agriculture · Cold Chain
                </div>
              </div>

              <div className="company-logo-container company-logo-container--rfc">
                <Image
                  src="/brands/rfc-logo.png"
                  alt="Ready Food Company"
                  width={380}
                  height={260}
                  className="company-logo company-logo--rfc"
                />
              </div>

              <div className="company-card-content">
                <p className="company-label">Ready Food Company</p>

                <h3>Strengthening Africa&apos;s food economy.</h3>

                <p>
                  An integrated food and consumer services company operating
                  across meals, dairy, cold-chain preservation, logistics and
                  automotive care.
                </p>

                <div className="company-tags">
                  <span>Food Services</span>
                  <span>Dairy</span>
                  <span>Cold Chain</span>
                  <span>Logistics</span>
                </div>

                <Link href="/companies/rfc" className="company-link">
                  Explore RFC
                  <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </article>

            <article className="company-card company-card--smartcycle">
              <div className="company-card-background" />

              <div className="company-card-top">
                <div className="company-number">02</div>
                <div className="company-sector">
                  AI · Software · Digital Infrastructure
                </div>
              </div>

              <div className="company-logo-container company-logo-container--smartcycle">
                <Image
                  src="/brands/smartcycle-new.png"
                  alt="SmartCycle Technologies"
                  width={600}
                  height={260}
                  className="company-logo company-logo--smartcycle"
                />
              </div>

              <div className="company-card-content">
                <p className="company-label">SmartCycle Technologies</p>

                <h3>Engineering intelligent African systems.</h3>

                <p>
                  A technology company building AI platforms, institutional
                  software and smart infrastructure for governments, businesses
                  and communities.
                </p>

                <div className="company-tags">
                  <span>Artificial Intelligence</span>
                  <span>GovTech</span>
                  <span>Smart Cities</span>
                  <span>Enterprise</span>
                </div>

                <a href="https://smartcycle360.com" className="company-link">
                  Explore SmartCycle
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="strategy-section section">
        <div className="section-container">
          <div className="section-heading strategy-heading">
            <p className="section-kicker">Strategic Focus</p>

            <h2>
              Building where Africa
              <br />
              <span>needs transformation.</span>
            </h2>
          </div>

          <div className="strategy-grid">
            {strategicAreas.map((area) => (
              <article key={area.number} className="strategy-card">
                <p className="strategy-number">{area.number}</p>
                <h3>{area.title}</h3>
                <p>{area.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="impact-strip">
        <div className="section-container impact-grid">
          {impactNumbers.map((item) => (
            <div key={item.label} className="impact-item">
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section section">
        <div className="cta-glow" />

        <div className="section-container cta-content">
          <p className="section-kicker">Partner With BCU</p>

          <h2>
            Let&apos;s build the next generation
            <span>of African enterprises.</span>
          </h2>

          <p>
            We work with governments, institutions, investors, development
            partners and visionary entrepreneurs.
          </p>

          <Link href="/contact" className="button button--gold">
            Start a Conversation
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </>
  );
}