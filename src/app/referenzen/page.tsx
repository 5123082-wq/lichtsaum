import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { GlobalSiteHeader } from "@/components/layout/global-site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import {
  appEnvironment,
  isIndexable,
  siteUrl
} from "@/config/environment";
import { siteConfig } from "@/config/site";
import { referenceGallery } from "@/content/references.de";
import {
  getReferenceGalleryVisibility,
  isReferenceGalleryPublished,
  orderReferenceProjects
} from "@/features/references/types";

const visibility = getReferenceGalleryVisibility(
  referenceGallery,
  appEnvironment,
  isIndexable,
  process.env.NODE_ENV === "production"
);

const orderedReferences = orderReferenceProjects(referenceGallery.items);
const galleryIsPublished = isReferenceGalleryPublished(referenceGallery);
const galleryHasConceptVisuals = referenceGallery.items.some(
  (item) => item.assetKind === "concept-visual"
);

export function generateMetadata(): Metadata {
  const title = galleryIsPublished
    ? `Referenzen | ${siteConfig.name}`
    : `Galerie-Vorschau | ${siteConfig.name}`;
  const description = galleryIsPublished
    ? "Ausgewählte realisierte Projekte mit beleuchteten Markisen-Volants in unterschiedlichen Einbausituationen."
    : "Nicht öffentliche Vorschau der Galerie-Komposition mit temporären Konzeptvisualisierungen.";

  if (!visibility.indexable || !siteUrl) {
    return {
      title,
      description,
      alternates: { canonical: null },
      openGraph: null,
      robots: {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
          index: false,
          follow: false,
          noimageindex: true
        }
      }
    };
  }

  return {
    title,
    description,
    alternates: { canonical: "/referenzen" },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      title,
      description,
      url: "/referenzen"
    }
  };
}

export default function ReferencesPage() {
  if (!visibility.render) {
    notFound();
  }

  return (
    <>
      <a className="skip-link" href="#main-content">
        Zum Inhalt springen
      </a>
      <GlobalSiteHeader />
      <main className="references-page" id="main-content">
        <header className="references-page__intro container">
          <p className="eyebrow">
            {galleryIsPublished
              ? "Realisierte Projekte"
              : "Temporäre Konzeptvisualisierungen"}
          </p>
          <h1>{galleryIsPublished ? "Referenzen." : "Galerie-Vorschau."}</h1>
          <p>
            {galleryIsPublished
              ? "Ausgewählte Objekte mit bestätigtem Projektumfang und zur Veröffentlichung freigegebenem Bildmaterial."
              : galleryHasConceptVisuals
                ? "Diese KI-generierten Bilder dienen nur der Beurteilung von Raster, Zuschnitt und Interaktion. Sie zeigen keine realisierten LICHTSAUM-Projekte und werden durch freigegebene Originalfotos ersetzt."
                : "Für die interne Prüfung zusammengestellte reale Projekte mit dokumentiertem Kontext und zugeordnetem Bildmaterial."}
          </p>
        </header>

        <div className="references-page__list container">
          {orderedReferences.map((item, index) => (
            <article
              className="references-page__item"
              id={item.id}
              key={item.id}
            >
              <div className="references-page__media">
                <Image
                  alt={item.image.alt}
                  className="references-page__image"
                  height={item.image.height}
                  sizes="(min-width: 1024px) 62vw, 100vw"
                  src={item.image.src}
                  style={{
                    objectPosition: `${item.image.focalPoint.x}% ${item.image.focalPoint.y}%`
                  }}
                  width={item.image.width}
                />
              </div>
              <div className="references-page__copy">
                <p>
                  {String(index + 1).padStart(2, "0")} /{" "}
                  {item.assetKind === "concept-visual"
                    ? `Konzeptvisualisierung · ${item.context}`
                    : item.context}
                </p>
                <h2>{item.title}</h2>
                <p>{item.caption}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="references-page__cta container">
          <p>Ihr Objekt wird vor jeder weiteren Zusage individuell geprüft.</p>
          <Link className="button button--primary" href="/#projekt-pruefen">
            Projekt prüfen lassen
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
