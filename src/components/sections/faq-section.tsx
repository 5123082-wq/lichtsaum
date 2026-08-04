import { SectionHeading } from "@/components/ui/section-heading";
import { faqItems } from "@/content/landing.de";

export function FaqSection() {
  return (
    <section
      aria-labelledby="faq-title"
      className="section section--deep"
      id="faq"
    >
      <div className="container">
        <SectionHeading
          eyebrow="FAQ"
          eyebrowTreatment="marker-loop"
          headingId="faq-title"
          title="Fragen."
        />

        <div className="faq-list">
          {faqItems.map((item) => (
            <details key={item.id}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
