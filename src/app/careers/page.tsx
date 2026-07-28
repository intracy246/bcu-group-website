import Link from "next/link";
import CareersDirectory from "@/components/careers/CareersDirectory";
import { getOpenJobs } from "@/data/careers";

const cultureValues = [
  {
    number: "01",
    title: "Build With Purpose",
    description:
      "We work on products and businesses designed to solve real African challenges.",
  },
  {
    number: "02",
    title: "Think Beyond Today",
    description:
      "We design companies, systems and partnerships for long-term growth.",
  },
  {
    number: "03",
    title: "Take Responsibility",
    description:
      "Every team member is expected to act with discipline, integrity and accountability.",
  },
  {
    number: "04",
    title: "Learn Continuously",
    description:
      "We value curiosity, experimentation and professional growth.",
  },
];

const opportunities = [
  "Technology and software development",
  "Artificial intelligence and data",
  "Food operations and hospitality",
  "Dairy and agricultural value chains",
  "Business development and partnerships",
  "Finance and administration",
  "Marketing and communications",
  "Internships and graduate opportunities",
];

export default function CareersPage() {
  const openJobs = getOpenJobs();

  return (
    <>
      <section className="careers-hero">
        <div className="careers-hero__grid" />
        <div className="careers-hero__gold-glow" />
        <div className="careers-hero__green-glow" />
        <div className="careers-hero__blue-glow" />

        <div className="section-container careers-hero__container">
          <div className="careers-hero__content">
            <p className="section-kicker">Careers at BCU</p>

            <h1>
              Build companies that
              <span>shape Africa&apos;s future.</span>
            </h1>

            <p>
              Join a growing corporate ecosystem working across
              technology, artificial intelligence, food systems,
              infrastructure and sustainable enterprise.
            </p>

            <div className="careers-hero__actions">
              <a
                href="#open-positions"
                className="button button--gold"
              >
                View Open Positions
                <span aria-hidden="true">↓</span>
              </a>

              <Link
                href="/about"
                className="button button--outline"
              >
                Discover BCU Group
              </Link>
            </div>
          </div>

          <div className="careers-hero__panel">
            <p>Current Opportunities</p>

            <strong>{openJobs.length}</strong>

            <span>
              Open positions across the BCU Group portfolio
            </span>

            <div>
              <small>BCU Group</small>
              <small>Ready Food Company</small>
              <small>SmartCycle Technologies</small>
            </div>
          </div>
        </div>
      </section>

      <section className="careers-introduction section">
        <div className="section-container careers-introduction__grid">
          <div className="section-heading">
            <p className="section-kicker">Why Join Us</p>

            <h2>
              More than a job.
              <br />
              A chance to
              <br />
              <span>build something important.</span>
            </h2>
          </div>

          <div className="careers-introduction__copy">
            <p>
              BCU Group is building companies from the ground up.
              That creates a unique environment for ambitious people
              who want direct responsibility, practical experience
              and measurable impact.
            </p>

            <p>
              Team members may work across products, industries and
              strategic projects while developing capabilities that
              extend beyond a single conventional role.
            </p>

            <p>
              We value people who can learn quickly, communicate
              clearly, take ownership and convert ideas into
              execution.
            </p>
          </div>
        </div>
      </section>

      <section className="careers-culture section">
        <div className="section-container">
          <div className="section-header-row">
            <div className="section-heading">
              <p className="section-kicker">Our Culture</p>

              <h2>
                Ambition supported
                <br />
                <span>by discipline.</span>
              </h2>
            </div>
          </div>

          <div className="careers-culture__grid">
            {cultureValues.map((value) => (
              <article key={value.number}>
                <span>{value.number}</span>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CareersDirectory jobs={openJobs} />

      <section className="careers-opportunities section">
        <div className="section-container careers-opportunities__grid">
          <div className="section-heading">
            <p className="section-kicker">
              Future Opportunities
            </p>

            <h2>
              Skills we expect
              <br />
              to need as
              <br />
              <span>the group expands.</span>
            </h2>
          </div>

          <div className="careers-opportunities__list">
            {opportunities.map((opportunity, index) => (
              <div key={opportunity}>
                <span>
                  {String(index + 1).padStart(2, "0")}
                </span>

                <strong>{opportunity}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="careers-general-application section">
        <div className="careers-general-application__glow" />

        <div className="section-container careers-general-application__content">
          <p className="section-kicker">
            General Application
          </p>

          <h2>
            Your role is not listed?
            <span>Introduce yourself.</span>
          </h2>

          <p>
            Professionals, graduates and students with relevant
            skills may submit a general expression of interest for
            consideration when suitable opportunities become
            available.
          </p>

          <Link href="/contact" className="button button--gold">
            Submit Your Interest
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </>
  );
}