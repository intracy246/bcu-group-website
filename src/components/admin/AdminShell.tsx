"use client";

import { useEffect, useState, type ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

type AdminShellProps = {
  children: ReactNode;
};

export default function AdminShell({
  children,
}: AdminShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setMenuOpen(false); };
    document.addEventListener("keydown", closeOnEscape);
    document.body.classList.add("admin-menu-open");
    return () => { document.removeEventListener("keydown", closeOnEscape); document.body.classList.remove("admin-menu-open"); };
  }, [menuOpen]);

  return (
    <div className={`admin-shell${menuOpen ? " admin-shell--menu-open" : ""}`}>
      <AdminSidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      {menuOpen && <button type="button" className="admin-sidebar__scrim" aria-label="Close navigation menu" onClick={() => setMenuOpen(false)} />}

      <div className="admin-shell__main">
        <AdminTopbar onMenuClick={() => setMenuOpen(true)} />

        <main className="admin-shell__content">
          {children}
        </main>
      </div>
    </div>
  );
}