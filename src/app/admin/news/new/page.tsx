import NewsForm from "@/components/admin/NewsForm";
import { prisma } from "@/lib/prisma";

export default async function AddNewsPage() {
  const companies = await prisma.company.findMany({ where: { status: "ACTIVE" }, select: { id: true, name: true }, orderBy: { sortOrder: "asc" } });
  return <NewsForm mode="create" companies={companies} />;
}
