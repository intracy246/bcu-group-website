import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { companies } from "../src/data/companies";
import { newsArticles } from "../src/data/news";
import { jobOpenings } from "../src/data/careers";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword || adminPassword.length < 12) {
    throw new Error("ADMIN_EMAIL and a secure ADMIN_PASSWORD (12+ characters) are required.");
  }
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { name: process.env.ADMIN_NAME || "BCU Administrator", status: "ACTIVE" },
    create: { name: process.env.ADMIN_NAME || "BCU Administrator", email: adminEmail, passwordHash: await bcrypt.hash(adminPassword, 12), role: "SUPER_ADMIN" },
  });

  const bcu = await prisma.company.upsert({
    where: { slug: "bcu-group" }, update: {},
    create: { name: "BCU Group", shortName: "BCU", slug: "bcu-group", summary: "A diversified African corporate group.", description: "Beneficium Communis Universitas builds companies, technologies and partnerships for sustainable African development.", status: "ACTIVE", featured: true, sortOrder: 0 },
  });

  const companyIds = new Map<string, string>([["BCU Group", bcu.id]]);
  for (const [index, company] of companies.entries()) {
    const saved = await prisma.company.upsert({
      where: { slug: company.slug },
      update: { name: company.name, summary: company.tagline, description: company.description, logoUrl: company.logo },
      create: { id: company.id, name: company.name, slug: company.slug, shortName: company.shortName, summary: company.tagline, description: company.description, logoUrl: company.logo, industry: company.sectors.join(", "), status: "ACTIVE", featured: true, sortOrder: index + 1 },
    });
    companyIds.set(company.name, saved.id);
    for (const [projectIndex, project] of company.projects.entries()) {
      await prisma.project.upsert({
        where: { slug: `${company.slug}-${project.slug}` },
        update: {},
        create: { id: project.id, title: project.name, slug: `${company.slug}-${project.slug}`, summary: project.summary, description: { paragraphs: [project.description] }, companyId: saved.id, category: project.category, status: "PUBLISHED", featured: project.featured, tags: project.tags, sortOrder: projectIndex },
      });
    }
  }

  for (const article of newsArticles) {
    await prisma.newsArticle.upsert({
      where: { slug: article.slug }, update: {},
      create: { id: article.id, title: article.title, slug: article.slug, excerpt: article.excerpt, content: { paragraphs: article.content }, category: article.category, companyId: companyIds.get(article.company), status: article.status.toUpperCase() as "DRAFT" | "PUBLISHED" | "ARCHIVED", featured: article.featured, coverImage: article.coverImage, coverImageAlt: article.coverImageAlt, author: article.author, publishedAt: new Date(article.publishedAt), readingTime: Number.parseInt(article.readingTime, 10) || 1, tags: article.tags },
    });
  }

  for (const job of jobOpenings) {
    await prisma.career.upsert({
      where: { slug: job.slug }, update: {},
      create: { id: job.id, title: job.title, slug: job.slug, companyId: companyIds.get(job.company) ?? bcu.id, department: job.department, location: job.location, employmentType: job.employmentType, workMode: job.workMode, summary: job.summary, description: { paragraphs: job.description }, responsibilities: job.responsibilities, requirements: [...job.requirements, ...job.preferredQualifications], benefits: job.benefits, applicationDeadline: new Date(job.applicationDeadline), status: job.status === "Open" ? "OPEN" : "CLOSED", featured: job.featured },
    });
  }

  for (const [key, value] of Object.entries({
    siteName: "BCU Group", siteDescription: "Building institutions that move Africa forward.",
    mainEmail: "info@bcugroup.com", mainPhone: "", officeAddress: "Dar es Salaam, Tanzania",
    publicWebsiteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    socialLinks: {}, header: {}, footer: {}, defaultSeoTitle: "BCU Group",
    defaultSeoDescription: "Building institutions that move Africa forward.",
    contactNotificationEmail: process.env.CONTACT_NOTIFICATION_EMAIL || "",
    careerNotificationEmail: process.env.CAREER_NOTIFICATION_EMAIL || "", maintenanceMode: false,
  })) await prisma.siteSetting.upsert({ where: { key }, update: { value }, create: { key, value } });

  for (const page of [
    { key: "home", title: "Home", slug: "/" }, { key: "about", title: "About", slug: "/about" },
    { key: "impact", title: "Impact", slug: "/impact" }, { key: "contact", title: "Contact", slug: "/contact" },
  ]) {
    const saved = await prisma.sitePage.upsert({ where: { key: page.key }, update: {}, create: page });
    await prisma.pageSection.upsert({
      where: { pageId_key: { pageId: saved.id, key: "hero" } }, update: {},
      create: { pageId: saved.id, key: "hero", type: "hero", content: { heading: page.title, body: "" }, visible: true, sortOrder: 0 },
    });
  }
}

main().finally(() => prisma.$disconnect());
