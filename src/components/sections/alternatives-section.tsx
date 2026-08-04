import { SectionHeading } from "@/components/ui/section-heading";
import { alternatives } from "@/content/landing.de";

export function AlternativesSection() {
  return (
    <section className="section" id="alternativen">
      <div className="container">
        <SectionHeading
          eyebrow="Einordnung"
          title="Welche Lösung passt zur Aufgabe?"
          introduction="Nicht jedes Objekt braucht einen Leuchtvolant. Die passende Richtung hängt von Markise, Ziel, Objekt und den geklärten Rahmenbedingungen ab."
        />

        <div className="alternative-grid">
          {alternatives.map((alternative) => (
            <article className="alternative-card" key={alternative.id}>
              <h3>{alternative.title}</h3>
              <dl>
                <div>
                  <dt>Passend, wenn</dt>
                  <dd>{alternative.suitableWhen}</dd>
                </div>
                <div>
                  <dt>Zu beachten</dt>
                  <dd>{alternative.boundary}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
