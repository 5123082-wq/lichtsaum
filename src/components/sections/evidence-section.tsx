import { SectionHeading } from "@/components/ui/section-heading";
import { evidenceMessages } from "@/content/landing.de";

export function EvidenceSection() {
  return (
    <section className="section section--surface" id="nachweise">
      <div className="container">
        <SectionHeading
          eyebrow={evidenceMessages.intro.eyebrow}
          title={evidenceMessages.intro.title}
          introduction={evidenceMessages.intro.body}
        />

        <div className="evidence-empty">
          <div className="evidence-empty__inner">
            <span className="evidence-empty__status">Konzeptstand / TBD</span>
            <h3>Noch keine öffentlichen Nachweise.</h3>
            <p>{evidenceMessages.placeholder}</p>
            <dl className="evidence-list">
              {evidenceMessages.messages.map((message) => (
                <div key={message.id}>
                  <dt>{message.label}</dt>
                  <dd>{message.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
