import type { Metadata } from "next";
import Link from "next/link";

import { EuropeContactAtlas } from "@/components/contact/europe-contact-atlas";
import { GlobalSiteHeader } from "@/components/layout/global-site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import {
  isIndexable,
  isPreviewDeployment,
  siteUrl
} from "@/config/environment";
import { siteConfig } from "@/config/site";

export function generateMetadata(): Metadata {
  const title = `Kontakt | ${siteConfig.name}`;
  const description = `Kontakt und Einstieg in die Projektanfrage für ${siteConfig.name}.`;

  return {
    title,
    description,
    ...(isIndexable && siteUrl
      ? {
          alternates: { canonical: "/kontakt" },
          openGraph: {
            type: "website" as const,
            locale: siteConfig.locale,
            siteName: siteConfig.name,
            title,
            description,
            url: "/kontakt"
          },
          twitter: {
            card: "summary_large_image" as const,
            title,
            description,
            images: [
              {
                url: "/brand/lichtsaum-og-1200x630.png",
                alt: "LICHTSAUM — Markise wird Markenlicht."
              }
            ]
          }
        }
      : isPreviewDeployment
        ? { robots: { index: false, follow: false, nocache: true } }
        : {})
  };
}

export default function KontaktPage() {
  const { legal } = siteConfig;

  return (
    <>
      <a className="skip-link" href="#main-content">
        Zum Inhalt springen
      </a>
      <GlobalSiteHeader />
      <main className="contact-page" id="main-content">
        <section className="contact-hero" aria-labelledby="contact-title">
          <EuropeContactAtlas />

          <div className="container contact-hero__inner">
            <header className="contact-hero__intro">
              <p className="eyebrow">Kontakt / Berlin</p>
              <h1 id="contact-title">Kontakt</h1>
              <p>
                Berlin ist unser Ausgangspunkt. Für Fragen zu einer bestehenden
                Gewerbemarkise oder zum Projekt-Check erreichen Sie uns direkt.
              </p>
            </header>

            <dl className="contact-channels">
              <div>
                <dt>E-Mail</dt>
                <dd>
                  <a href={`mailto:${legal.email}`}>{legal.email}</a>
                </dd>
              </div>
              <div>
                <dt>Telefon</dt>
                <dd>
                  {legal.phones.map((phone) => (
                    <a href={phone.href} key={phone.href}>
                      {phone.label}
                    </a>
                  ))}
                </dd>
              </div>
            </dl>

            <div className="contact-hero__actions">
              <Link className="button button--primary" href="/#projekt-pruefen">
                Projekt prüfen lassen
              </Link>
            </div>

            <p className="contact-hero__map-source">
              Kartendaten / Natural Earth 1:10m
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
