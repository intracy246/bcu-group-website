"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { NewsDTO } from "@/lib/news-service";
import NewsImage from "./NewsImage";

type NewsDirectoryProps = {
  articles: NewsDTO[];
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function getTheme(company: string) {
  if (company === "Ready Food Company") {
    return "rfc";
  }

  if (company === "SmartCycle Technologies") {
    return "smartcycle";
  }

  return "bcu";
}

export default function NewsDirectory({
  articles,
}: NewsDirectoryProps) {
  const [activeFilter, setActiveFilter] =
    useState("All");

  const [searchQuery, setSearchQuery] = useState("");
  const filters = useMemo(() => ["All", ...Array.from(new Set(articles.map((article) => article.company)))], [articles]);

  const filteredArticles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return articles.filter((article) => {
      const matchesCompany =
        activeFilter === "All" ||
        article.company === activeFilter;

      const matchesSearch =
        query.length === 0 ||
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query) ||
        article.tags.some((tag) =>
          tag.toLowerCase().includes(query)
        );

      return matchesCompany && matchesSearch;
    });
  }, [activeFilter, articles, searchQuery]);

  return (
    <section className="news-directory section">
      <div className="section-container">
        <div className="news-directory__toolbar">
          <div className="news-directory__filters">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                className={`news-filter-button ${
                  activeFilter === filter
                    ? "news-filter-button--active"
                    : ""
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          <label className="news-search">
            <span>Search News</span>

            <input
              type="search"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              placeholder="Search articles..."
            />
          </label>
        </div>

        <div className="news-directory__results">
          <strong>{filteredArticles.length}</strong>
          <span>
            {filteredArticles.length === 1
              ? "Article"
              : "Articles"}
          </span>
        </div>

        {filteredArticles.length > 0 ? (
          <div className="news-directory__grid">
            {filteredArticles.map((article) => {
              const theme = getTheme(article.company);

              return (
                <article
                  key={article.id}
                  className={`news-card news-card--${theme}`}
                >
                  <Link
                    href={`/news/${article.slug}`}
                    className="news-card__image"
                  >
                    <NewsImage
                      src={article.coverImage}
                      alt={article.coverImageAlt}
                      className="news-card__image-element"
                    />

                    <span className="news-card__company">
                      {article.company}
                    </span>
                  </Link>

                  <div className="news-card__body">
                    <div className="news-card__meta">
                      <span>{article.category}</span>
                      <span>{formatDate(article.publishedAt)}</span>
                    </div>

                    <h2>
                      <Link href={`/news/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h2>

                    <p>{article.excerpt}</p>

                    <div className="news-card__footer">
                      <span>{article.readingTime}</span>

                      <Link href={`/news/${article.slug}`}>
                        Read Article
                        <span aria-hidden="true">↗</span>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="news-empty-state">
            <span>No Results</span>
            <h2>No news articles match your search.</h2>
            <p>
              Change the selected company or search keyword.
            </p>

            <button
              type="button"
              onClick={() => {
                setActiveFilter("All");
                setSearchQuery("");
              }}
            >
              View All News
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
