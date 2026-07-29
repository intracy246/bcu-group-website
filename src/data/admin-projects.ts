import { companies } from "@/data/companies";
import type {
  AdminProject,
  AdminProjectCompany,
  AdminProjectStatus,
} from "@/types/admin-project";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function getString(
  record: UnknownRecord,
  keys: string[],
  fallback = ""
): string {
  for (const key of keys) {
    const value = record[key];

    if (
      typeof value === "string" &&
      value.trim().length > 0
    ) {
      return value.trim();
    }
  }

  return fallback;
}

function getNumber(
  record: UnknownRecord,
  keys: string[],
  fallback: number
): number {
  for (const key of keys) {
    const value = record[key];

    if (
      typeof value === "number" &&
      Number.isFinite(value)
    ) {
      return value;
    }

    if (
      typeof value === "string" &&
      value.trim() !== "" &&
      Number.isFinite(Number(value))
    ) {
      return Number(value);
    }
  }

  return fallback;
}

function getBoolean(
  record: UnknownRecord,
  keys: string[],
  fallback = false
): boolean {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "boolean") {
      return value;
    }
  }

  return fallback;
}

function createSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getAdminCompanyName(
  companySlug: string,
  companyName: string
): AdminProjectCompany {
  const normalizedSlug = companySlug.toLowerCase();
  const normalizedName = companyName.toLowerCase();

  if (
    normalizedSlug.includes("rfc") ||
    normalizedName.includes("ready food")
  ) {
    return "Ready Food Company";
  }

  if (
    normalizedSlug.includes("smartcycle") ||
    normalizedName.includes("smartcycle")
  ) {
    return "SmartCycle Technologies";
  }

  return "BCU Group";
}

function getProjectStatus(
  project: UnknownRecord
): AdminProjectStatus {
  const status = getString(
    project,
    ["status", "projectStatus"],
    "Published"
  ).toLowerCase();

  if (status === "draft") {
    return "Draft";
  }

  if (status === "archived") {
    return "Archived";
  }

  return "Published";
}

const fallbackDate = "2026-07-28T00:00:00.000Z";

export const starterAdminProjects: AdminProject[] =
  companies.flatMap((company, companyIndex) => {
    const companyRecord = company as unknown as UnknownRecord;

    const companyName = getString(
      companyRecord,
      ["name", "companyName"],
      "BCU Group"
    );

    const companySlug = getString(
      companyRecord,
      ["slug", "id"],
      createSlug(companyName)
    );

    const companyLogo = getString(
      companyRecord,
      ["logo"],
      ""
    );

    const adminCompanyName = getAdminCompanyName(
      companySlug,
      companyName
    );

    const rawProjects = Array.isArray(companyRecord.projects)
      ? companyRecord.projects
      : [];

    return rawProjects.map(
      (rawProject, projectIndex): AdminProject => {
        const project = isRecord(rawProject)
          ? rawProject
          : {};

        const name = getString(
          project,
          ["name", "title", "projectName"],
          `Project ${projectIndex + 1}`
        );

        const slug = getString(
          project,
          ["slug", "id"],
          createSlug(name)
        );

        const summary = getString(
          project,
          [
            "summary",
            "shortDescription",
            "excerpt",
            "tagline",
            "description",
          ],
          `${name} is a project under ${companyName}.`
        );

        const description = getString(
          project,
          [
            "description",
            "fullDescription",
            "overview",
            "summary",
          ],
          summary
        );

        const category = getString(
          project,
          [
            "category",
            "sector",
            "industry",
            "type",
          ],
          adminCompanyName ===
          "SmartCycle Technologies"
            ? "Technology"
            : adminCompanyName ===
              "Ready Food Company"
            ? "Food and Business"
            : "Strategic Initiative"
        );

        const coverImage = getString(
          project,
          [
            "coverImage",
            "image",
            "featuredImage",
            "thumbnail",
            "heroImage",
          ],
          ""
        );

        const logo = getString(
          project,
          ["logo", "projectLogo"],
          companyLogo
        );

        const createdAt = getString(
          project,
          ["createdAt", "createdDate"],
          fallbackDate
        );

        const updatedAt = getString(
          project,
          ["updatedAt", "lastUpdated"],
          createdAt
        );

        return {
          id: `${companySlug}-${slug}`,
          name,
          slug,
          company: adminCompanyName,
          category,
          status: getProjectStatus(project),
          summary,
          description,
          logo,
          coverImage,
          featured: getBoolean(
            project,
            ["featured", "isFeatured"],
            false
          ),
          displayOrder: getNumber(
            project,
            ["displayOrder", "order"],
            companyIndex * 100 + projectIndex + 1
          ),
          createdAt,
          updatedAt,
        };
      }
    );
  });