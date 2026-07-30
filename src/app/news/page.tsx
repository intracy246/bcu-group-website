import Link from "next/link";
import NewsDirectory from "@/components/news/NewsDirectory";
import NewsImage from "@/components/news/NewsImage";
import { listPublishedNews } from "@/lib/news-service";

export const dynamic = "force-dynamic";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export default async function NewsPage() {
  const articles = await listPublishedNews();
  const featuredArticle =
    articles.find((article) => article.featured) ??
    articles[0];

  return (
    <>
      <section className="news-page-hero">
        <div className="news-page-hero__grid" />
        <div className="news-page-hero__glow" />

        <div className="section-container news-page-hero__content">
          <p className="section-kicker">
            News and Insights
          </p>

          <h1>
            Ideas, progress and
            <span>group developments.</span>
          </h1>

          <p>
            Follow the latest announcements, project updates,
            partnerships and strategic developments across BCU
            Group, Ready Food Company and SmartCycle Technologies.
          </p>
        </div>
      </section>

      {featuredArticle && (
        <section className="news-featured section">
          <div className="section-container">
            <p className="section-kicker">
              Featured Update
            </p>

            <article className="featured-news-card">
              <Link
                href={`/news/${featuredArticle.slug}`}
                className="featured-news-card__image"
              >
                <NewsImage
                  src={featuredArticle.coverImage}
                  alt={featuredArticle.coverImageAlt}
                  priority
                  className="featured-news-card__image-element"
                />
              </Link>

              <div className="featured-news-card__content">
                <div className="featured-news-card__meta">
                  <span>{featuredArticle.company}</span>
                  <span>
                    {formatDate(featuredArticle.publishedAt)}
                  </span>
                </div>

                <h2>{featuredArticle.title}</h2>

                <p>{featuredArticle.excerpt}</p>

                <div className="featured-news-card__tags">
                  {featuredArticle.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>

                <Link
                  href={`/news/${featuredArticle.slug}`}
                  className="button button--gold"
                >
                  Read Full Article
                  <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </article>
          </div>
        </section>
      )}

      <NewsDirectory articles={articles} />

      <section className="news-media section">
        <div className="section-container news-media__grid">
          <div className="section-heading">
            <p className="section-kicker">
              Media and Enquiries
            </p>

            <h2>
              Looking for official
              <br />
              <span>BCU information?</span>
            </h2>
          </div>

          <div className="news-media__content">
            <p>
              Journalists, institutional partners and stakeholders
              may contact BCU Group for official company
              information, project briefings and media enquiries.
            </p>

            <Link href="/contact" className="button button--gold">
              Contact Communications
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
