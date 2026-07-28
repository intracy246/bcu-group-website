import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getJobBySlug,
  getOpenJobs,
} from "@/data/careers";

type JobPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function generateStaticParams() {
  return getOpenJobs().map((job) => ({
    slug: job.slug,
  }));
}

export async function generateMetadata({
  params,
}: JobPageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = getJobBySlug(slug);

  if (!job) {
    return {
      title: "Position Not Found",
    };
  }

  return {
    title: job.title,
    description: job.summary,
  };
}

export default async function JobPage({
  params,
}: JobPageProps) {
  const { slug } = await params;
  const job = getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  return (
    <>
      <section className="job-detail-hero">
        <div className="job-detail-hero__grid" />
        <div className="job-detail-hero__glow" />

        <div className="section-container job-detail-hero__container">
          <div>
            <Link
              href="/careers"
              className="job-detail-back"
            >
              <span aria-hidden="true">←</span>
              Back to Careers
            </Link>

            <div className="job-detail-meta">
              <span>{job.company}</span>
              <span>{job.department}</span>
              <span>{job.employmentType}</span>
            </div>

            <h1>{job.title}</h1>

            <p>{job.summary}</p>

            <div className="job-detail-actions">
              <a
                href="#apply"
                className="button button--gold"
              >
                Apply for This Position
                <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>

          <aside className="job-detail-panel">
            <p>Position Details</p>

            <div>
              <span>Company</span>
              <strong>{job.company}</strong>
            </div>

            <div>
              <span>Location</span>
              <strong>{job.location}</strong>
            </div>

            <div>
              <span>Work mode</span>
              <strong>{job.workMode}</strong>
            </div>

            <div>
              <span>Employment</span>
              <strong>{job.employmentType}</strong>
            </div>

            <div>
              <span>Deadline</span>
              <strong>
                {formatDate(job.applicationDeadline)}
              </strong>
            </div>
          </aside>
        </div>
      </section>

      <section className="job-detail-content section">
        <div className="section-container job-detail-content__layout">
          <aside className="job-detail-navigation">
            <a href="#overview">Role Overview</a>
            <a href="#responsibilities">Responsibilities</a>
            <a href="#requirements">Requirements</a>
            <a href="#benefits">Benefits</a>
            <a href="#apply">Application</a>
          </aside>

          <div className="job-detail-sections">
            <section id="overview">
              <p className="section-kicker">Role Overview</p>

              {job.description.map((paragraph, index) => (
                <p key={`description-${index}`}>
                  {paragraph}
                </p>
              ))}
            </section>

            <section id="responsibilities">
              <p className="section-kicker">
                Key Responsibilities
              </p>

              <ul>
                {job.responsibilities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section id="requirements">
              <p className="section-kicker">
                Required Qualifications
              </p>

              <ul>
                {job.requirements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <h3>Preferred Qualifications</h3>

              <ul>
                {job.preferredQualifications.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section id="benefits">
              <p className="section-kicker">
                What You Will Gain
              </p>

              <ul>
                {job.benefits.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section
              id="apply"
              className="job-application-section"
            >
              <p className="section-kicker">
                Application
              </p>

              <h2>Apply for {job.title}</h2>

              <p>
                The online application form will be connected to
                the BCU recruitment database during the backend
                phase.
              </p>

              <Link
                href={`/contact?subject=${encodeURIComponent(
                  `Application: ${job.title}`
                )}`}
                className="button button--gold"
              >
                Submit Application Interest
                <span aria-hidden="true">↗</span>
              </Link>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}