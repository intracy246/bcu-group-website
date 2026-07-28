"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: "⌂",
  },
  {
    label: "Companies",
    href: "/admin/companies",
    icon: "◈",
  },
  {
    label: "Projects",
    href: "/admin/projects",
    icon: "◆",
  },
  {
    label: "News",
    href: "/admin/news",
    icon: "◫",
  },
  {
    label: "Careers",
    href: "/admin/careers",
    icon: "◎",
  },
  {
    label: "Messages",
    href: "/admin/messages",
    icon: "✉",
  },
  {
    label: "Media Library",
    href: "/admin/media",
    icon: "▣",
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: "◉",
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: "⚙",
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__brand">
        <Link href="/admin">
          <span className="admin-sidebar__brand-symbol">B</span>

          <div>
            <strong>BCU ADMIN</strong>
            <small>Group Management System</small>
          </div>
        </Link>
      </div>

      <nav className="admin-sidebar__navigation">
        <p>Management</p>

        {navigation.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                isActive
                  ? "admin-sidebar__link admin-sidebar__link--active"
                  : "admin-sidebar__link"
              }
            >
              <span>{item.icon}</span>
              <strong>{item.label}</strong>
            </Link>
          );
        })}
      </nav>

      <div className="admin-sidebar__footer">
        <div>
          <span>System Status</span>
          <strong>
            <i />
            Operational
          </strong>
        </div>

        <Link href="/">View Public Website ↗</Link>
      </div>
    </aside>
  );
}