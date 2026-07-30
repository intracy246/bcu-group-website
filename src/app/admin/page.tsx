import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export default async function AdminDashboardPage() {
  const user = await requireUser();
  const [companies, activeCompanies, projects, publishedProjects, news, publishedNews, draftNews, openCareers, newApplications, newMessages, media, activeUsers, activity, messages, applications] = await Promise.all([
    prisma.company.count(), prisma.company.count({ where: { status: "ACTIVE" } }),
    prisma.project.count(), prisma.project.count({ where: { status: "PUBLISHED" } }),
    prisma.newsArticle.count(), prisma.newsArticle.count({ where: { status: "PUBLISHED" } }),
    prisma.newsArticle.count({ where: { status: "DRAFT" } }), prisma.career.count({ where: { status: "OPEN" } }),
    prisma.jobApplication.count({ where: { status: "NEW" } }), prisma.contactMessage.count({ where: { status: "NEW" } }),
    prisma.mediaAsset.count(), prisma.user.count({ where: { status: "ACTIVE" } }),
    prisma.auditLog.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
    prisma.contactMessage.findMany({ take: 4, orderBy: { createdAt: "desc" }, select: { id: true, name: true, subject: true, status: true } }),
    prisma.jobApplication.findMany({ take: 4, orderBy: { createdAt: "desc" }, select: { id: true, applicantName: true, status: true, career: { select: { title: true } } } }),
  ]);
  const stats = [
    ["Companies", companies, `${activeCompanies} active`, "/admin/companies"],
    ["Projects", projects, `${publishedProjects} published`, "/admin/projects"],
    ["News", news, `${publishedNews} published · ${draftNews} draft`, "/admin/news"],
    ["Open Careers", openCareers, `${newApplications} new applications`, "/admin/careers"],
    ["New Messages", newMessages, "Awaiting review", "/admin/messages"],
    ["Media Assets", media, "Files in library", "/admin/media"],
    ["Administrators", activeUsers, "Active accounts", "/admin/users"],
  ] as const;
  return <div className="admin-dashboard">
    <section className="admin-dashboard__welcome"><div><p>{new Intl.DateTimeFormat("en-GB", { dateStyle: "full" }).format(new Date())}</p><h2>Welcome back,<span>{user.name}.</span></h2><p>Live operational overview for BCU Group.</p></div><Link href="/admin/news/new" className="admin-primary-button">Add New Content</Link></section>
    <section className="admin-stat-grid">{stats.map(([label, count, note, href]) => <article className="admin-stat-card" key={label}><div><span>{label}</span><strong>{count}</strong></div><p>{note}</p><Link href={href}>Manage →</Link></article>)}</section>
    <section className="admin-dashboard__grid">
      <article className="admin-panel"><div className="admin-panel__header"><div><p>Activity</p><h3>Recent content changes</h3></div></div><div className="admin-activity-list">{activity.map((item) => <div key={item.id}><span/><div><strong>{item.summary}</strong><p>{item.entityType}</p></div><small>{item.createdAt.toLocaleDateString()}</small></div>)}</div></article>
      <article className="admin-panel"><div className="admin-panel__header"><div><p>Inbox</p><h3>Recent messages</h3></div><Link href="/admin/messages">View all</Link></div><div className="admin-activity-list">{messages.map((item) => <div key={item.id}><span/><div><strong>{item.subject}</strong><p>{item.name}</p></div><small>{item.status}</small></div>)}</div></article>
      <article className="admin-panel"><div className="admin-panel__header"><div><p>Recruitment</p><h3>Recent applications</h3></div><Link href="/admin/careers/applications">View all</Link></div><div className="admin-activity-list">{applications.map((item) => <div key={item.id}><span/><div><strong>{item.applicantName}</strong><p>{item.career.title}</p></div><small>{item.status}</small></div>)}</div></article>
    </section>
  </div>;
}
