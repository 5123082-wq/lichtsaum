import { TransformationComparison } from "@/components/sections/transformation-comparison";
import { SectionHeading } from "@/components/ui/section-heading";
import { transformation } from "@/content/landing.de";

export function TransformationSection() {
  return (
    <section className="section section--deep transformation" id="wirkung">
      <div className="container">
        <div className="transformation__layout">
          <SectionHeading
            eyebrow="Produkt"
            eyebrowTreatment="marker-loop"
            title={
              <>
                Eine Fassade
                <br />
                <span className="text-accent">Zwei Ansichten</span>
              </>
            }
          />

          <TransformationComparison
            comparisonCard={transformation.cards.comparison}
            contextCard={transformation.cards.context}
            dayCard={transformation.cards.day}
          />
        </div>
      </div>
    </section>
  );
}
