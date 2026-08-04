import { appEnvironment, isIndexable } from "@/config/environment";
import { referenceGallery } from "@/content/references.de";
import { ReferenceGallery } from "@/features/references/reference-gallery";
import {
  getReferenceGalleryVisibility,
  isReferenceGalleryPublished,
  orderReferenceProjects
} from "@/features/references/types";

export function ReferencesSection() {
  const visibility = getReferenceGalleryVisibility(
    referenceGallery,
    appEnvironment,
    isIndexable,
    process.env.NODE_ENV === "production"
  );
  const isPublished = isReferenceGalleryPublished(referenceGallery);
  const hasConceptVisuals = referenceGallery.items.some(
    (item) => item.assetKind === "concept-visual"
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
              <span>
                {isPublished ? "Realisierte Projekte" : "Temporäre Vorschau"}
              </span>
            </p>
            <h2 id="references-title">
              {isPublished ? "Ausgewählte Referenzen." : "So wirkt die Galerie."}
            </h2>
          </div>
          <div>
            <p>
              {isPublished
                ? "Unterschiedliche Objekt- und Einbausituationen mit bestätigtem Projektumfang und freigegebenem Bildmaterial."
                : hasConceptVisuals
                  ? "Vier KI-generierte Konzeptvisualisierungen zeigen ausschließlich Raster, Zuschnitt und Interaktion. Sie sind keine realisierten LICHTSAUM-Projekte und werden später vollständig ersetzt."
                  : "Für die interne Prüfung zusammengestellte reale Projekte mit dokumentiertem Kontext und zugeordnetem Bildmaterial."}
            </p>
            <a href="/referenzen">
              {isPublished
                ? "Alle Referenzen ansehen"
                : "Galerie-Vorschau öffnen"}
            </a>
          </div>
        </header>

        <ReferenceGallery items={orderReferenceProjects(referenceGallery.items)} />
      </div>
    </section>
  );
}
