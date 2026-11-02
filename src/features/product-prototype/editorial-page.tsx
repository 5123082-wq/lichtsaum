import Link from "next/link";
import { GlobalSiteHeader } from "@/components/layout/global-site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { productTopics } from "@/content/product.de";
import { HemStudies } from "@/features/product-prototype/hem-studies";
import { MaterialStudy } from "@/features/product-prototype/material-study";
import { EditorialExchange } from "@/features/product-prototype/editorial-exchange";
import { VideoHero } from "@/features/product-prototype/video-hero";
import "@/features/product-prototype/editorial.css";

export function ProductEditorialPage() {
  const fabricSource = productTopics.find((topic) => topic.kind === "fabric")!;
  const fabric = { ...fabricSource, slides: fabricSource.slides.map((slide, index) => ({
    ...slide,
    copy: [
      "Der neue Volant soll zur vorhandenen Markise und zu Ihrem Auftritt passen. Stoff und Farbton stimmen wir am Muster ab.",
      "Die Ausführung von Naht und Einfassung wird passend zum Volant abgestimmt.",
      "Ton in Ton oder als bewusster Kontrast: Stofffarbe und Schriftbild werden gemeinsam betrachtet."
    ][index] ?? slide.copy
  })) };
  return <>
    <a className="skip-link" href="#main-content">Zum Inhalt springen</a>
    <GlobalSiteHeader overlayHero />
    <main className="editorial-product" id="main-content">
      <VideoHero />

      <section className="editorial-material editorial-width editorial-fabric-chapter" id="tuch" aria-labelledby="editorial-fabric-title" data-chapter="fabric">
        <div className="editorial-section-heading editorial-material__heading">
          <div><p className="eyebrow eyebrow--marker-loop"><span>Tuch & Farbe</span></p>
            <h2 id="editorial-fabric-title">VERTRAUTE MARKISE.<br /><span>Ein neuer Ausdruck.</span></h2></div>
          <p>Der textile Volant wird durch einen individuell gestalteten Leuchtvolant ersetzt. Stoff, Farbe und Schrift wählen Sie passend zu Ihrem Auftritt. Die Eignung Ihrer Markise prüfen wir am konkreten Objekt.</p>
        </div>
        <MaterialStudy topic={fabric} />
      </section>

      <EditorialExchange material={<>
        <div className="editorial-section-heading editorial-shape-intro"><div><p className="eyebrow eyebrow--marker-loop"><span>Form & Schrift</span></p>
          <h2 id="editorial-material-title">EIN ABSCHLUSS.<br /><span>Drei Linien.</span></h2></div>
          <p>Die Form gehört zum Gesamtbild. Hier sehen Sie drei Varianten im direkten Vergleich.</p></div>
        <HemStudies />
        <p className="editorial-shape-note editorial-small">Verfügbarkeit und Ausführung werden für die konkrete Markise geprüft.</p>
      </>} />

      <section className="editorial-questions editorial-width" aria-labelledby="editorial-questions-title" data-chapter="questions">
        <div><p className="eyebrow eyebrow--marker-loop"><span>Gut zu wissen</span></p><h2 id="editorial-questions-title">DIE FRAGEN<br /><span>VOR DEM START.</span></h2></div>
        <div className="editorial-notes">
          <details><summary>Passt der Leuchtvolant an meine Markise?</summary><p>Entscheidend sind die Maße, die Befestigung des vorhandenen Volants und die Stromzuführung. Fotos der Markise helfen bei der ersten Einschätzung. Die Eignung wird für Ihr Objekt geprüft.</p></details>
          <details><summary>Wie werden Montage und Stromanschluss geplant?</summary><p>Montagezugang, Führung des Volants und Leitungsweg werden am Objekt abgestimmt. Welche Arbeiten erforderlich sind und wer sie übernimmt, wird vor der Umsetzung geklärt.</p></details>
          <details><summary>Was zeigt mir der Konfigurator?</summary><p>Sie gestalten Ihren Volant und wählen die Maße. Im Konfigurator sehen Sie den vorläufigen Preis gemeinsam mit dem enthaltenen Umfang und den separat berechneten Leistungen. Das konkrete Angebot folgt nach der Projektprüfung.</p></details>
        </div>
      </section>

      <section className="editorial-project editorial-width" aria-labelledby="editorial-project-title" data-chapter="project">
        <div className="editorial-section-heading"><div><p className="eyebrow eyebrow--marker-loop"><span>Ihr nächster Schritt</span></p>
          <h2 id="editorial-project-title">STARTEN SIE MIT<br /><span>IHRER FRAGE.</span></h2></div>
          <p>Ein fertiger Entwurf oder genaue Maße sind für die erste Anfrage nicht nötig.</p></div>
        <div className="editorial-project-steps">
          <div><h3>Was Sie mitbringen.</h3><p>Ihre E-Mail-Adresse genügt. Eine kurze Nachricht oder Fotos helfen, sind aber freiwillig.</p></div>
          <div><h3>Was wir klären.</h3><p>Wir prüfen die Eignung Ihrer Markise. Fehlende Angaben, Gestaltung und Leistungsumfang stimmen wir mit Ihnen ab.</p></div>
        </div>
        <div className="editorial-project-action"><Link className="button button--primary" href="/#projekt-pruefen">Anfrageformular öffnen <span aria-hidden="true">→</span></Link>
          <p className="editorial-small">Zum Formular auf der Startseite. Ihre Anfrage senden Sie erst dort ab.</p></div>
        <aside className="editorial-service-note">
          <Link className="editorial-text-link" href="/kontakt">Reinigung, Neubespannung oder Reparatur besprechen <span aria-hidden="true">→</span></Link></aside>
      </section>
    </main>
    <SiteFooter />
  </>;
}
