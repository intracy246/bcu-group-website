"use client";

import Script from "next/script";

const measurementId = process.env.NEXT_PUBLIC_GA_ID?.trim();
const isValidMeasurementId = /^G-[A-Z0-9]+$/i.test(measurementId ?? "");

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export default function GoogleAnalytics() {
  if (!isValidMeasurementId || !measurementId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          window.gtag = function(){window.dataLayer?.push(arguments);};
          window.gtag('js', new Date());
          window.gtag('config', '${measurementId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
