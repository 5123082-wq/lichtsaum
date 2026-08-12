import { SectionHeading } from "@/components/ui/section-heading";
import { constraints } from "@/content/landing.de";

export function ConstraintsSection() {
  return (
    <section className="section section--deep" id="grenzen">
      <div className="container">
        <SectionHeading
          eyebrow="Projektgrenzen"
          title="Was vor einer Freigabe geklärt sein muss"
          introduction="Der Retrofit ist keine pauschale Standardlösung. Diese Grenzen schützen das Objekt, die bestehende Markise und alle beteiligten Parteien vor ungeklärten Annahmen."
        />

        <div className="constraint-grid">
          {constraints.map((constraint, index) => (
            <article className="constraint-card" key={constraint.id}>
              <p className="constraint-card__label">
                Prüfpunkt {String(index + 1).padStart(2, "0")}
              </p>
              <h3>{constraint.label}</h3>
              <p>{constraint.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
