import CompaniesManager from "@/components/admin/CompaniesManager";
import { companies } from "@/data/companies";

export default function AdminCompaniesPage() {
  return <CompaniesManager companies={companies} />;
}