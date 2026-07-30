import NewsManager from "@/components/admin/NewsManager";
import { listAdminNews } from "@/lib/news-service";

export default async function AdminNewsPage() {
  return <NewsManager initialArticles={await listAdminNews()} />;
}
