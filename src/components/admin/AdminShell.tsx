import type { ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

type AdminShellProps = {
  children: ReactNode;
};

export default function AdminShell({
  children,
}: AdminShellProps) {
  return (
    <div className="admin-shell">
      <AdminSidebar />

      <div className="admin-shell__main">
        <AdminTopbar />

        <main className="admin-shell__content">
          {children}
        </main>
      </div>
    </div>
  );
}