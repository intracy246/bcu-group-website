import Link from "next/link";

const values = [
  {
    number: "01",
    title: "Innovation & Creativity",
    description:
      "We transform complex social and economic challenges into practical, scalable and technology-enabled solutions.",
  },
  {
    number: "02",
    title: "Integrity & Transparency",
    description:
      "We build trust through accountability, responsible leadership and clear engagement with partners and communities.",
  },
  {
    number: "03",
    title: "Social Impact & Sustainability",
    description:
      "Every BCU initiative is designed to create measurable value today while strengthening future generations.",
  },
  {
    number: "04",
    title: "Collaboration & Inclusion",
    description:
      "We bring together governments, institutions, businesses, investors and communities to achieve greater collective impact.",
  },
  {
    number: "05",
    title: "Excellence & Accountability",
    description:
      "We pursue high standards in strategy, execution, governance and performance across every BCU Group company.",
  },
];

const focusAreas = [
  "Technology and Artificial Intelligence",
  "Food Systems and Agriculture",
  "Digital Infrastructure",
  "Smart Cities",
  "Public Service Transformation",
  "Community Empowerment",
  "Education and Skills",
  "Sustainable Enterprise",
];

export default function AboutPage() {
  return (
    <>
      <section className="about-hero">
        <div className="about-hero__grid" />
        <div className="about-hero__glow" />

        <div className="section-container about-hero__container">
          <div className="about-hero__content">
            <p className="section-kicker">About BCU Group</p>

            <h1>
              Building institutions
              <span>that move Africa forward.</span>
            </h1>

            <p className="about-hero__lead">
              Beneficium Communis Universitas is a diversified African corporate
              group focused on building companies, technologies and
              partnerships that strengthen communities and create sustainable
              opportunity.
            </p>

            <div className="about-hero__actions">
              <Link href="/companies" className="button button--gold">
                Explore Our Companies
                <span aria-hidden="true">↗</span>
              </Link>

              <Link href="/contact" className="button button--outline">
                Partner With BCU
              </Link>
            </div>
          </div>

          <div className="about-hero__statement">
            <span>Our Belief</span>

            <blockquote>
              Africa&apos;s greatest challenges can become its greatest
              opportunities when vision, technology, capital and people work
              together.
            </blockquote>
          </div>
        </div>
      </section>

      <section className="about-introduction section">
        <div className="section-container about-introduction__grid">
          <div className="section-heading">
            <p className="section-kicker">Who We Are</p>

            <h2>
              A corporate group
              <br />
              built for
              <br />
              <span>generational impact.</span>
            </h2>
          </div>

          <div className="about-introduction__copy">
            <p className="about-introduction__lead">
              BCU Group operates as the strategic parent organisation of
              purpose-built companies working across technology, food systems,
              innovation and sustainable development.
            </p>

            <p>
              Our role is to establish, guide and scale subsidiaries capable of
              solving important African challenges through disciplined
              enterprise, intelligent systems and long-term investment.
            </p>

            <p>
              Today, our core companies are Ready Food Company and SmartCycle
              Technologies. Each company has its own market focus, operating
              model, products and growth strategy, while sharing the broader
              vision and governance of BCU Group.
            </p>
          </div>
        </div>
      </section>

      <section className="about-mission section">
        <div className="section-container">
          <div className="about-mission__grid">
            <article className="about-mission__card">
              <p>Our Vision</p>

              <h2>
                To be a leading force in transforming African societies through
                technology-driven development, inclusive innovation and
                strategic collaboration.
              </h2>
            </article>

            <article className="about-mission__card">
              <p>Our Mission</p>

              <h2>
                To identify hidden opportunities within social and economic
                challenges and transform them into sustainable, intelligent and
                scalable solutions.
              </h2>
            </article>
          </div>
        </div>
      </section>

      <section className="about-structure section">
        <div className="section-container">
          <div className="section-header-row">
            <div className="section-heading">
              <p className="section-kicker">Group Structure</p>

              <h2>
                One parent company.
                <br />
                <span>Specialised subsidiaries.</span>
              </h2>
            </div>
          </div>

          <div className="about-structure__diagram">
            <div className="about-structure__parent">
              <span>Holding Company</span>
              <strong>BCU GROUP</strong>
              <p>
                Strategy · Governance · Investment · Partnerships · Shared
                Services
              </p>
            </div>

            <div className="about-structure__connector">
              <span />
            </div>

            <div className="about-structure__companies">
              <a
                href="https://rfc-web-zeta.vercel.app/"
                className="about-structure__company about-structure__company--rfc"
              >
                <span>Food & Consumer Systems</span>
                <strong>Ready Food Company</strong>
                <p>
                  Food services, dairy, agriculture, cold chain, logistics and
                  consumer businesses.
                </p>
              </a>

              <a
                href="https://smartcycle360.com"
                className="about-structure__company about-structure__company--smartcycle"
              >
                <span>Technology & Digital Infrastructure</span>
                <strong>SmartCycle Technologies</strong>
                <p>
                  Artificial intelligence, GovTech, enterprise systems and
                  smart infrastructure.
                </p>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="about-values section">
        <div className="section-container">
          <div className="section-header-row">
            <div className="section-heading">
              <p className="section-kicker">Core Values</p>

              <h2>
                The principles behind
                <br />
                <span>every BCU decision.</span>
              </h2>
            </div>
          </div>

          <div className="about-values__grid">
            {values.map((value) => (
              <article key={value.number} className="about-value-card">
                <span>{value.number}</span>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-focus section">
        <div className="section-container about-focus__grid">
          <div className="section-heading">
            <p className="section-kicker">Strategic Focus</p>

            <h2>
              Where BCU creates
              <br />
              <span>long-term value.</span>
            </h2>
          </div>

          <div className="about-focus__list">
            {focusAreas.map((area, index) => (
              <div key={area} className="about-focus__item">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{area}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-partnership section">
        <div className="about-partnership__glow" />

        <div className="section-container about-partnership__content">
          <p className="section-kicker">Strategic Partnerships</p>

          <h2>
            We build through
            <span>collaboration.</span>
          </h2>

          <p>
            BCU Group works with governments, universities, financial
            institutions, investors, development organisations, technology
            companies and communities to develop scalable African solutions.
          </p>

          <Link href="/contact" className="button button--gold">
            Start a Partnership
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </>
  );
}