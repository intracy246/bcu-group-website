import type { Metadata } from "next";
import "./globals.css";
import SiteChrome from "@/components/layout/SiteChrome";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "BCU Group", template: "%s | BCU Group" },
  description:
    "Building communities. Creating opportunity.",
  openGraph: { type: "website", siteName: "BCU Group", title: "BCU Group", description: "Building communities. Creating opportunity." },
  twitter: { card: "summary_large_image", title: "BCU Group", description: "Building communities. Creating opportunity." },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
