"use client";

import { usePathname } from "next/navigation";

const titles: Record<string, string> = {
  "/admin": "Dashboard Overview",
  "/admin/companies": "Companies Management",
  "/admin/projects": "Projects Management",
  "/admin/news": "News Management",
  "/admin/careers": "Careers Management",
  "/admin/messages": "Contact Messages",
  "/admin/media": "Media Library",
  "/admin/users": "Users and Permissions",
  "/admin/settings": "System Settings",
};

export default function AdminTopbar() {
  const pathname = usePathname();

  const title =
    titles[pathname] ??
    Object.entries(titles).find(
      ([route]) =>
        route !== "/admin" && pathname.startsWith(route)
    )?.[1] ??
    "BCU Administration";

  return (
    <header className="admin-topbar">
      <div>
        <p>BCU Group Administration</p>
        <h1>{title}</h1>
      </div>

      <div className="admin-topbar__actions">
        <button
          type="button"
          className="admin-topbar__icon-button"
          aria-label="Search"
        >
          ⌕
        </button>

        <button
          type="button"
          className="admin-topbar__icon-button"
          aria-label="Notifications"
        >
          ◌
          <span />
        </button>

        <button
          type="button"
          className="admin-topbar__profile"
        >
          <span>WM</span>

          <div>
            <strong>Winslet Makweta</strong>
            <small>Super Administrator</small>
          </div>

          <i>⌄</i>
        </button>
      </div>
    </header>
  );
}