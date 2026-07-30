import AdminModulePage from "@/components/admin/AdminModulePage";
import { requireUser } from "@/lib/auth";
export default async function Page() { await requireUser(["SUPER_ADMIN"]); return <AdminModulePage eyebrow="Security" title="Administrators" description="Manage administrator roles, status and credentials." />; }
