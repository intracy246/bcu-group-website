"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import type { NewsDTO } from "@/lib/news-service";
import { saveNewsAction } from "@/app/actions/news";

type NewsFormProps = {
  mode: "create" | "edit";
  article?: NewsDTO;
  companies: { id: string; name: string }[];
};

type FormState = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  companyId: string;
  status: NewsDTO["status"];
  featured: boolean;
  coverImage: string;
  coverImageAlt: string;
  author: string;
  publishedAt: string;
  readingTime: string;
  tags: string;
  seoTitle: string;
  seoDescription: string;
};

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

function createInitialState(
  article?: NewsDTO
): FormState {
  if (article) {
    return {
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content.join("\n\n"),
      category: article.category,
      companyId: article.companyId ?? "",
      status: article.status,
      featured: article.featured,
      coverImage: article.coverImage,
      coverImageAlt: article.coverImageAlt,
      author: article.author,
      publishedAt: article.publishedAt,
      readingTime: article.readingTime,
      tags: article.tags.join(", "),
      seoTitle: article.seoTitle,
      seoDescription: article.seoDescription,
    };
  }

  return {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    companyId: "",
    status: "Draft",
    featured: false,
    coverImage: "",
    coverImageAlt: "",
    author: "BCU Group Communications",
    publishedAt: getTodayDate(),
    readingTime: "3 min read",
    tags: "",
    seoTitle: "",
    seoDescription: "",
  };
}

export default function NewsForm({
  mode,
  article,
  companies,
}: NewsFormProps) {
  const router = useRouter();

  const [form, setForm] = useState<FormState>(() =>
    createInitialState(article)
  );

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  function updateField<K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function handleTitleChange(value: string) {
    setForm((currentForm) => ({
      ...currentForm,
      title: value,
      slug:
        mode === "create"
          ? createSlug(value)
          : currentForm.slug,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!form.title.trim()) {
      setError("Article title is required.");
      return;
    }

    if (!form.slug.trim()) {
      setError("Article slug is required.");
      return;
    }

    if (!form.excerpt.trim()) {
      setError("Article excerpt is required.");
      return;
    }

    if (!form.content.trim()) {
      setError("Article content is required.");
      return;
    }

    if (!form.category.trim()) {
      setError("Article category is required.");
      return;
    }

    if (!form.publishedAt) {
      setError("Publication date is required.");
      return;
    }

    setIsSubmitting(true);

    const articleData = {
      title: form.title.trim(),
      slug: createSlug(form.slug),
      excerpt: form.excerpt.trim(),

      content: form.content
        .split(/\n\s*\n/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean),

      category: form.category.trim(),
      companyId: form.companyId || null,
      status: form.status,
      featured: form.featured,
      coverImage: form.coverImage.trim(),
      coverImageAlt:
        form.coverImageAlt.trim() ||
        form.title.trim(),

      author: form.author.trim(),
      publishedAt: form.publishedAt,
      readingTime: form.readingTime.trim(),

      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      seoTitle: form.seoTitle,
      seoDescription: form.seoDescription,
    };

    try {
      const result = await saveNewsAction(article?.id ?? null, articleData);
      if (!result.ok) throw new Error(result.error);

      router.push("/admin/news");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "The article could not be saved. Please try again."
      );

      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="admin-news-form"
      onSubmit={handleSubmit}
    >
      <div className="admin-news-form__header">
        <div>
          <p>
            {mode === "create"
              ? "Create Article"
              : "Edit Article"}
          </p>

          <h2>
            {mode === "create"
              ? "Add a new news article."
              : "Update news article."}
          </h2>

          <span>
            Complete the article details and choose
            whether it should be published, drafted or
            archived.
          </span>
        </div>

        <div className="admin-news-form__header-actions">
          <Link
            href="/admin/news"
            className="admin-secondary-button"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="admin-primary-button"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : mode === "create"
                ? "Create Article"
                : "Save Changes"}
          </button>
        </div>
      </div>

      {error && (
        <div className="admin-form-error">
          {error}
        </div>
      )}

      <div className="admin-news-form__layout">
        <div className="admin-news-form__main">
          <section className="admin-form-card">
            <div className="admin-form-card__heading">
              <p>Article Information</p>
              <h3>Main article details</h3>
            </div>

            <div className="admin-form-grid">
              <label className="admin-form-field admin-form-field--full">
                <span>Article Title *</span>

                <input
                  type="text"
                  value={form.title}
                  onChange={(event) =>
                    handleTitleChange(
                      event.target.value
                    )
                  }
                  placeholder="Enter article title"
                />
              </label>

              <label className="admin-form-field admin-form-field--full">
                <span>URL Slug *</span>

                <input
                  type="text"
                  value={form.slug}
                  onChange={(event) =>
                    updateField(
                      "slug",
                      createSlug(event.target.value)
                    )
                  }
                  placeholder="article-url-slug"
                />

                <small>
                  Public URL: /news/
                  {form.slug || "article-slug"}
                </small>
              </label>

              <label className="admin-form-field">
                <span>Company *</span>

                <select
                  value={form.companyId}
                  onChange={(event) =>
                    updateField(
                      "companyId",
                      event.target.value
                    )
                  }
                >
                  <option value="">BCU Group / no subsidiary</option>
                  {companies.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}
                </select>
              </label>

              <label className="admin-form-field">
                <span>Category *</span>

                <input
                  type="text"
                  value={form.category}
                  onChange={(event) =>
                    updateField(
                      "category",
                      event.target.value
                    )
                  }
                  placeholder="Corporate, Technology, Dairy..."
                />
              </label>

              <label className="admin-form-field admin-form-field--full">
                <span>Article Excerpt *</span>

                <textarea
                  value={form.excerpt}
                  onChange={(event) =>
                    updateField(
                      "excerpt",
                      event.target.value
                    )
                  }
                  rows={4}
                  placeholder="Write a brief summary of the article"
                />

                <small>
                  This text will appear on news cards
                  and search results.
                </small>
              </label>

              <label className="admin-form-field admin-form-field--full">
                <span>Article Content *</span>

                <textarea
                  value={form.content}
                  onChange={(event) =>
                    updateField(
                      "content",
                      event.target.value
                    )
                  }
                  rows={15}
                  placeholder="Write the full article here. Leave one empty line between paragraphs."
                />

                <small>
                  Leave one empty line between each
                  paragraph.
                </small>
              </label>
            </div>
          </section>

          <section className="admin-form-card">
            <div className="admin-form-card__heading">
              <p>Media</p>
              <h3>Article cover image</h3>
            </div>

            <div className="admin-form-grid">
              <label className="admin-form-field admin-form-field--full">
                <span>Cover Image Path</span>

                <input
                  type="text"
                  value={form.coverImage}
                  onChange={(event) =>
                    updateField(
                      "coverImage",
                      event.target.value
                    )
                  }
                  placeholder="/news/example-image.jpg"
                />

                <small>
                  Place the image inside public/news,
                  then enter its path here.
                </small>
              </label>

              <label className="admin-form-field admin-form-field--full">
                <span>Image Alternative Text</span>

                <input
                  type="text"
                  value={form.coverImageAlt}
                  onChange={(event) =>
                    updateField(
                      "coverImageAlt",
                      event.target.value
                    )
                  }
                  placeholder="Describe the image"
                />
              </label>
            </div>
          </section>
        </div>

        <aside className="admin-news-form__sidebar">
          <section className="admin-form-card">
            <div className="admin-form-card__heading">
              <p>Publishing</p>
              <h3>Publication settings</h3>
            </div>

            <div className="admin-form-grid">
              <label className="admin-form-field admin-form-field--full">
                <span>Status</span>

                <select
                  value={form.status}
                  onChange={(event) =>
                    updateField(
                      "status",
                      event.target
                        .value as NewsDTO["status"]
                    )
                  }
                >
                  <option value="Draft">
                    Draft
                  </option>

                  <option value="Published">
                    Published
                  </option>

                  <option value="Archived">
                    Archived
                  </option>
                </select>
              </label>

              <label className="admin-form-field admin-form-field--full">
                <span>Publication Date</span>

                <input
                  type="date"
                  value={form.publishedAt}
                  onChange={(event) =>
                    updateField(
                      "publishedAt",
                      event.target.value
                    )
                  }
                />
              </label>

              <label className="admin-form-field admin-form-field--full">
                <span>Author</span>

                <input
                  type="text"
                  value={form.author}
                  onChange={(event) =>
                    updateField(
                      "author",
                      event.target.value
                    )
                  }
                  placeholder="BCU Group Communications"
                />
              </label>

              <label className="admin-form-field admin-form-field--full">
                <span>Reading Time</span>

                <input
                  type="text"
                  value={form.readingTime}
                  onChange={(event) =>
                    updateField(
                      "readingTime",
                      event.target.value
                    )
                  }
                  placeholder="3 min read"
                />
              </label>

              <label className="admin-checkbox-field">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(event) =>
                    updateField(
                      "featured",
                      event.target.checked
                    )
                  }
                />

                <span>
                  <strong>Featured Article</strong>
                  <small>
                    Display this article prominently
                    on the public news page.
                  </small>
                </span>
              </label>
            </div>
          </section>

          <section className="admin-form-card">
            <div className="admin-form-card__heading">
              <p>Discoverability</p>
              <h3>Article tags</h3>
            </div>

            <label className="admin-form-field">
              <span>Tags</span>

              <textarea
                value={form.tags}
                onChange={(event) =>
                  updateField(
                    "tags",
                    event.target.value
                  )
                }
                rows={6}
                placeholder="Technology, Partnership, SmartCampus360"
              />

              <small>
                Separate each tag using a comma.
              </small>
            </label>
            <label className="admin-form-field">
              <span>SEO Title</span>
              <input value={form.seoTitle} maxLength={70} onChange={(event) => updateField("seoTitle", event.target.value)} placeholder="Optional search title" />
            </label>
            <label className="admin-form-field">
              <span>SEO Description</span>
              <textarea value={form.seoDescription} maxLength={180} rows={4} onChange={(event) => updateField("seoDescription", event.target.value)} placeholder="Optional search description" />
            </label>
          </section>
        </aside>
      </div>
    </form>
  );
}
