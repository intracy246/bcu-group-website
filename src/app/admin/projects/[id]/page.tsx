"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getAdminProjectById } from "@/lib/admin-project-store";
import type { AdminProject } from "@/types/admin-project";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export default function AdminProjectDetailsPage() {
  const params = useParams<{ id: string }>();
  const [project, setProject] =
    useState<AdminProject | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setProject(getAdminProjectById(params.id) ?? null);
    setLoaded(true);
  }, [params.id]);

  if (!loaded) {
    return (
      <div className="admin-project-loading">
        Loading project...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="admin-empty-state">
        <span>Project Not Found</span>
        <h3>This project does not exist.</h3>
        <Link
          href="/admin/projects"
          className="admin-primary-button"
        >
          Return to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="admin-project-detail-page">
      <div className="admin-project-detail__top">
        <Link href="/admin/projects">
          ← Back to Projects
        </Link>

        <div>
          <Link
            href={`/admin/projects/${project.id}/edit`}
            className="admin-primary-button"
          >
            Edit Project
            <span>✎</span>
          </Link>
        </div>
      </div>

      <section className="admin-project-detail__hero">
        <div>
          <span>{project.company}</span>

          <h2>{project.name}</h2>

          <p>{project.summary}</p>

          <div className="admin-project-detail__badges">
            <span
              className={`admin-status-badge admin-status-badge--${project.status.toLowerCase()}`}
            >
              <i />
              {project.status}
            </span>

            <span>{project.category}</span>

            {project.featured && (
              <span>Featured Project</span>
            )}
          </div>
        </div>

        <div className="admin-project-detail__logo">
          {project.logo ? (
            <Image
              src={project.logo}
              alt={`${project.name} logo`}
              fill
              sizes="220px"
            />
          ) : (
            <strong>
              {project.name.slice(0, 2).toUpperCase()}
            </strong>
          )}
        </div>
      </section>

      <section className="admin-project-detail__grid">
        <article className="admin-form-section">
          <div className="admin-form-section__heading">
            <span>01</span>
            <div>
              <h3>Project Description</h3>
              <p>Detailed project information.</p>
            </div>
          </div>

          <p className="admin-project-detail__description">
            {project.description ||
              "No detailed description has been added."}
          </p>
        </article>

        <article className="admin-form-section">
          <div className="admin-form-section__heading">
            <span>02</span>
            <div>
              <h3>Administration</h3>
              <p>Project management information.</p>
            </div>
          </div>

          <div className="admin-project-detail__facts">
            <div>
              <span>Slug</span>
              <strong>{project.slug}</strong>
            </div>

            <div>
              <span>Display order</span>
              <strong>{project.displayOrder}</strong>
            </div>

            <div>
              <span>Created</span>
              <strong>
                {formatDate(project.createdAt)}
              </strong>
            </div>

            <div>
              <span>Last updated</span>
              <strong>
                {formatDate(project.updatedAt)}
              </strong>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}