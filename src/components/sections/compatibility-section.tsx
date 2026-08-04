import { SectionHeading } from "@/components/ui/section-heading";
import { compatibility } from "@/content/landing.de";

export function CompatibilitySection() {
  return (
    <section
      className="section section--surface eligibility"
      id="eignung"
      aria-labelledby="eligibility-title"
    >
      <div className="container">
        <SectionHeading
          eyebrow={compatibility.intro.eyebrow}
          eyebrowTreatment="marker-loop"
          headingId="eligibility-title"
          title={
            <>
              {compatibility.intro.titleLines[0]}
              <br />
              {compatibility.intro.titleLines[1]}
            </>
          }
          introduction={compatibility.intro.body}
        />

        <div className="eligibility__layout">
          <ol className="eligibility__sequence" aria-label="Ablauf der Eignungsprüfung">
            {compatibility.sequence.map((item, index) => (
              <li key={item.id}>
                <span aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="eligibility__points">
            {compatibility.points.map((point) => (
              <article className="eligibility__point" key={point.id}>
                <div className="eligibility__point-copy">
                  <h3>{point.label}</h3>
                  <p>{point.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
