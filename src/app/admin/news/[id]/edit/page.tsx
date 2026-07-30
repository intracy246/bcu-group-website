import { notFound } from "next/navigation";
import NewsForm from "@/components/admin/NewsForm";
import { getAdminNewsById } from "@/lib/news-service";
import { prisma } from "@/lib/prisma";

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const article = await getAdminNewsById((await params).id);
  if (!article) notFound();
  const companies = await prisma.company.findMany({ where: { status: "ACTIVE" }, select: { id: true, name: true }, orderBy: { sortOrder: "asc" } });
  return <NewsForm mode="edit" article={article} companies={companies} />;
}
