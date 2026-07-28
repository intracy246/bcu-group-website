import Link from "next/link";
import { companies } from "@/data/companies";
import { getPublishedNews } from "@/data/news";
import { getOpenJobs } from "@/data/careers";

const projectCount = companies.reduce(
  (total, company) => total + company.projects.length,
  0
);

const publishedNewsCount = getPublishedNews().length;
const openJobsCount = getOpenJobs().length;

const recentActivity = [
  {
    title: "SmartCycle logo updated",
    category: "Media",
    time: "Just now",
  },
  {
    title: "BCU Group website deployed",
    category: "Deployment",
    time: "Today",
  },
  {
    title: "Contact page created",
    category: "Website",
    time: "Today",
  },
  {
    title: "Careers module added",
    category: "Content",
    time: "Today",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="admin-dashboard">
      <section className="admin-dashboard__welcome">
        <div>
          <p>Monday, 28 July 2026</p>

          <h2>
            Welcome back,
            <span>Winslet.</span>
          </h2>

          <p>
            Manage BCU Group companies, projects, news,
            careers and website operations from one
            control centre.
          </p>
        </div>

        <Link
          href="/admin/news/new"
          className="admin-primary-button"
        >
          Add New Content
          <span>＋</span>
        </Link>
      </section>

      <section className="admin-stat-grid">
        <article className="admin-stat-card">
          <div>
            <span>Companies</span>
            <strong>{companies.length}</strong>
          </div>

          <p>Active BCU subsidiaries</p>

          <Link href="/admin/companies">
            Manage companies →
          </Link>
        </article>

        <article className="admin-stat-card admin-stat-card--projects">
          <div>
            <span>Projects</span>
            <strong>{projectCount}</strong>
          </div>

          <p>Projects and business units</p>

          <Link href="/admin/projects">
            Manage projects →
          </Link>
        </article>

        <article className="admin-stat-card admin-stat-card--news">
          <div>
            <span>Published News</span>
            <strong>{publishedNewsCount}</strong>
          </div>

          <p>Articles visible publicly</p>

          <Link href="/admin/news">
            Manage news →
          </Link>
        </article>

        <article className="admin-stat-card admin-stat-card--careers">
          <div>
            <span>Open Positions</span>
            <strong>{openJobsCount}</strong>
          </div>

          <p>Current career opportunities</p>

          <Link href="/admin/careers">
            Manage careers →
          </Link>
        </article>
      </section>

      <section className="admin-dashboard__grid">
        <article className="admin-panel admin-panel--activity">
          <div className="admin-panel__header">
            <div>
              <p>System Activity</p>
              <h3>Recent changes</h3>
            </div>

            <button type="button">View all</button>
          </div>

          <div className="admin-activity-list">
            {recentActivity.map((activity) => (
              <div key={activity.title}>
                <span />

                <div>
                  <strong>{activity.title}</strong>
                  <p>{activity.category}</p>
                </div>

                <small>{activity.time}</small>
              </div>
            ))}
          </div>
        </article>

        <article className="admin-panel admin-panel--quick">
          <div className="admin-panel__header">
            <div>
              <p>Quick Actions</p>
              <h3>Common tasks</h3>
            </div>
          </div>

          <div className="admin-quick-actions">
            <Link href="/admin/news/new">
              <span>＋</span>
              <div>
                <strong>Create news article</strong>
                <p>Publish a new group update</p>
              </div>
            </Link>

            <Link href="/admin/projects/new">
              <span>＋</span>
              <div>
                <strong>Add new project</strong>
                <p>Create a project or business unit</p>
              </div>
            </Link>

            <Link href="/admin/careers/new">
              <span></span>
              <div>
                <strong>Post a vacancy</strong>
                <p>Add a new career opportunity</p>
              </div>
            </Link>

            <Link href="/admin/media">
              <span>↑</span>
              <div>
                <strong>Upload media</strong>
                <p>Add images and documents</p>
              </div>
            </Link>
          </div>
        </article>
      </section>

      <section className="admin-dashboard__grid admin-dashboard__grid--bottom">
        <article className="admin-panel">
          <div className="admin-panel__header">
            <div>
              <p>Group Portfolio</p>
              <h3>Company performance overview</h3>
            </div>

            <Link href="/admin/companies">
              View companies
            </Link>
          </div>

          <div className="admin-company-overview">
            {companies.map((company) => (
              <div
                key={company.id}
                className={`admin-company-overview__item admin-company-overview__item--${company.theme}`}
              >
                <div>
                  <span>{company.shortName}</span>
                  <strong>{company.name}</strong>
                </div>

                <div>
                  <strong>{company.projects.length}</strong>
                  <span>Projects</span>
                </div>

                <Link href={`/admin/companies/${company.slug}`}>
                  Manage →
                </Link>
              </div>
            ))}
          </div>
        </article>

        <article className="admin-panel admin-panel--system">
          <div className="admin-panel__header">
            <div>
              <p>System Overview</p>
              <h3>Platform status</h3>
            </div>
          </div>

          <div className="admin-system-status">
            <div>
              <span>
                <i />
                Public Website
              </span>
              <strong>Operational</strong>
            </div>

            <div>
              <span>
                <i />
                GitHub Repository
              </span>
              <strong>Connected</strong>
            </div>

            <div>
              <span>
                <i />
                Vercel Deployment
              </span>
              <strong>Live</strong>
            </div>

            <div>
              <span>
                <i className="admin-system-status__pending" />
                Database
              </span>
              <strong>Not connected</strong>
            </div>

            <div>
              <span>
                <i className="admin-system-status__pending" />
                Authentication
              </span>
              <strong>Pending setup</strong>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}