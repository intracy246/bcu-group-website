import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicTeamMember } from "@/lib/team-service";
import { getPublicSiteSettings } from "@/lib/site-settings";
import { personJsonLd } from "@/lib/team-mapping";
import TeamProfile from "@/components/team/TeamProfile";
export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const member = await getPublicTeamMember((await params).slug);
  if (!member) return { title: "Profile not found", robots: { index: false, follow: false } };
  const settings = await getPublicSiteSettings();
  const title = member.seoTitle || `${member.name} — ${member.title} | ${settings.siteName}`;
  const description = member.seoDescription || member.shortBio || `${member.name}, ${member.title}${member.company ? ` at ${member.company}` : ""}.`;
  const url = `${settings.publicWebsiteUrl.replace(/\/$/, "")}/team/${member.slug}`;
  const images = member.photo ? [{ url: new URL(member.photo, settings.publicWebsiteUrl).href, alt: member.name }] : [];
  return { title, description, alternates: { canonical: url }, openGraph: { type: "profile", title, description, url, images }, twitter: { card: images.length ? "summary_large_image" : "summary", title, description, images } };
}
export default async function ProfilePage({ params }: Props) {
  const member = await getPublicTeamMember((await params).slug);
  if (!member) notFound();
  const settings = await getPublicSiteSettings();
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: personJsonLd(member, settings.publicWebsiteUrl.replace(/\/$/, "")) }} /><TeamProfile member={member} /></>;
}
