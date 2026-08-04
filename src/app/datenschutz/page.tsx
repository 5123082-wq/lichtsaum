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
  const title = `Datenschutzerklärung | ${siteConfig.name}`;
  const description = `Informationen zur Verarbeitung personenbezogener Daten auf der Website von ${siteConfig.name}.`;

  return {
    title,
    description,
    ...(isIndexable && siteUrl
      ? {
          alternates: { canonical: "/datenschutz" },
          openGraph: {
            type: "website" as const,
            locale: siteConfig.locale,
            siteName: siteConfig.name,
            title,
            description,
            url: "/datenschutz"
          }
        }
      : {
          robots: { index: false, follow: false, nocache: true }
        })
  };
}

export default function DatenschutzPage() {
  const { legal } = siteConfig;

  return (
    <>
      <a className="skip-link" href="#main-content">
        Zum Inhalt springen
      </a>
      <GlobalSiteHeader />
      <main className="legal-page" id="main-content">
        <header className="container legal-page__intro">
          <p className="eyebrow">Datenschutz</p>
          <h1>Datenschutz&shy;erklärung</h1>
          <p>
            Informationen zur Verarbeitung personenbezogener Daten auf dieser
            Website gemäß Datenschutz-Grundverordnung (DSGVO).
          </p>
        </header>

        <article className="container legal-document">
          <section aria-labelledby="allgemeine-hinweise">
            <h2 id="allgemeine-hinweise">1. Allgemeine Hinweise</h2>
            <p>
              Der Schutz personenbezogener Daten ist uns wichtig. Wir
              verarbeiten personenbezogene Daten vertraulich und entsprechend
              den geltenden Datenschutzvorschriften, insbesondere der DSGVO und
              dem Bundesdatenschutzgesetz (BDSG).
            </p>
            <p>
              Personenbezogene Daten sind alle Informationen, mit denen eine
              Person direkt oder indirekt identifiziert werden kann. Welche
              Daten auf dieser Website verarbeitet werden, richtet sich danach,
              welche Funktionen Sie nutzen.
            </p>
          </section>

          <section aria-labelledby="verantwortlicher">
            <h2 id="verantwortlicher">2. Verantwortlicher</h2>
            <address>
              <strong>{legal.providerName}</strong>
              <span>{legal.street}</span>
              <span>
                {legal.postalCode} {legal.city}
              </span>
              <span>{legal.country}</span>
              <span>
                E-Mail: <a href={`mailto:${legal.email}`}>{legal.email}</a>
              </span>
            </address>
            <p>{legal.brandRelationship}</p>
            <LegalReviewTodo item="dataProtectionOfficer" />
          </section>

          <section aria-labelledby="zwecke-rechtsgrundlagen">
            <h2 id="zwecke-rechtsgrundlagen">
              3. Zwecke und Rechtsgrundlagen
            </h2>
            <p>
              Wir verarbeiten personenbezogene Daten, um die Website technisch
              bereitzustellen und abzusichern, Anfragen zu beantworten,
              vorvertragliche Schritte durchzuführen und gesetzliche Pflichten
              zu erfüllen. Je nach Verarbeitung stützen wir uns auf Art. 6 Abs.
              1 lit. b, c oder f DSGVO. Soweit künftig eine Einwilligung
              erforderlich ist, erfolgt die Verarbeitung auf Grundlage von Art.
              6 Abs. 1 lit. a DSGVO.
            </p>
          </section>

          <section aria-labelledby="server-logfiles">
            <h2 id="server-logfiles">4. Bereitstellung und Server-Logfiles</h2>
            <p>
              Beim Aufruf der Website werden technisch erforderliche
              Verbindungsdaten verarbeitet. Dazu können IP-Adresse, Datum und
              Uhrzeit, aufgerufene URL, Referrer-URL, übertragene Datenmenge,
              Browserinformationen und User-Agent gehören. Die Verarbeitung ist
              erforderlich, um Inhalte auszuliefern, Stabilität und Sicherheit
              zu gewährleisten und Missbrauch abzuwehren. Rechtsgrundlage ist
              Art. 6 Abs. 1 lit. f DSGVO.
            </p>
            <LegalReviewTodo item="hostingAndLogs" />
          </section>

          <section aria-labelledby="speichertechnologien">
            <h2 id="speichertechnologien">
              5. Cookies und ähnliche Technologien
            </h2>
            <p>
              Im aktuellen Prototyp setzen wir keine Cookies, Analyse- oder
              Marketingtechnologien ein. Google Analytics, Google Ads, ein
              Tag-Manager und externe Medien sind nicht eingebunden.
            </p>
            <p>
              Der Mini-Konfigurator speichert seine aktuelle Konfiguration –
              zum Beispiel Beschriftung, Maße, Farben und Gestaltungswahl – im
              <code>sessionStorage</code> Ihres Browsers. Diese Daten bleiben auf
              Ihrem Gerät, werden nicht an uns übertragen und werden in der
              Regel beim Beenden der Browser-Sitzung gelöscht. Die Speicherung
              dient ausschließlich dazu, die von Ihnen ausdrücklich genutzte
              Konfiguratorfunktion innerhalb der Sitzung bereitzustellen. Sie
              wird ausschließlich im Browser gespeichert.
            </p>
            <LegalReviewTodo item="sessionStorage" />
            <LegalReviewTodo item="optionalTechnologies" />
          </section>

          <section aria-labelledby="projektanfragen">
            <h2 id="projektanfragen">6. Kontakt- und Projektanfragen</h2>
            <p>
              Wenn Sie uns per E-Mail oder Telefon kontaktieren, verarbeiten wir
              die von Ihnen übermittelten Kontaktdaten und Inhalte, um Ihre
              Anfrage zu beantworten und erforderliche Anschlussfragen zu
              klären. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit es
              um vorvertragliche Maßnahmen geht, andernfalls Art. 6 Abs. 1 lit.
              f DSGVO.
            </p>
            <p>
              Das Projektformular ist derzeit eine Prototypfunktion. Bei einer
              Testübermittlung verarbeitet der Anwendungsserver die eingegebene
              E-Mail-Adresse sowie optional Telefonnummer, Nachricht und
              ausgewählte Dateien vorübergehend, um Format- und Größenregeln zu
              prüfen. Die Angaben werden nicht dauerhaft gespeichert, nicht als
              Anfrage angenommen und nicht an Dritte weitergegeben. Lokale
              Bildvorschauen werden zusätzlich nur im Browser erzeugt und beim
              Entfernen der Datei oder Verlassen der Seite verworfen.
            </p>
            <LegalReviewTodo item="contactProviders" />
            <LegalReviewTodo item="productionFormAndFiles" />
          </section>

          <section aria-labelledby="empfaenger">
            <h2 id="empfaenger">
              7. Empfänger und Auftragsverarbeitung
            </h2>
            <p>
              Personenbezogene Daten geben wir nur weiter, wenn dies zur
              Erfüllung der genannten Zwecke erforderlich ist, eine gesetzliche
              Pflicht besteht oder Sie eingewilligt haben. Technische
              Dienstleister dürfen Daten nur auf Grundlage geeigneter
              vertraglicher und datenschutzrechtlicher Vereinbarungen,
              insbesondere eines Vertrags nach Art. 28 DSGVO, verarbeiten.
            </p>
            <p>
              Im aktuellen Prototyp werden keine Formularinhalte an CRM-,
              Analyse-, Werbe-, Chat- oder KI-Dienste übermittelt. Eine
              Übermittlung in Drittländer findet über diese Website derzeit
              nicht statt.
            </p>
            <LegalReviewTodo item="recipientsAndTransfers" />
            <LegalReviewTodo item="automatedDecisionMaking" />
          </section>

          <section aria-labelledby="speicherdauer">
            <h2 id="speicherdauer">8. Speicherdauer</h2>
            <p>
              Wir speichern personenbezogene Daten nur so lange, wie es für den
              jeweiligen Zweck erforderlich ist oder gesetzliche
              Aufbewahrungspflichten bestehen. Testeingaben des aktuellen
              Projektformulars werden nicht persistent gespeichert. Daten aus
              direkten E-Mail- oder Telefonanfragen werden gelöscht, sobald die
              Anfrage abschließend bearbeitet ist und keine gesetzlichen oder
              berechtigten Gründe für eine weitere Aufbewahrung bestehen.
            </p>
            <LegalReviewTodo item="retentionPeriods" />
          </section>

          <section aria-labelledby="betroffenenrechte">
            <h2 id="betroffenenrechte">9. Ihre Rechte</h2>
            <p>Unter den gesetzlichen Voraussetzungen haben Sie das Recht auf:</p>
            <ul>
              <li>Auskunft über Ihre verarbeiteten Daten (Art. 15 DSGVO),</li>
              <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO),</li>
              <li>Löschung Ihrer Daten (Art. 17 DSGVO),</li>
              <li>Einschränkung der Verarbeitung (Art. 18 DSGVO),</li>
              <li>Datenübertragbarkeit (Art. 20 DSGVO) und</li>
              <li>Widerspruch gegen bestimmte Verarbeitungen (Art. 21 DSGVO).</li>
            </ul>
            <p>
              Eine erteilte Einwilligung können Sie jederzeit mit Wirkung für
              die Zukunft widerrufen. Zur Ausübung Ihrer Rechte genügt eine
              Nachricht an <a href={`mailto:${legal.email}`}>{legal.email}</a>.
            </p>
            <LegalReviewTodo item="rightToObject" />
          </section>

          <section aria-labelledby="beschwerderecht">
            <h2 id="beschwerderecht">10. Beschwerderecht</h2>
            <p>
              Sie haben das Recht, sich bei einer Datenschutzaufsichtsbehörde zu
              beschweren. Für den Verantwortlichen ist insbesondere folgende
              Behörde zuständig:
            </p>
            <address>
              <strong>
                Berliner Beauftragte für Datenschutz und Informationsfreiheit
              </strong>
              <span>Alt-Moabit 59–61</span>
              <span>10555 Berlin</span>
              <span>
                E-Mail:{" "}
                <a href="mailto:mailbox@datenschutz-berlin.de">
                  mailbox@datenschutz-berlin.de
                </a>
              </span>
              <span>
                Website:{" "}
                <a
                  href="https://www.datenschutz-berlin.de/"
                  rel="noreferrer"
                  target="_blank"
                >
                  www.datenschutz-berlin.de
                </a>
              </span>
            </address>
          </section>

          <section aria-labelledby="datensicherheit">
            <h2 id="datensicherheit">11. Datensicherheit</h2>
            <p>
              Wir setzen angemessene technische und organisatorische Maßnahmen
              ein, um personenbezogene Daten vor Verlust, Manipulation und
              unberechtigtem Zugriff zu schützen. Im öffentlichen Betrieb wird
              die Übertragung über TLS/SSL verschlüsselt.
            </p>
            <LegalReviewTodo item="transportSecurity" />
          </section>

          <section aria-labelledby="aktualisierung">
            <h2 id="aktualisierung">12. Aktualisierung</h2>
            <p>
              Wir aktualisieren diese Datenschutzerklärung, wenn technische,
              rechtliche oder organisatorische Änderungen dies erfordern. Es
              gilt die jeweils auf dieser Seite veröffentlichte Fassung.
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
