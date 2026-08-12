import {
  deploymentEnvironment,
  isIndexable
} from "@/config/environment";
import { referenceGallery } from "@/content/references.de";
import { ReferenceGallery } from "@/features/references/reference-gallery";
import {
  getReferenceGalleryVisibility,
  orderReferenceProjects
} from "@/features/references/types";

export function ReferencesSection() {
  const visibility = getReferenceGalleryVisibility(
    referenceGallery,
    deploymentEnvironment,
    isIndexable
  );
  if (!visibility.render) {
    return null;
  }

  return (
    <section
      aria-labelledby="references-title"
      className="section references-section"
      id="referenzen"
    >
      <div className="container">
        <header className="references-section__header">
          <div>
            <p className="eyebrow eyebrow--marker-loop">
              <span>Galerie</span>
            </p>
            <h2 id="references-title">Ausgewählte Ansichten</h2>
          </div>
          <div>
            <p>
              Lichtwirkung in unterschiedlichen Objekt- und Einbausituationen.
            </p>
            <a href="/referenzen">Alle Ansichten ansehen</a>
          </div>
        </header>

        <ReferenceGallery items={orderReferenceProjects(referenceGallery.items)} />
      </div>
    </section>
  );
}
