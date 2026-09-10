import type { Prisma } from "@prisma/client";
import { readTeamRows, teamSocialSchema, teamTimelineSchema, type TeamInput } from "./team-validation";
export type TeamRecord = Prisma.TeamMemberGetPayload<{ include: { portfolioProjects: { include: { project: { include: { company: true } } } } } }>;
export function toTeamInput(row: TeamRecord): TeamInput {
  return {
    name: row.name, slug: row.slug, title: row.title, secondaryTitle: row.secondaryTitle, company: row.company, department: row.department,
    shortBio: row.shortBio, biography: row.biography, photo: row.photo, email: row.email, phone: row.phone, location: row.location,
    linkedinUrl: row.linkedinUrl, githubUrl: row.githubUrl, websiteUrl: row.websiteUrl,
    otherSocialLinks: readTeamRows(teamSocialSchema, row.otherSocialLinks), skills: row.skills, expertise: row.expertise,
    achievements: readTeamRows(teamTimelineSchema, row.achievements), experience: readTeamRows(teamTimelineSchema, row.experience), education: readTeamRows(teamTimelineSchema, row.education), leadership: readTeamRows(teamTimelineSchema, row.leadership),
    technology: row.technology, vision: row.vision, publicContact: row.publicContact, featured: row.featured, published: row.published, displayOrder: row.displayOrder, profileType: row.profileType, seoTitle: row.seoTitle, seoDescription: row.seoDescription,
    portfolioProjects: row.portfolioProjects.map(p => ({ projectId: p.projectId || "", name: p.name, category: p.category, description: p.description, role: p.role, technologies: p.technologies, image: p.image, link: p.link, displayOrder: p.displayOrder })),
  };
}
export function toPublicTeam(row: TeamRecord) {
  const profile = toTeamInput(row);
  return {
    name: profile.name, slug: profile.slug, title: profile.title, secondaryTitle: profile.secondaryTitle, company: profile.company, department: profile.department, shortBio: profile.shortBio, biography: profile.biography, photo: profile.photo,
    email: profile.publicContact ? profile.email : "", phone: profile.publicContact ? profile.phone : "", location: profile.publicContact ? profile.location : "",
    linkedinUrl: profile.linkedinUrl, githubUrl: profile.githubUrl, websiteUrl: profile.websiteUrl, otherSocialLinks: profile.otherSocialLinks,
    skills: profile.skills, expertise: profile.expertise, achievements: profile.achievements, experience: profile.experience, education: profile.education, leadership: profile.leadership, technology: profile.technology, vision: profile.vision, featured: profile.featured, profileType: profile.profileType, seoTitle: profile.seoTitle, seoDescription: profile.seoDescription,
    portfolioProjects: row.portfolioProjects.filter(p => !p.project || (p.project.status === "PUBLISHED" && p.project.company.status === "ACTIVE")).map(p => ({
      name: p.project?.title || p.name, category: p.project?.category || p.category, description: p.project?.summary || p.description,
      role: p.role, technologies: p.technologies.length ? p.technologies : p.project?.tags || [], image: p.project?.coverImageUrl || p.image,
      link: p.project ? `/companies/${p.project.company.slug}/projects/${p.project.slug.replace(`${p.project.company.slug}-`, "")}` : p.link,
    })),
  };
}
export type PublicTeam = ReturnType<typeof toPublicTeam>;
export function personJsonLd(member: PublicTeam, base: string) {
  return JSON.stringify({ "@context": "https://schema.org", "@type": "Person", name: member.name, jobTitle: member.title, description: member.shortBio, url: `${base}/team/${member.slug}`, image: member.photo ? new URL(member.photo, base).href : undefined,
    worksFor: member.company ? { "@type": "Organization", name: member.company } : undefined,
    sameAs: [member.linkedinUrl, member.githubUrl, member.websiteUrl, ...member.otherSocialLinks.map(s => s.url)].filter(Boolean), email: member.email || undefined, telephone: member.phone || undefined,
  }).replace(/</g, "\\u003c");
}
