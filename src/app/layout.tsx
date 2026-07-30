import type { Metadata } from "next";
import "./globals.css";
import SiteChrome from "@/components/layout/SiteChrome";
import { getPublicSiteSettings } from "@/lib/site-settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSiteSettings();
  return {
    metadataBase: new URL(settings.publicWebsiteUrl),
    title: { default: settings.defaultSeoTitle, template: `%s | ${settings.siteName}` },
    description: settings.defaultSeoDescription,
    openGraph: { type: "website", siteName: settings.siteName, title: settings.defaultSeoTitle, description: settings.defaultSeoDescription, images: settings.defaultOpenGraphImage ? [settings.defaultOpenGraphImage] : [] },
    twitter: { card: "summary_large_image", title: settings.defaultSeoTitle, description: settings.defaultSeoDescription, images: settings.defaultOpenGraphImage ? [settings.defaultOpenGraphImage] : [] },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getPublicSiteSettings();
  return (
    <html lang="en">
      <body>
        <SiteChrome settings={settings}>{children}</SiteChrome>
      </body>
    </html>
  );
}
