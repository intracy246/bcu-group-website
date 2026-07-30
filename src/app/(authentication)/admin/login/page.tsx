import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import LoginForm from "@/components/admin/LoginForm";

export const metadata = { title: "Admin sign in | BCU Group", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await getSessionUser()) redirect("/admin");
  return <main className="admin-login"><section className="admin-login__card"><p>BCU Group</p><h1>Admin sign in</h1><span>Use your authorised administrator account.</span><LoginForm /></section></main>;
}
