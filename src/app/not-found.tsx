import type { Metadata } from "next";
import Link from "next/link";

import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Seite nicht gefunden | ${siteConfig.name}`,
  description: "Die angeforderte Seite ist nicht verfügbar.",
  alternates: { canonical: null },
  openGraph: null,
  twitter: null,
  robots: {
    index: false,
    follow: false,
    nocache: true
  }
};

export default function NotFoundPage() {
  return (
    <main className="plain-page">
      <p className="eyebrow">404</p>
      <h1>Diese Seite gibt es nicht.</h1>
      <p>Die angeforderte Seite ist nicht verfügbar.</p>
      <Link className="button button--primary" href="/">
        Zur Startseite
      </Link>
    </main>
  );
}
