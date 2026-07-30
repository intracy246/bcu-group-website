import type { Prisma } from "@prisma/client";

export function safeStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}
export function safeParagraphArray(value: Prisma.JsonValue): string[] {
  if (!value || typeof value !== "object" || Array.isArray(value)) return [];
  return safeStringArray((value as { paragraphs?: unknown }).paragraphs);
}
export function toISOStringOrNull(value: Date | null | undefined) {
  return value?.toISOString() ?? null;
}
