import type { ContentStatus } from "@prisma/client";
export type EditorialStatus = "Draft" | "Published" | "Archived";
export const mapContentStatus = (status: EditorialStatus): ContentStatus =>
  status === "Published" ? "PUBLISHED" : status === "Archived" ? "ARCHIVED" : "DRAFT";
