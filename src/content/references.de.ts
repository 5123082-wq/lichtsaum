import type { ReferenceGalleryRegistry } from "@/features/references/types";

export const referenceGallery: ReferenceGalleryRegistry = {
  status: "published",
  items: [
    {
      id: "konzept-restaurantfassade",
      slot: "left-tall",
      context: "Gastronomie · Stadtlage",
      title: "Lichtkante an der Fassade",
      caption:
        "Eine hohe Galerieansicht mit markanter Lichtwirkung an einer städtischen Fassade.",
      image: {
        src: "/images/referenzen/concept-restaurantfassade-tall.webp",
        width: 1122,
        height: 1402,
        alt: "Grafitfarbene Markise mit warm leuchtender Vorderkante an einer städtischen Restaurantfassade bei Dämmerung.",
        focalPoint: { x: 52, y: 45 }
      },
      assetKind: "concept-visual",
      permission: "public-approved"
    },
    {
      id: "konzept-eingang-detail",
      slot: "center-top",
      context: "Eingang · Detail",
      title: "Präzise Lichtlinie",
      caption:
        "Ein breiter Detailausschnitt, der Material, Konstruktion und lineare Lichtwirkung betont.",
      image: {
        src: "/images/referenzen/concept-eingang-detail-wide.webp",
        width: 1586,
        height: 992,
        alt: "Detailansicht einer grafitfarbenen Markise mit linear beleuchteter Vorderkante über einem modernen Café-Eingang.",
        focalPoint: { x: 50, y: 48 }
      },
      assetKind: "concept-visual",
      permission: "public-approved"
    },
    {
      id: "konzept-terrasse",
      slot: "center-bottom",
      context: "Terrasse · Abendbetrieb",
      title: "Rhythmus entlang der Front",
      caption:
        "Mehrere Markisen schaffen entlang der Terrasse eine zusammenhängende Abendwirkung.",
      image: {
        src: "/images/referenzen/concept-terrasse-wide.webp",
        width: 1586,
        height: 992,
        alt: "Abendliche Café-Terrasse mit mehreren dunkelblauen Markisen und warm leuchtenden Vorderkanten.",
        focalPoint: { x: 48, y: 48 }
      },
      assetKind: "concept-visual",
      permission: "public-approved"
    },
    {
      id: "konzept-ecklage",
      slot: "right-tall",
      context: "Ecklage · Stadtraum",
      title: "Wirkung im Straßenraum",
      caption:
        "Eine urbane Ecklage mit räumlicher Tiefe, Spiegelungen und prägnanter Lichtkante.",
      image: {
        src: "/images/referenzen/concept-ecklage-tall.webp",
        width: 1122,
        height: 1402,
        alt: "Schwarze Markise mit warmer Lichtkante über einem Eingang an einer regennassen städtischen Ecklage.",
        focalPoint: { x: 51, y: 44 }
      },
      assetKind: "concept-visual",
      permission: "public-approved"
    }
  ]
};
