import { randomUUID } from "node:crypto";
import path from "node:path";

export type StorageVisibility = "public" | "private";

const safeFolder = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9/_-]+/g, "-")
    .replace(/\.{2,}/g, "")
    .replace(/^\/+|\/+$/g, "") || "general";

const safeExtension = (name: string) => {
  const extension = path.extname(name).toLowerCase().replace(/[^a-z0-9.]/g, "");
  return extension.length <= 10 ? extension : "";
};

export function generateSafeStorageKey(
  folder: string,
  originalName: string,
  visibility: StorageVisibility,
): string {
  return `${visibility}/${safeFolder(folder)}/${randomUUID()}${safeExtension(originalName)}`;
}

export function resolveStoragePath(root: string, key: string): string {
  const normalized = key.replaceAll("\\", "/");
  if (
    normalized.includes("..") ||
    normalized.startsWith("/") ||
    !normalized.match(/^(public|private)\/[a-z0-9/_\-.]+$/)
  ) {
    throw new Error("Invalid storage key.");
  }
  const resolved = path.resolve(root, ...normalized.split("/"));
  if (!resolved.startsWith(`${path.resolve(root)}${path.sep}`)) {
    throw new Error("Invalid storage path.");
  }
  return resolved;
}
