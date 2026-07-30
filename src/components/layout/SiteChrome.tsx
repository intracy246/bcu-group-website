"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import type { PublicSiteSettings } from "@/lib/site-settings";

type SiteChromeProps = {
  children: ReactNode;
  settings: PublicSiteSettings;
};

export default function SiteChrome({
  children,
  settings,
}: SiteChromeProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar settings={settings} />
      {children}
      <Footer settings={settings} />
    </>
  );
}
