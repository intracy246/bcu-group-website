import Link from "next/link";
import { companies } from "@/data/companies";

const totalProjects = companies.reduce(
  (total, company) => total + company.projects.length,
  0
);

const activeProjects = companies.reduce(
  (total, company) =>
    total +
    company.projects.filter(
      (project) =>
        project.status === "Active" ||
        project.status === "Development"
    ).length,
  0
);

const totalSectors = new Set(
  companies.flatMap((company) => company.sectors)
).size;

const impactAreas = [
  {
    number: "01",
    title: "Economic Opportunity",
    description:
      "Creating businesses, jobs, supplier networks, distribution systems and new commercial opportunities across African markets.",
  },
  {
    number: "02",
    title: "Food Security",
    description:
      "Improving food access, preservation, processing, logistics and market connectivity through Ready Food Company.",
  },
  {
    number: "03",
    title: "Digital Transformation",
    description:
      "Building intelligent systems that modernise institutions, public services, campuses, enterprises and communities.",
  },
  {
    number: "04",
    title: "Institutional Efficiency",
    description:
      "Reducing delays, leakage, manual processes and operational friction through data-driven platforms and automation.",
  },
  {
    number: "05",
    title: "Community Empowerment",
    description:
      "Developing practical solutions that improve access, strengthen local businesses and expand participation in the digital economy.",
  },
  {
    number: "06",
    title: "Sustainable Infrastructure",
    description:
      "Designing long-term systems in food, technology, mobility, security and service delivery that can scale responsibly.",
  },
];

const impactModel = [
  {
    number: "01",
    title: "Identify",
    description:
      "We identify important social, commercial and institutional challenges with potential for measurable impact.",
  },
  {
    number: "02",
    title: "Design",
    description:
      "We combine business strategy, technology, operations and partnerships into a practical solution model.",
  },
  {
    number: "03",
    title: "Pilot",
    description:
      "We test solutions in real operating environments before committing to wider expansion.",
  },
  {
    number: "04",
    title: "Measure",
    description:
      "We monitor performance using defined indicators, operational data and stakeholder feedback.",
  },
  {
    number: "05",
    title: "Scale",
    description:
      "Proven solutions are prepared for expansion across institutions, regions, industries and countries.",
  },
];

const measurementAreas = [
  "Jobs and enterprise opportunities created",
  "Institutions and communities served",
  "Time and operational costs reduced",
  "Food preserved and post-harvest loss reduced",
  "Digital transactions and services enabled",
  "Farmers, suppliers and businesses connected",
  "Service delivery performance improved",
  "Revenue leakage and inefficiency identified",
];

export default function ImpactPage() {
  return (
    <>
      <section className="impact-page-hero">
        <div className="impact-page-hero__grid" />
        <div className="impact-page-hero__gold-glow" />
        <div className="impact-page-hero__green-glow" />
        <div className="impact-page-hero__blue-glow" />

        <div className="section-container impact-page-hero__container">
          <div className="impact-page-hero__content">
            <p className="section-kicker">BCU Group Impact</p>

            <h1>
              Progress that creates
              <span>shared value.</span>
            </h1>

            <p>
              BCU Group builds companies and projects designed to create
              economic, technological and community value across Africa.
            </p>

            <div className="impact-page-hero__actions">
              <a href="#impact-areas" className="button button--gold">
                Explore Our Impact
                <span aria-hidden="true">↓</span>
              </a>

              <Link href="/projects" className="button button--outline">
                View Our Projects
              </Link>
            </div>
          </div>

          <div className="impact-page-hero__panel">
            <p>Current Group Portfolio</p>

            <div className="impact-page-hero__metrics">
              <div>
                <strong>{companies.length}</strong>
                <span>Core companies</span>
              </div>

              <div>
                <strong>{totalProjects}</strong>
                <span>Projects and business units</span>
              </div>

              <div>
                <strong>{activeProjects}</strong>
                <span>Active or in development</span>
              </div>

              <div>
                <strong>{totalSectors}</strong>
                <span>Strategic sectors</span>
              </div>
            </div>

            <small>
              Portfolio statistics are generated from the current BCU project
              data.
            </small>
          </div>
        </div>
      </section>

      <section className="impact-purpose section">
        <div className="section-container impact-purpose__grid">
          <div className="section-heading">
            <p className="section-kicker">Our Impact Purpose</p>

            <h2>
              Business growth
              <br />
              must create
              <br />
              <span>community progress.</span>
            </h2>
          </div>

          <div className="impact-purpose__copy">
            <p>
              BCU Group believes that the strongest enterprises do more than
              generate revenue. They improve systems, expand opportunity,
              strengthen institutions and solve real problems.
            </p>

            <p>
              Our impact strategy is embedded within the commercial and
              operational design of each subsidiary. Ready Food Company focuses
              on food access, agriculture, preservation and value chains.
              SmartCycle Technologies focuses on digital transformation,
              institutional intelligence and public service improvement.
            </p>

            <p>
              As the portfolio grows, every BCU company will be expected to
              define measurable outcomes alongside financial and operational
              performance.
            </p>
          </div>
        </div>
      </section>

      <section id="impact-areas" className="impact-areas section">
        <div className="section-container">
          <div className="section-header-row">
            <div className="section-heading">
              <p className="section-kicker">Impact Areas</p>

              <h2>
                Where our companies
                <br />
                <span>create long-term value.</span>
              </h2>
            </div>
          </div>

          <div className="impact-areas__grid">
            {impactAreas.map((area) => (
              <article key={area.number} className="impact-area-card">
                <span>{area.number}</span>
                <h3>{area.title}</h3>
                <p>{area.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="impact-companies section">
        <div className="section-container">
          <div className="section-header-row">
            <div className="section-heading">
              <p className="section-kicker">Impact by Company</p>

              <h2>
                Specialised companies.
                <br />
                <span>Connected outcomes.</span>
              </h2>
            </div>
          </div>

          <div className="impact-companies__grid">
            <article className="impact-company-card impact-company-card--rfc">
              <div className="impact-company-card__header">
                <span>Ready Food Company</span>
                <strong>RFC</strong>
              </div>

              <h3>Strengthening food systems and local value chains.</h3>

              <p>
                RFC projects are designed to improve food access, food
                preservation, processing, market logistics, farmer connectivity
                and consumer services.
              </p>

              <div className="impact-company-card__list">
                <span>Affordable food access</span>
                <span>Dairy market development</span>
                <span>Post-harvest loss reduction</span>
                <span>Cold-chain infrastructure</span>
                <span>Farmer and supplier opportunity</span>
                <span>Employment and enterprise creation</span>
              </div>

              <Link href="/companies/rfc">
                Explore RFC Impact
                <span aria-hidden="true">↗</span>
              </Link>
            </article>

            <article className="impact-company-card impact-company-card--smartcycle">
              <div className="impact-company-card__header">
                <span>SmartCycle Technologies</span>
                <strong>SMARTCYCLE</strong>
              </div>

              <h3>Modernising institutions through intelligent systems.</h3>

              <p>
                SmartCycle projects are designed to improve service delivery,
                institutional performance, security, digital access and
                operational intelligence.
              </p>

              <div className="impact-company-card__list">
                <span>Reduced service waiting time</span>
                <span>Digital public service access</span>
                <span>Institutional efficiency</span>
                <span>Data-driven decision making</span>
                <span>Security and access management</span>
                <span>Education and enterprise digitisation</span>
              </div>

              <a href="https://smartcycle360.com">
                Explore SmartCycle Impact
                <span aria-hidden="true">↗</span>
              </a>
            </article>
          </div>
        </div>
      </section>

      <section className="impact-model section">
        <div className="section-container">
          <div className="section-header-row">
            <div className="section-heading">
              <p className="section-kicker">Our Impact Model</p>

              <h2>
                From challenge
                <br />
                <span>to measurable outcome.</span>
              </h2>
            </div>
          </div>

          <div className="impact-model__grid">
            {impactModel.map((item) => (
              <article key={item.number}>
                <span>{item.number}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="impact-measurement section">
        <div className="section-container impact-measurement__grid">
          <div className="section-heading">
            <p className="section-kicker">Measurement Framework</p>

            <h2>
              Impact must be
              <br />
              <span>visible and verifiable.</span>
            </h2>
          </div>

          <div className="impact-measurement__content">
            <p>
              As BCU projects move into full implementation, the group will
              measure impact using operational, financial, social and
              environmental indicators relevant to each project.
            </p>

            <div className="impact-measurement__list">
              {measurementAreas.map((area, index) => (
                <div key={area}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{area}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="impact-sustainability section">
        <div className="section-container">
          <div className="impact-sustainability__content">
            <p className="section-kicker">Sustainable Growth</p>

            <h2>
              Built for today.
              <span>Designed for generations.</span>
            </h2>

            <p>
              BCU Group seeks to build companies that remain financially
              sustainable, operationally disciplined and socially valuable over
              the long term.
            </p>

            <div className="impact-sustainability__pillars">
              <article>
                <span>01</span>
                <h3>Economic Sustainability</h3>
                <p>
                  Strong revenue models, responsible investment and scalable
                  operations.
                </p>
              </article>

              <article>
                <span>02</span>
                <h3>Social Sustainability</h3>
                <p>
                  Products and services that expand access, opportunity and
                  participation.
                </p>
              </article>

              <article>
                <span>03</span>
                <h3>Environmental Responsibility</h3>
                <p>
                  Efficient infrastructure, reduced losses and responsible use
                  of resources.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="impact-partnership section">
        <div className="impact-partnership__glow" />

        <div className="section-container impact-partnership__content">
          <p className="section-kicker">Create Impact With BCU</p>

          <h2>
            Real transformation
            <span>requires partnership.</span>
          </h2>

          <p>
            We welcome governments, institutions, investors, development
            organisations, universities, businesses and communities seeking to
            build scalable African solutions.
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