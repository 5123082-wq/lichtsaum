import "@fontsource-variable/caveat/wght.css";
import "@fontsource-variable/hanken-grotesk/wght.css";
import "@fontsource-variable/jetbrains-mono/wght.css";

import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { isIndexable, siteUrl } from "@/config/environment";
import { siteConfig } from "@/config/site";

import "./globals.css";

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  ...(isIndexable && siteUrl
    ? {
        metadataBase: new URL(siteUrl),
        alternates: { canonical: "/" },
        openGraph: {
          type: "website",
          locale: siteConfig.locale,
          siteName: siteConfig.name,
          title: siteConfig.title,
          description: siteConfig.description,
          url: "/"
        }
      }
    : {}),
  robots: isIndexable
    ? { index: true, follow: true }
    : {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
          index: false,
          follow: false,
          noimageindex: true
        }
      }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#131313",
  colorScheme: "dark"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html data-scroll-behavior="smooth" lang={siteConfig.language}>
      <body>{children}</body>
    </html>
  );
}
