import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import NewsImage from "@/components/news/NewsImage";
import {
  getNewsBySlug,
  getPublishedNews,
} from "@/data/news";

type NewsArticlePageProps = {
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
  return getPublishedNews().map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: NewsArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getNewsBySlug(slug);

  if (!article) {
    return {
      title: "News Article Not Found",
    };
  }

  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function NewsArticlePage({
  params,
}: NewsArticlePageProps) {
  const { slug } = await params;
  const article = getNewsBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = getPublishedNews()
    .filter(
      (relatedArticle) =>
        relatedArticle.id !== article.id
    )
    .slice(0, 3);

  return (
    <>
      <article className="news-article">
        <header className="news-article__header">
          <div className="news-article__grid" />
          <div className="news-article__glow" />

          <div className="section-container">
            <Link href="/news" className="news-article__back">
              <span aria-hidden="true">←</span>
              Back to News
            </Link>

            <div className="news-article__meta">
              <span>{article.company}</span>
              <span>{article.category}</span>
              <span>{formatDate(article.publishedAt)}</span>
              <span>{article.readingTime}</span>
            </div>

            <h1>{article.title}</h1>

            <p>{article.excerpt}</p>
          </div>
        </header>

        <div className="section-container">
          <div className="news-article__cover">
            <NewsImage
              src={article.coverImage}
              alt={article.coverImageAlt}
              priority
              className="news-article__cover-image"
            />
          </div>
        </div>

        <section className="news-article__body section">
          <div className="section-container news-article__layout">
            <aside className="news-article__aside">
              <div>
                <span>Published by</span>
                <strong>{article.author}</strong>
              </div>

              <div>
                <span>Publication date</span>
                <strong>
                  {formatDate(article.publishedAt)}
                </strong>
              </div>

              <div className="news-article__tags">
                {article.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </aside>

            <div className="news-article__content">
              {article.content.map((paragraph, index) => (
                <p key={`${article.id}-${index}`}>
                  {paragraph}
                </p>
              ))}

              <div className="news-article__contact">
                <p>
                  For official information about this update,
                  contact BCU Group.
                </p>

                <Link href="/contact">
                  Contact Us
                  <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </article>

      <section className="related-news section">
        <div className="section-container">
          <div className="related-news__heading">
            <div>
              <p className="section-kicker">
                Continue Reading
              </p>
              <h2>Related news</h2>
            </div>

            <Link href="/news">
              View All News
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="related-news__grid">
            {relatedArticles.map((relatedArticle) => (
              <Link
                key={relatedArticle.id}
                href={`/news/${relatedArticle.slug}`}
                className="related-news-card"
              >
                <span>{relatedArticle.company}</span>
                <h3>{relatedArticle.title}</h3>
                <p>{relatedArticle.excerpt}</p>
                <strong aria-hidden="true">↗</strong>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}