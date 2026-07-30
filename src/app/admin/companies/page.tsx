import CompaniesManager from "@/components/admin/CompaniesManager";
import { listAdminCompanies } from "@/lib/company-service";

export default async function AdminCompaniesPage() {
  return <CompaniesManager initialCompanies={await listAdminCompanies()} />;
}
