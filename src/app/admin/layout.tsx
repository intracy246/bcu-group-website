import type { ReactNode } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { requireUser } from "@/lib/auth";

export const metadata = { robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({
  children,
}: AdminLayoutProps) {
  await requireUser();
  return <AdminShell>{children}</AdminShell>;
}
