import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminNewsById } from "@/lib/news-service";

export default async function AdminNewsDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const article = await getAdminNewsById((await params).id);
  if (!article) notFound();
  return <div className="admin-news-details">
    <section className="admin-page-intro"><div><p>{article.status}</p><h2>{article.title}</h2><p>{article.excerpt}</p></div><Link className="admin-primary-button" href={`/admin/news/${article.id}/edit`}>Edit Article</Link></section>
    <section className="admin-form-card"><div className="admin-form-card__heading"><p>{article.company}</p><h3>{article.category}</h3></div>
      <p>/{article.slug}</p>{article.content.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      <p>Created {new Date(article.createdAt).toLocaleString()} · Updated {new Date(article.updatedAt).toLocaleString()}</p>
    </section>
  </div>;
}
