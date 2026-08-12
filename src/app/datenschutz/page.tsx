import type { Metadata } from "next";
import Link from "next/link";

import { GlobalSiteHeader } from "@/components/layout/global-site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import {
  acceptsProductionLeads,
  acceptsProductionLeadAttachments,
  isIndexable,
  isPreviewDeployment,
  siteUrl
} from "@/config/environment";
import { siteConfig } from "@/config/site";

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

export default function DatenschutzPage() {
  const { legal } = siteConfig;
  const leadIntakeEnabled = acceptsProductionLeads;
  const leadAttachmentsEnabled = acceptsProductionLeadAttachments;

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
          <section aria-labelledby="verantwortlicher">
            <h2 id="verantwortlicher">1. Verantwortlicher</h2>
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
          </section>

          <section aria-labelledby="server-logfiles">
            <h2 id="server-logfiles">2. Hosting und Server-Logfiles</h2>
            <p>
              Diese Website wird durch Vercel Inc. bereitgestellt; die
              Serverfunktionen sind der ausgewählten Region Frankfurt am Main
              zugeordnet. Beim Aufruf verarbeitet Vercel insbesondere
              IP-Adresse, Datum und Uhrzeit, aufgerufene URL,
              Referrer-URL, übertragene Datenmenge, Browserinformationen und
              User-Agent. Zweck ist die Auslieferung der Website sowie die
              Gewährleistung von Stabilität, Sicherheit und Missbrauchsschutz.
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes
              Interesse liegt im sicheren und funktionsfähigen Betrieb der
              Website. Die Runtime-Logs des eingesetzten Tarifs sind eine Stunde
              abrufbar. Die Anwendung schreibt keine Formularinhalte in diese
              Logs.
            </p>
          </section>

          <section aria-labelledby="speichertechnologien">
            <h2 id="speichertechnologien">
              3. Erforderliche Speichertechnologien
            </h2>
            <p>
              Wir speichern Ihre Auswahl zu Analytics und Marketing für 180
              Tage im technisch erforderlichen First-Party-Cookie{" "}
              <code>lichtsaum_consent</code>. Das Cookie enthält die Version
              der Einwilligungsregeln, den Zeitpunkt Ihrer Auswahl und Ihre
              getrennten Entscheidungen. Rechtsgrundlage für das Speichern ist
              § 25 Abs. 2 Nr. 2 TDDDG. Sie können die Auswahl jederzeit über
              „Cookie-Einstellungen“ im Footer ändern.
            </p>
            <p>
              Sobald Sie den Mini- oder vollständigen Konfigurator bedienen,
              speichert er den aktuellen Entwurf, insbesondere Beschriftung,
              Maße, Farben, Gestaltungswahl und ausgewählte Leistungen, im{" "}
              <code>sessionStorage</code> Ihres Browsers. Kontaktdaten,
              Postleitzahl und Dateien werden dort nicht gespeichert. Der
              Entwurf wird beim Beenden der Browser-Sitzung gelöscht. Die
              Speicherung ist erforderlich, um den ausdrücklich aufgerufenen
              Konfigurator bereitzustellen (§ 25 Abs. 2 Nr. 2 TDDDG).
            </p>
            <p>
              Im vollständigen Konfigurator werden die eingegebenen
              Gestaltungswerte vorübergehend an unseren Anwendungsserver
              übertragen, damit Schriftmaße, Geometrie und der angezeigte
              vorläufige Nettopreis serverseitig berechnet werden können. Diese
              Berechnungsanfrage wird von der Anwendung nicht dauerhaft
              gespeichert, löst keine Projektanfrage aus und wird nicht an
              Analyse- oder Werbedienste übermittelt.
            </p>
          </section>

          <section aria-labelledby="google-dienste">
            <h2 id="google-dienste">4. Google Tag Manager, Analytics und Ads</h2>
            <p>
              Wir verwenden den Google Tag Manager, Google Analytics 4 und
              Google Ads von Google Ireland Limited nur nach Ihrer vorherigen
              Einwilligung. Im eingesetzten Basic Consent Mode werden vor Ihrer
              Auswahl keine Google-Tags geladen und keine Anfragen an Google
              gesendet. Analytics und Marketing können getrennt erlaubt oder
              abgelehnt werden.
            </p>
            <p>
              Nach Ihrer Einwilligung in Analytics lädt der Google Tag Manager
              Google Analytics 4. Dabei können IP-Adresse, Geräte- und
              Browserinformationen, Referrer, aufgerufene Seiten, Zeitpunkte,
              pseudonyme Cookie-Kennungen sowie Nutzungs- und Ereignisdaten
              verarbeitet werden. Für Formularereignisse übermitteln wir nur
              die technischen Parameter <code>form_id</code> und{" "}
              <code>lead_type</code>. Formularinhalte, Name, E-Mail-Adresse,
              Telefonnummer, Dateinamen und interne Anfragekennungen werden
              nicht an Google Analytics übermittelt. Zweck ist die statistische
              Auswertung der Websitenutzung. Die nutzer- und ereignisbezogene
              Aufbewahrung in Google Analytics ist auf zwei Monate eingestellt.
            </p>
            <p>
              Google Analytics verwendet standardmäßig die First-Party-Cookies{" "}
              <code>_ga</code> zur Unterscheidung von Nutzern und{" "}
              <code>_ga_&lt;Container-ID&gt;</code> zur Speicherung des
              Sitzungsstatus. Beide Cookies haben nach der
              Standardkonfiguration eine Laufzeit von bis zu zwei Jahren;
              Browser können diese Laufzeit verkürzen.
            </p>
            <p>
              Nach Ihrer Einwilligung in Marketing darf Google Ads eine von
              unserem Server bestätigte Projektanfrage als Conversion messen.
              Dabei werden technische Verbindungs- und Ereignisdaten,
              kontrollierte Ereignisparameter und eine zufällig erzeugte, nicht
              aus Kontaktdaten abgeleitete Transaktionskennung verarbeitet. Die
              eingesetzte Conversion-Linker-Funktion kann First-Party-Cookies
              mit dem Präfix <code>_gcl_</code> für bis zu 90 Tage speichern.
              Name, E-Mail-Adresse, Telefonnummer, Nachricht, Dateinamen und
              Formularinhalte werden nicht an Google Ads übermittelt.
              Personalisierte Werbung, Remarketing, Google Signals, User-ID,
              user-provided data, Enhanced Conversions und Offline-Uploads sind
              deaktiviert.
            </p>
            <p>
              Rechtsgrundlage für den Zugriff auf Ihr Endgerät ist Ihre
              Einwilligung nach § 25 Abs. 1 TDDDG; Rechtsgrundlage für die
              anschließende Verarbeitung personenbezogener Daten ist Art. 6 Abs.
              1 lit. a DSGVO. Die Einwilligung ist freiwillig. Eine Ablehnung
              hat keine Auswirkung auf die Nutzung der Website oder die
              Möglichkeit, eine Projektanfrage zu senden. Sie können Ihre
              Auswahl jederzeit über „Cookie-Einstellungen“ im Footer mit
              Wirkung für die Zukunft ändern oder widerrufen.
            </p>
            <p>
              Weitere Informationen zu den Google-Cookies finden Sie in der{" "}
              <a
                href="https://support.google.com/analytics/answer/11397207?hl=de"
                rel="noreferrer"
                target="_blank"
              >
                Google-Analytics-Hilfe
              </a>{" "}
              und in der{" "}
              <a
                href="https://business.safety.google/adscookies/?hl=de"
                rel="noreferrer"
                target="_blank"
              >
                Übersicht der Werbe- und Analyse-Cookies von Google
              </a>
              .
            </p>
          </section>

          <section aria-labelledby="projektanfragen">
            <h2 id="projektanfragen">5. Kontakt- und Projektanfragen</h2>
            <p>
              Wenn Sie uns per E-Mail oder Telefon kontaktieren, verarbeiten wir
              die übermittelten Kontaktdaten und Inhalte, um Ihre Anfrage zu
              beantworten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO,
              soweit es um vorvertragliche Maßnahmen geht, andernfalls Art. 6
              Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse liegt in der
              Bearbeitung geschäftlicher Anfragen.
            </p>
            {leadIntakeEnabled ? (
              <>
                <p>
                  Bei Beginn der Übermittlung des Projektformulars speichern wir
                  die angegebene E-Mail-Adresse sowie optional Telefonnummer und
                  Nachricht in einer Datenbank. Die E-Mail-Adresse ist
                  erforderlich, damit wir die Anfrage zuordnen und beantworten
                  können; ohne sie kann das Formular nicht gesendet werden.
                  Telefonnummer, Nachricht, Objekt-Postleitzahl und Dateien sind
                  freiwillig.
                </p>
                <p>
                  Bei einer Anfrage aus dem vollständigen Konfigurator speichern
                  wir außerdem die sichtbar zusammengefasste Konfiguration,
                  ausgewählte Leistungen, eine optional eingegebene
                  fünfstellige Objekt-Postleitzahl und die von unserem Server
                  bestätigte vorläufige Berechnung. Zur Bearbeitung erhalten wir
                  über Resend eine E-Mail-Benachrichtigung. An Ihre E-Mail-Adresse
                  senden wir über Resend eine Eingangsbestätigung mit der
                  Anfragenummer. Bei einer Konfigurator-Anfrage enthält sie auch
                  die Konfigurationszusammenfassung, ausgewählte Leistungen und
                  den bestätigten vorläufigen Nettopreis, jedoch nicht den freien
                  Nachrichtentext oder angehängte Dateien.
                </p>
                <p>
                  Zusätzlich speichern wir den Pfad der Ausgangsseite,
                  technische Anfrage- und Idempotenzkennungen, Status- und
                  Zeitangaben sowie den Löschzeitpunkt. Zum Schutz vor
                  automatisierten oder wiederholten Anfragen prüfen wir, ob mit
                  derselben E-Mail-Adresse innerhalb von 15 Minuten bereits drei
                  Anfragen gestellt wurden. Rechtsgrundlage hierfür ist Art. 6
                  Abs. 1 lit. f DSGVO; unser berechtigtes Interesse liegt im
                  Schutz des Formulars vor Missbrauch und in der Sicherstellung
                  einer zuverlässigen Bearbeitung.
                </p>
                {leadAttachmentsEnabled ? (
                  <p>
                    Wenn Sie freiwillig Dateien auswählen, speichern wir deren
                    Namen, Dateityp und Größe in der Datenbank und übertragen die
                    Dateien in einen privaten Dateispeicher. Dateilinks in unserer
                    internen Benachrichtigung sind signiert und sieben Tage
                    gültig. Lokale Bildvorschauen werden nur im Browser erzeugt
                    und beim Entfernen der Datei oder Verlassen der Seite
                    verworfen. Die Eingangsbestätigung enthält keine Dateilinks.
                  </p>
                ) : null}
                <p>
                  Rechtsgrundlage für die Bearbeitung und Speicherung der
                  Projektanfrage ist Art. 6 Abs. 1 lit. b DSGVO, da die
                  Verarbeitung auf Ihre Anfrage hin zur Durchführung
                  vorvertraglicher Maßnahmen erfolgt.
                </p>
              </>
            ) : (
              <p>
                Das Projektformular ist in dieser Umgebung eine
                Prototypfunktion. Eingaben werden nur auf Format- und
                Größenregeln geprüft, nicht dauerhaft gespeichert und nicht als
                Anfrage weitergeleitet. Lokale Bildvorschauen werden nur im
                Browser erzeugt und beim Entfernen der Datei oder Verlassen der
                Seite verworfen.
              </p>
            )}
          </section>

          <section aria-labelledby="empfaenger">
            <h2 id="empfaenger">6. Empfänger und Drittlandübermittlungen</h2>
            <p>
              Für Hosting nutzen wir Vercel Inc.; die Serverfunktionen sind der
              ausgewählten Region Frankfurt am Main zugeordnet. Die Datenbank wird durch
              Neon, LLC in der AWS-Region Frankfurt (eu-central-1) betrieben.
              {leadAttachmentsEnabled
                ? " Dateien werden in einem privaten Vercel-Blob-Speicher in der Region Frankfurt (fra1) gespeichert."
                : ""} E-Mail-Benachrichtigungen versendet Plus Five Five, Inc.
              (Resend) aus der EU-Senderegion eu-west-1. Eingehende Nachrichten
              an <a href={`mailto:${legal.email}`}>{legal.email}</a> werden
              durch Cloudflare, Inc. an ein Postfach von Google Ireland Limited
              weitergeleitet. Für die einwilligungsabhängige Nutzungs- und
              Conversion-Messung ist Google Ireland Limited Empfängerin.
            </p>
            <p>
              Die genannten Anbieter haben ihren Sitz teilweise in den USA oder
              können dortige Unterauftragnehmer einsetzen. Soweit Daten in die
              USA oder ein anderes Land außerhalb der EU oder des EWR
              übermittelt werden, erfolgt dies auf Grundlage eines anwendbaren
              Angemessenheitsbeschlusses, insbesondere des EU-US Data Privacy
              Framework für aktiv zertifizierte US-Empfänger, oder geeigneter
              Garantien nach Art. 46 DSGVO, insbesondere der
              Standardvertragsklauseln der Europäischen Kommission. Eine Kopie
              der einschlägigen Garantien können Sie unter{" "}
              <a href={`mailto:${legal.email}`}>{legal.email}</a> anfordern.
            </p>
          </section>

          <section aria-labelledby="speicherdauer">
            <h2 id="speicherdauer">7. Speicherdauer</h2>
            <p>
              Gespeicherte Projektanfragen
              {leadAttachmentsEnabled ? " und private Dateien" : ""} werden
              grundsätzlich nach 90 Tagen gelöscht.
              {leadAttachmentsEnabled
                ? " Signierte Dateilinks sind sieben Tage gültig."
                : ""} Operative E-Mail-Nachrichten sowie Daten aus direkten
              E-Mail- oder Telefonanfragen löschen wir, sobald die jeweilige
              Anfrage abschließend bearbeitet ist und keine weitere Aufbewahrung
              erforderlich ist. Eine längere Aufbewahrung erfolgt nur, soweit
              sie zur weiteren Bearbeitung, zur Rechtsverteidigung oder aufgrund
              gesetzlicher Pflichten erforderlich ist. Die Speicherdauern des
              Consent-Cookies sowie der Google-Cookies und
              Google-Analytics-Daten sind in den vorstehenden Abschnitten
              angegeben.
            </p>
          </section>

          <section aria-labelledby="betroffenenrechte">
            <h2 id="betroffenenrechte">8. Ihre Rechte</h2>
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
              die Zukunft widerrufen. Die Rechtmäßigkeit der bis zum Widerruf
              erfolgten Verarbeitung bleibt unberührt. Zur Ausübung Ihrer Rechte
              genügt eine Nachricht an{" "}
              <a href={`mailto:${legal.email}`}>{legal.email}</a>.
            </p>
            <aside aria-labelledby="widerspruchsrecht">
              <h3 id="widerspruchsrecht">Hinweis zum Widerspruchsrecht</h3>
              <p>
                Soweit wir Ihre personenbezogenen Daten auf Grundlage von Art.
                6 Abs. 1 lit. f DSGVO verarbeiten, können Sie aus Gründen, die
                sich aus Ihrer besonderen Situation ergeben, jederzeit nach
                Art. 21 DSGVO widersprechen. Eine formlose Nachricht an{" "}
                <a href={`mailto:${legal.email}`}>{legal.email}</a> genügt.
              </p>
            </aside>
          </section>

          <section aria-labelledby="beschwerderecht">
            <h2 id="beschwerderecht">9. Beschwerderecht</h2>
            <p>
              Sie haben das Recht, sich bei einer Datenschutzaufsichtsbehörde zu
              beschweren. Für den Verantwortlichen ist insbesondere die{" "}
              <a
                href="https://www.datenschutz-berlin.de/"
                rel="noreferrer"
                target="_blank"
              >
                Berliner Beauftragte für Datenschutz und Informationsfreiheit
              </a>{" "}
              zuständig.
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
