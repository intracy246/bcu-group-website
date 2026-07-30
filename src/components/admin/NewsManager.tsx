"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { deleteNewsAction } from "@/app/actions/news";
import type { NewsDTO } from "@/lib/news-service";

type StatusFilter = "All" | NewsDTO["status"];

function formatDate(date: string) {
  if (!date) {
    return "Not published";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default function NewsManager({ initialArticles }: { initialArticles: NewsDTO[] }) {
  const [articles, setArticles] = useState(initialArticles);
  const [pending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("All");
  const [companyFilter, setCompanyFilter] = useState("All");

  const filteredArticles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return articles
      .filter((article) => {
        const matchesSearch =
          query.length === 0 ||
          article.title.toLowerCase().includes(query) ||
          article.excerpt.toLowerCase().includes(query) ||
          article.category.toLowerCase().includes(query) ||
          article.author.toLowerCase().includes(query) ||
          article.tags.some((tag) =>
            tag.toLowerCase().includes(query)
          );

        const matchesStatus =
          statusFilter === "All" ||
          article.status === statusFilter;

        const matchesCompany =
          companyFilter === "All" ||
          article.company === companyFilter;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesCompany
        );
      })
      .sort(
        (first, second) =>
          new Date(second.publishedAt).getTime() -
          new Date(first.publishedAt).getTime()
      );
  }, [
    articles,
    companyFilter,
    searchQuery,
    statusFilter,
  ]);

  const publishedCount = articles.filter(
    (article) => article.status === "Published"
  ).length;

  const draftCount = articles.filter(
    (article) => article.status === "Draft"
  ).length;

  const featuredCount = articles.filter(
    (article) => article.featured
  ).length;

  function handleDelete(article: NewsDTO) {
    const confirmed = window.confirm(
      `Delete "${article.title}"?\n\nThis action will remove the article from the News Management system.`
    );

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      const result = await deleteNewsAction(article.id);
      if (result.ok) setArticles((current) => current.filter((item) => item.id !== article.id));
      else window.alert(result.error);
    });
  }

  return (
    <div className="admin-news-page">
      <section className="admin-page-intro">
        <div>
          <p>News Management</p>

          <h2>
            Manage BCU Group
            <span>news and insights.</span>
          </h2>

          <p>
            Create, publish, update and remove official news,
            announcements and project developments across BCU
            Group, Ready Food Company and SmartCycle Technologies.
          </p>
        </div>

        <Link
          href="/admin/news/new"
          className="admin-primary-button"
        >
          Add News
          <span>＋</span>
        </Link>
      </section>

      <section className="admin-company-summary">
        <article>
          <span>Total Articles</span>
          <strong>{articles.length}</strong>
          <p>All registered news articles</p>
        </article>

        <article>
          <span>Published</span>
          <strong>{publishedCount}</strong>
          <p>Visible on the public website</p>
        </article>

        <article>
          <span>Draft Articles</span>
          <strong>{draftCount}</strong>
          <p>Articles under preparation</p>
        </article>

        <article>
          <span>Featured</span>
          <strong>{featuredCount}</strong>
          <p>Priority news and updates</p>
        </article>
      </section>

      <section className="admin-data-panel">
        <div className="admin-data-panel__toolbar">
          <div>
            <p>News Directory</p>
            <h3>All articles</h3>
          </div>

          <div className="admin-news-controls">
            <label className="admin-search-field">
              <span>Search news</span>

              <input
                type="search"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Title, category, author or tag..."
              />
            </label>

            <label className="admin-select-field">
              <span>Company</span>

              <select
                value={companyFilter}
                onChange={(event) =>
                  setCompanyFilter(
                    event.target.value
                  )
                }
              >
                <option value="All">All</option>
                {Array.from(new Set(articles.map((article) => article.company))).map((company) => <option key={company} value={company}>{company}</option>)}
              </select>
            </label>

            <label className="admin-select-field">
              <span>Status</span>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as StatusFilter
                  )
                }
              >
                <option value="All">All</option>
                <option value="Published">
                  Published
                </option>
                <option value="Draft">Draft</option>
                <option value="Archived">
                  Archived
                </option>
              </select>
            </label>
          </div>
        </div>

        <div className="admin-table-result">
          <strong>{filteredArticles.length}</strong>

          <span>
            {filteredArticles.length === 1
              ? "Article"
              : "Articles"}
          </span>
        </div>

        {filteredArticles.length > 0 ? (
          <div className="admin-news-table">
            <div className="admin-news-table__header">
              <span>Article</span>
              <span>Company</span>
              <span>Category</span>
              <span>Status</span>
              <span>Published</span>
              <span>Actions</span>
            </div>

            {filteredArticles.map((article) => (
              <article
                key={article.id}
                className="admin-news-row"
              >
                <div className="admin-news-row__identity">
                  <div className="admin-news-row__image">
                    {article.coverImage ? (
                      <Image
                        src={article.coverImage}
                        alt={
                          article.coverImageAlt ||
                          article.title
                        }
                        fill
                        sizes="88px"
                      />
                    ) : (
                      <span>
                        {article.title
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div>
                    <strong>{article.title}</strong>
                    <span>/{article.slug}</span>
                    <small>{article.excerpt}</small>
                  </div>
                </div>

                <div className="admin-news-row__company">
                  <strong>{article.company}</strong>

                  <span>{article.author}</span>
                </div>

                <div className="admin-news-row__category">
                  <strong>{article.category}</strong>

                  <span>
                    {article.tags.length} tags
                  </span>
                </div>

                <div>
                  <span
                    className={`admin-status-badge admin-status-badge--${article.status.toLowerCase()}`}
                  >
                    <i />
                    {article.status}
                  </span>

                  {article.featured && (
                    <span className="admin-news-featured">
                      Featured
                    </span>
                  )}
                </div>

                <div className="admin-news-row__date">
                  <strong>
                    {formatDate(article.publishedAt)}
                  </strong>

                  <span>{article.readingTime}</span>
                </div>

                <div className="admin-news-row__actions">
                  <Link
                    href={`/admin/news/${article.id}`}
                  >
                    View
                  </Link>

                  <Link
                    href={`/admin/news/${article.id}/edit`}
                  >
                    Edit
                  </Link>

                  <button
                    type="button"
                    disabled={pending}
                    onClick={() =>
                      handleDelete(article)
                    }
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="admin-empty-state">
            <span>No News Found</span>

            <h3>
              No articles match the selected filters.
            </h3>

            <p>
              Change the filters or create a new article.
            </p>

            <Link
              href="/admin/news/new"
              className="admin-primary-button"
            >
              Create News Article
              <span>＋</span>
            </Link>
          </div>
        )}

        <div className="admin-table-footer">
          <p>
            Showing {filteredArticles.length} of{" "}
            {articles.length} articles
          </p>
        </div>
      </section>
    </div>
  );
}
