import { notFound } from "next/navigation";
import CompanyProfilePage from "@/components/companies/CompanyProfilePage";
import { getCompanyBySlug } from "@/data/companies";

export default function SmartCyclePage() {
  const company = getCompanyBySlug("smartcycle");

  if (!company) {
    notFound();
  }

  return <CompanyProfilePage company={company} />;
}