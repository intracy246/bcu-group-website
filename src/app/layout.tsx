import type { Metadata } from "next";
import "./globals.css";
import SiteChrome from "@/components/layout/SiteChrome";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { getPublicSiteSettings } from "@/lib/site-settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSiteSettings();
  const googleVerification = process.env.GOOGLE_SITE_VERIFICATION?.trim();

  return {
    metadataBase: new URL(settings.publicWebsiteUrl),
    title: { default: settings.defaultSeoTitle, template: `%s | ${settings.siteName}` },
    description: settings.defaultSeoDescription,
    ...(googleVerification ? { verification: { google: googleVerification } } : {}),
    openGraph: {
      type: "website",
      siteName: settings.siteName,
      title: settings.defaultSeoTitle,
      description: settings.defaultSeoDescription,
      images: settings.defaultOpenGraphImage ? [settings.defaultOpenGraphImage] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: settings.defaultSeoTitle,
      description: settings.defaultSeoDescription,
      images: settings.defaultOpenGraphImage ? [settings.defaultOpenGraphImage] : [],
    },
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
        <GoogleAnalytics />
        <SiteChrome settings={settings}>{children}</SiteChrome>
      </body>
    </html>
  );
}
