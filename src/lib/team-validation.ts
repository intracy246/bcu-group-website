import { z } from "zod";

const text = (max = 240) => z.string().trim().max(max);
export const teamUrlSchema = text(2048).refine(value => {
  if (!value) return true;
  try { const url = new URL(value); return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password; } catch { return false; }
}, "Use a full HTTP or HTTPS URL.");
export const teamPhotoSchema = text(2048).refine(value => !value || /^\/api\/files\/public\/[a-zA-Z0-9/_\-.]+$/.test(value) || (teamUrlSchema.safeParse(value).success && !/\/private\//i.test(value)), "Select a public image from the media library.");
export const teamTimelineSchema = z.object({ title: text().min(1), organisation: text(), period: text(100), description: text(5000) });
export const teamSocialSchema = z.object({ label: text(80).min(1), url: teamUrlSchema.refine(Boolean, "A URL is required.") });
const list = z.array(text(100).min(1)).max(100);
export const teamProjectSchema = z.object({ projectId: text(100), name: text(), category: text(), description: text(5000), role: text(), technologies: list, image: teamPhotoSchema, link: teamUrlSchema, displayOrder: z.number().int().min(0).max(100000) }).refine(v => Boolean(v.projectId || v.name), "Select a BCU project or enter a project name.");
export const teamInputSchema = z.object({
  name: text(120).min(2), slug: text(120).min(2).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and single hyphens for the slug."),
  title: text().min(2), secondaryTitle: text(), company: text(), department: text(), shortBio: text(600), biography: text(30000), photo: teamPhotoSchema,
  email: text(254).email().or(z.literal("")), phone: text(40).regex(/^[+\d\s().-]*$/, "Enter a valid phone number."), location: text(),
  linkedinUrl: teamUrlSchema, githubUrl: teamUrlSchema, websiteUrl: teamUrlSchema, otherSocialLinks: z.array(teamSocialSchema).max(20),
  skills: list, expertise: list, achievements: z.array(teamTimelineSchema).max(100), experience: z.array(teamTimelineSchema).max(100), education: z.array(teamTimelineSchema).max(100), leadership: z.array(teamTimelineSchema).max(100),
  technology: text(20000), vision: text(10000), publicContact: z.boolean(), featured: z.boolean(), published: z.boolean(), displayOrder: z.number().int().min(0).max(100000),
  profileType: z.enum(["STANDARD", "FOUNDER_PORTFOLIO"]), seoTitle: text(70), seoDescription: text(180), portfolioProjects: z.array(teamProjectSchema).max(100),
});
export type TeamInput = z.infer<typeof teamInputSchema>;
export const emptyTeam: TeamInput = { name: "", slug: "", title: "", secondaryTitle: "", company: "", department: "", shortBio: "", biography: "", photo: "", email: "", phone: "", location: "", linkedinUrl: "", githubUrl: "", websiteUrl: "", otherSocialLinks: [], skills: [], expertise: [], achievements: [], experience: [], education: [], leadership: [], technology: "", vision: "", publicContact: false, featured: false, published: false, displayOrder: 0, profileType: "STANDARD", seoTitle: "", seoDescription: "", portfolioProjects: [] };

export function readTeamRows<T>(schema: z.ZodType<T>, value: unknown): T[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap(row => { const parsed = schema.safeParse(row); return parsed.success ? [parsed.data] : []; });
}
