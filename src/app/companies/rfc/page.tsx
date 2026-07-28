import { notFound } from "next/navigation";
import CompanyProfilePage from "@/components/companies/CompanyProfilePage";
import { getCompanyBySlug } from "@/data/companies";

export default function RFCPage() {
  const company = getCompanyBySlug("rfc");

  if (!company) {
    notFound();
  }

  return <CompanyProfilePage company={company} />;
}