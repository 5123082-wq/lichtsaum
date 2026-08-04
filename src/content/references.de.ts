import type { ReferenceGalleryRegistry } from "@/features/references/types";

export const referenceGallery: ReferenceGalleryRegistry = {
  status: "review",
  items: [
    {
      id: "konzept-restaurantfassade",
      slot: "left-tall",
      context: "Gastronomie · Stadtlage",
      title: "Lichtkante an der Fassade",
      caption:
        "KI-generierte Konzeptvisualisierung für die Beurteilung einer hohen Galerie-Karte und der Lichtwirkung an einer städtischen Fassade. Kein realisiertes LICHTSAUM-Projekt.",
      image: {
        src: "/images/referenzen/concept-restaurantfassade-tall.webp",
        width: 1122,
        height: 1402,
        alt: "KI-generierte Konzeptvisualisierung einer grafitfarbenen Markise mit warm leuchtender Vorderkante an einer städtischen Restaurantfassade bei Dämmerung.",
        focalPoint: { x: 52, y: 45 }
      },
      assetKind: "concept-visual",
      permission: "review-only"
    },
    {
      id: "konzept-eingang-detail",
      slot: "center-top",
      context: "Eingang · Detail",
      title: "Präzise Lichtlinie",
      caption:
        "KI-generierte Konzeptvisualisierung für die Prüfung eines breiten Detailausschnitts, der Material, Konstruktion und lineare Lichtwirkung betont. Kein realisiertes LICHTSAUM-Projekt.",
      image: {
        src: "/images/referenzen/concept-eingang-detail-wide.webp",
        width: 1586,
        height: 992,
        alt: "KI-generierte Detailansicht einer grafitfarbenen Markise mit linear beleuchteter Vorderkante über einem modernen Café-Eingang.",
        focalPoint: { x: 50, y: 48 }
      },
      assetKind: "concept-visual",
      permission: "review-only"
    },
    {
      id: "konzept-terrasse",
      slot: "center-bottom",
      context: "Terrasse · Abendbetrieb",
      title: "Rhythmus entlang der Front",
      caption:
        "KI-generierte Konzeptvisualisierung für die Prüfung einer breiten Karte mit mehreren Markisen und einer zusammenhängenden Abendwirkung. Kein realisiertes LICHTSAUM-Projekt.",
      image: {
        src: "/images/referenzen/concept-terrasse-wide.webp",
        width: 1586,
        height: 992,
        alt: "KI-generierte Konzeptvisualisierung einer abendlichen Café-Terrasse mit mehreren dunkelblauen Markisen und warm leuchtenden Vorderkanten.",
        focalPoint: { x: 48, y: 48 }
      },
      assetKind: "concept-visual",
      permission: "review-only"
    },
    {
      id: "konzept-ecklage",
      slot: "right-tall",
      context: "Ecklage · Stadtraum",
      title: "Wirkung im Straßenraum",
      caption:
        "KI-generierte Konzeptvisualisierung für die Prüfung einer hohen Abschlusskarte mit Tiefe, Spiegelungen und urbanem Kontext. Kein realisiertes LICHTSAUM-Projekt.",
      image: {
        src: "/images/referenzen/concept-ecklage-tall.webp",
        width: 1122,
        height: 1402,
        alt: "KI-generierte Konzeptvisualisierung einer schwarzen Markise mit warmer Lichtkante über einem Eingang an einer regennassen städtischen Ecklage.",
        focalPoint: { x: 51, y: 44 }
      },
      assetKind: "concept-visual",
      permission: "review-only"
    }
  ]
};
