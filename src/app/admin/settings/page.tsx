import AdminModulePage from "@/components/admin/AdminModulePage";
import { requireUser } from "@/lib/auth";
export default async function Page() { await requireUser(["SUPER_ADMIN", "ADMIN"]); return <AdminModulePage eyebrow="Configuration" title="Site settings" description="Manage contact, SEO, header, footer, email and storage settings." />; }
