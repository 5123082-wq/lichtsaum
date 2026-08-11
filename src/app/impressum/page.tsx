import type { Metadata } from "next";
import Link from "next/link";

import { GlobalSiteHeader } from "@/components/layout/global-site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import {
  isIndexable,
  isPreviewDeployment,
  siteUrl
} from "@/config/environment";
import { siteConfig } from "@/config/site";

export function generateMetadata(): Metadata {
  const title = `Impressum | ${siteConfig.name}`;
  const description = `Anbieterkennzeichnung und Kontaktangaben für ${siteConfig.name}.`;

  return {
    title,
    description,
    ...(isIndexable && siteUrl
      ? {
          alternates: { canonical: "/impressum" },
          openGraph: {
            type: "website" as const,
            locale: siteConfig.locale,
            siteName: siteConfig.name,
            title,
            description,
            url: "/impressum"
          }
        }
      : isPreviewDeployment
        ? { robots: { index: false, follow: false, nocache: true } }
        : {})
  };
}

export default function ImpressumPage() {
  const { legal } = siteConfig;

  return (
    <>
      <a className="skip-link" href="#main-content">
        Zum Inhalt springen
      </a>
      <GlobalSiteHeader />
      <main className="legal-page" id="main-content">
        <header className="container legal-page__intro">
          <p className="eyebrow">Anbieterkennzeichnung</p>
          <h1>Impressum</h1>
          <p>Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG).</p>
        </header>

        <article className="container legal-document">
          <section aria-labelledby="anbieter">
            <h2 id="anbieter">Anbieter</h2>
            <address>
              <strong>{legal.providerName}</strong>
              <span>{legal.street}</span>
              <span>
                {legal.postalCode} {legal.city}
              </span>
              <span>{legal.country}</span>
            </address>
          </section>

          <section aria-labelledby="kontakt">
            <h2 id="kontakt">Kontakt</h2>
            <dl className="legal-contact-list">
              <div>
                <dt>Telefon</dt>
                <dd>
                  {legal.phones.map((phone, index) => (
                    <span key={phone.href}>
                      <a href={phone.href}>{phone.label}</a>
                      {index < legal.phones.length - 1 ? <br /> : null}
                    </span>
                  ))}
                </dd>
              </div>
              <div>
                <dt>E-Mail</dt>
                <dd>
                  <a href={`mailto:${legal.email}`}>{legal.email}</a>
                </dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="umsatzsteuer">
            <h2 id="umsatzsteuer">Umsatzsteuer-ID</h2>
            <p>
              Umsatzsteuer-Identifikationsnummer gemäß § 27a
              Umsatzsteuergesetz: {legal.vatId}
            </p>
          </section>

          <Link className="legal-document__back" href="/">
            Zurück zur Startseite
          </Link>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
