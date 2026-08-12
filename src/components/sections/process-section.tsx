import { SectionHeading } from "@/components/ui/section-heading";
import { processSteps } from "@/content/landing.de";

export function ProcessSection() {
  return (
    <section className="section section--surface" id="ablauf">
      <div className="container">
        <SectionHeading
          eyebrow="Projektablauf"
          title="Von der ersten Sichtung zur möglichen Umsetzung"
          introduction="Jeder Schritt reduziert offene Annahmen. Eine Umsetzung beginnt erst, wenn Eignung, Gestaltung, Umfang und Zuständigkeiten bestätigt sind."
        />

        <ol className="process-list">
          {processSteps.map((step) => (
            <li className="process-step" key={step.id}>
              <span className="process-step__index" aria-hidden="true">
                {step.number}
              </span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
