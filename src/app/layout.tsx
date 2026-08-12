import "@fontsource-variable/caveat/wght.css";
import "@fontsource-variable/hanken-grotesk/wght.css";
import "@fontsource-variable/jetbrains-mono/wght.css";

import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import {
  assertGoogleTagsConfigurationValidForProduction,
  assertLeadIntakeConfigurationValidForProduction,
  consentUiEnabled,
  googleTagManagerId,
  googleTagsEnabled,
  isIndexable,
  isProductionDeployment,
  isPreviewDeployment,
  siteUrl
} from "@/config/environment";
import { siteConfig } from "@/config/site";
import { SiteStructuredData } from "@/components/seo/site-structured-data";
import { GoogleTagBoundary } from "@/features/analytics/google-tag-boundary";
import { ConsentManager } from "@/features/consent/consent-manager";

import "./globals.css";

const socialPreviewImage = {
  url: "/brand/lichtsaum-og-1200x630.png",
  width: 1200,
  height: 630,
  alt: "LICHTSAUM — Markise wird Markenlicht."
} as const;

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
          url: "/",
          images: [socialPreviewImage]
        },
        twitter: {
          card: "summary_large_image",
          title: siteConfig.title,
          description: siteConfig.description,
          images: [
            {
              url: socialPreviewImage.url,
              alt: socialPreviewImage.alt
            }
          ]
        }
      }
    : {}),
  ...(!isIndexable && (isPreviewDeployment || isProductionDeployment)
      ? {
          robots: {
            index: false,
            follow: false,
            nocache: true,
            googleBot: {
              index: false,
              follow: false,
              noimageindex: true
            }
          }
        }
      : {})
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#131313",
  colorScheme: "dark"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  assertGoogleTagsConfigurationValidForProduction();
  assertLeadIntakeConfigurationValidForProduction();

  return (
    <html data-scroll-behavior="smooth" lang={siteConfig.language}>
      <body>
        {googleTagsEnabled && googleTagManagerId ? (
          <GoogleTagBoundary containerId={googleTagManagerId} />
        ) : null}
        <SiteStructuredData />
        {children}
        {consentUiEnabled ? <ConsentManager /> : null}
      </body>
    </html>
  );
}
