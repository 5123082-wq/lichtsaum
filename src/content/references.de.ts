import type { ReferenceGalleryRegistry } from "@/features/references/types";

export const referenceGallery: ReferenceGalleryRegistry = {
  status: "review",
  items: [
    {
      id: "real-gastronomie-bar",
      slot: "left-tall",
      context: "Gastronomie · Abendansicht",
      title: "Licht über drei Fenstern.",
      caption:
        "Reale Objektaufnahme einer Gastronomiefassade mit drei bordeauxroten Markisen und warm leuchtenden Schriftzügen.",
      image: {
        src: "/images/referenzen/lichtsaum-referenz-gastronomie-bar-abend.webp",
        width: 1254,
        height: 1254,
        alt: "Abendliche Gastronomiefassade mit drei bordeauxroten Markisen und warm leuchtenden Schriftzügen „Bar“ über den Fenstern.",
        focalPoint: { x: 50, y: 52 }
      },
      assetKind: "real-project",
      permission: "review-only"
    },
    {
      id: "real-restaurant-garten",
      slot: "center-top",
      context: "Restaurant · Abendansicht",
      title: "Licht entlang der Terrasse.",
      caption:
        "Reale Objektaufnahme einer Restaurantfassade mit mehreren dunkelgrünen Markisen und warm leuchtenden Schriftzügen über einer Außenterrasse.",
      image: {
        src: "/images/referenzen/lichtsaum-referenz-restaurant-garten-abend.webp",
        width: 1448,
        height: 1086,
        alt: "Restaurantfassade mit mehreren dunkelgrünen Markisen und warm leuchtenden Schriftzügen „GARTEN“ über einer Außenterrasse.",
        focalPoint: { x: 50, y: 52 }
      },
      assetKind: "real-project",
      permission: "review-only"
    },
    {
      id: "real-gewerbefassade-ahouse",
      slot: "center-bottom",
      context: "Gewerbe · Abendansicht",
      title: "Zwei Lichtfelder. Eine Fassade.",
      caption:
        "Reale Objektaufnahme einer nächtlichen Gewerbefassade mit zwei dunklen Markisen und warm leuchtenden Schriftzügen.",
      image: {
        src: "/images/referenzen/lichtsaum-referenz-gewerbefassade-ahouse-abend.webp",
        width: 1457,
        height: 1080,
        alt: "Nächtliche Straßenansicht einer roten Backsteinfassade mit zwei dunklen Markisen und warm leuchtenden Schriftzügen „A-HOUSE“.",
        focalPoint: { x: 50, y: 54 }
      },
      assetKind: "real-project",
      permission: "review-only"
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
      permission: "review-only"
    }
  ]
};
