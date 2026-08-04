import { SectionHeading } from "@/components/ui/section-heading";
import { variants } from "@/content/landing.de";

export function VariantsSection() {
  return (
    <section className="section section--deep" id="varianten">
      <div className="container">
        <SectionHeading
          eyebrow="Gestaltungsrichtungen"
          title="Ein System. Unterschiedliche Markenauftritte."
          introduction="Die Varianten beschreiben mögliche Kompositionsrichtungen, keine bestätigten technischen Ausführungen. Motiv, Fläche und Machbarkeit werden erst im Projekt geprüft."
        />

        <div className="variant-grid">
          {variants.map((variant) => (
            <article className="variant-card" key={variant.id}>
              <div>
                <span className="variant-card__index">{variant.label}</span>
                <h3>{variant.title}</h3>
              </div>
              <p>{variant.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
