import type { Metadata } from "next";

import { isIndexable, siteUrl } from "@/config/environment";
import { ProductEditorialPage } from "@/features/product-prototype/editorial-page";
import { siteConfig } from "@/config/site";

const socialPreviewImage = {
  url: "/brand/lichtsaum-og-1200x630.png",
  width: 1200,
  height: 630,
  alt: "LICHTSAUM — Markise wird Markenlicht."
} as const;

export function generateMetadata(): Metadata {
  const title = `Leuchtvolant für Markisen: Stoff, Form & Licht | ${siteConfig.name}`;
  const description = "Leuchtvolant für bestehende Gewerbemarkisen: Stoff, Farbe, Form und Lichtwirkung entdecken. Gestaltung ansehen und Ihr Projekt besprechen.";
  const canonicalUrl = isIndexable && siteUrl
    ? new URL("/produkt", siteUrl).toString()
    : null;

  return {
    title,
    description,
    ...(canonicalUrl
      ? {
          alternates: { canonical: canonicalUrl },
          openGraph: {
            type: "website" as const,
            locale: siteConfig.locale,
            siteName: siteConfig.name,
            title,
            description,
            url: canonicalUrl,
            images: [socialPreviewImage]
          },
          twitter: {
            card: "summary_large_image" as const,
            title,
            description,
            images: [{
              url: socialPreviewImage.url,
              alt: socialPreviewImage.alt
            }]
          },
          robots: { index: true, follow: true }
        }
      : {
          alternates: { canonical: null },
          openGraph: null,
          twitter: null,
          robots: { index: false, follow: false, nocache: true }
        })
  };
}

export default function ProductPage() {
  return <ProductEditorialPage />;
}
