import{notFound}from"next/navigation";import CompanyForm from"@/components/admin/CompanyForm";import{getAdminCompany}from"@/lib/company-service";
export default async function Page({params}:{params:Promise<{id:string}>}){const company=await getAdminCompany((await params).id);if(!company)notFound();return <CompanyForm company={company}/>;}
