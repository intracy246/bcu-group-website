import AdminModulePage from "@/components/admin/AdminModulePage";
export default function Page() { return <AdminModulePage eyebrow="Careers" title="Career opportunities" description="Create and manage vacancies and applications." actions={[{ label: "Post a vacancy", href: "/admin/careers/new" }]} />; }
