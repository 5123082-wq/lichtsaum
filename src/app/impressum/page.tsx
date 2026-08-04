import type { Metadata } from "next";
import Link from "next/link";

import { GlobalSiteHeader } from "@/components/layout/global-site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { isIndexable, siteUrl } from "@/config/environment";
import { siteConfig } from "@/config/site";
import {
  assertLegalReviewCompleteForProduction,
  LegalReviewTodo
} from "@/features/legal/legal-review-todo";

assertLegalReviewCompleteForProduction();

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
      : {
          robots: { index: false, follow: false, nocache: true }
        })
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
            <p>{legal.brandRelationship}</p>
            <address>
              <strong>{legal.providerName}</strong>
              <span>{legal.street}</span>
              <span>
                {legal.postalCode} {legal.city}
              </span>
              <span>{legal.country}</span>
            </address>
            <LegalReviewTodo item="providerDesignation" />
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
            <LegalReviewTodo item="registerDetails" />
            <LegalReviewTodo item="regulatedActivity" />
          </section>

          <section aria-labelledby="streitbeilegung">
            <h2 id="streitbeilegung">Verbraucherstreitbeilegung</h2>
            <p>
              Wir sind nicht bereit oder verpflichtet, an
              Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
            <LegalReviewTodo item="disputeResolution" />
          </section>

          <section aria-labelledby="inhalte">
            <h2 id="inhalte">Haftung für Inhalte</h2>
            <p>
              Als Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten
              nach den allgemeinen Gesetzen verantwortlich. Eine Verpflichtung
              zur Überwachung übermittelter oder gespeicherter fremder
              Informationen oder zur Nachforschung nach Umständen, die auf eine
              rechtswidrige Tätigkeit hinweisen, besteht nicht, soweit
              gesetzlich nichts anderes gilt.
            </p>
            <p>
              Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
              Informationen nach den allgemeinen Gesetzen bleiben hiervon
              unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem
              Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich.
              Bei Bekanntwerden entsprechender Rechtsverletzungen werden wir
              diese Inhalte umgehend entfernen.
            </p>
          </section>

          <section aria-labelledby="links">
            <h2 id="links">Haftung für Links</h2>
            <p>
              Unser Angebot kann Links zu externen Websites Dritter enthalten,
              auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir
              für diese fremden Inhalte keine Gewähr übernehmen. Für die Inhalte
              der verlinkten Seiten ist stets der jeweilige Anbieter oder
              Betreiber verantwortlich. Die verlinkten Seiten werden zum
              Zeitpunkt der Verlinkung auf erkennbare Rechtsverstöße geprüft.
            </p>
            <p>
              Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist
              ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar.
              Bei Bekanntwerden von Rechtsverletzungen werden wir derartige
              Links umgehend entfernen.
            </p>
          </section>

          <section aria-labelledby="urheberrecht">
            <h2 id="urheberrecht">Urheberrecht</h2>
            <p>
              Die durch den Seitenbetreiber erstellten Inhalte und Werke auf
              diesen Seiten unterliegen dem deutschen Urheberrecht. Die
              Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
              Verwertung außerhalb der Grenzen des Urheberrechts bedürfen der
              schriftlichen Zustimmung des jeweiligen Autors beziehungsweise
              Erstellers. Downloads und Kopien dieser Seite sind nur für den
              privaten, nicht kommerziellen Gebrauch gestattet.
            </p>
            <p>
              Soweit Inhalte nicht vom Betreiber erstellt wurden, werden die
              Urheberrechte Dritter beachtet und solche Inhalte entsprechend
              gekennzeichnet. Sollten Sie auf eine Urheberrechtsverletzung
              aufmerksam werden, bitten wir um einen Hinweis. Bei Bekanntwerden
              von Rechtsverletzungen werden wir derartige Inhalte umgehend
              entfernen.
            </p>
            <LegalReviewTodo item="editorialResponsibility" />
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
