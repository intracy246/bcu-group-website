import Link from "next/link";
import type { CompanyProject } from "@/data/companies";

type ProjectCardProps = {
  project: CompanyProject;
  companySlug: string;
  theme: "rfc" | "smartcycle";
};

export default function ProjectCard({
  project,
  companySlug,
  theme,
}: ProjectCardProps) {
  return (
    <article className={`project-card project-card--${theme}`}>
      <div className="project-card__top">
        <span className="project-card__category">{project.category}</span>

        <span
          className={`project-card__status project-card__status--${project.status
            .toLowerCase()
            .replace(" ", "-")}`}
        >
          {project.status}
        </span>
      </div>

      <div className="project-card__content">
        {project.shortName && (
          <p className="project-card__short-name">{project.shortName}</p>
        )}

        <h3>{project.name}</h3>
        <p>{project.summary}</p>
      </div>

      <div className="project-card__tags">
        {project.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      <Link
        href={`/companies/${companySlug}/projects/${project.slug}`}
        className="project-card__link"
      >
        View Project
        <span aria-hidden="true">↗</span>
      </Link>
    </article>
  );
}