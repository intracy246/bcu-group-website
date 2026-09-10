import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getPublicSiteSettings } from "@/lib/site-settings";
import { Portrait } from "@/components/team/TeamProfile";
import styles from "@/components/team/team.module.css";
export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSiteSettings();
  const title = `Our Team | ${settings.siteName}`; const description = "Meet the people building BCU Group: leadership, expertise and a shared commitment to Africa’s future.";
  return { title, description, alternates: { canonical: `${settings.publicWebsiteUrl.replace(/\/$/, "")}/team` }, openGraph: { title, description }, twitter: { card: "summary", title, description } };
}
export default async function TeamPage() {
  const members = await prisma.teamMember.findMany({ where: { published: true }, orderBy: [{ displayOrder: "asc" }, { name: "asc" }, { id: "asc" }], select: { slug: true, name: true, title: true, company: true, department: true, shortBio: true, photo: true, featured: true } });
  return <div className={styles.team}><header className={styles.directoryHero}><div className={styles.wrap}><p className={styles.kicker}>Our Team / BCU Group</p><h1>People with purpose.<span>Leadership with impact.</span></h1><p className={styles.lead}>Meet the people bringing our shared ambition to life. Different expertise. One commitment to building institutions that move Africa forward.</p></div></header><section className={styles.directory}><div className={styles.wrap}><div className={styles.directoryHeading}><h2>The people behind BCU.</h2><span>Leadership & expertise</span></div>{members.length ? <div className={styles.cards}>{members.map(m => <article key={m.slug} className={styles.card}><Link href={`/team/${m.slug}`} className={styles.cardPhoto} aria-label={`View ${m.name}'s profile`}><Portrait photo={m.photo} name={m.name} />{m.featured && <span className={styles.badge}>Featured profile</span>}</Link><div className={styles.cardCopy}><h3>{m.name}</h3><p className={styles.cardTitle}>{m.title}</p>{(m.company || m.department) && <p>{[m.company, m.department].filter(Boolean).join(" / ")}</p>}{m.shortBio && <p>{m.shortBio}</p>}<Link href={`/team/${m.slug}`} className={styles.textLink}>View Profile <span aria-hidden="true">↗</span></Link></div></article>)}</div> : <p>Our team profiles are being prepared. Meet the organisations shaping our work in <Link href="/companies" className={styles.textLink}>Our Companies ↗</Link>.</p>}</div></section></div>;
}
