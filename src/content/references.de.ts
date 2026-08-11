import type { ReferenceGalleryRegistry } from "@/features/references/types";

export const referenceGallery: ReferenceGalleryRegistry = {
  status: "published",
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
      permission: "public-approved"
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
      permission: "public-approved"
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
      permission: "public-approved"
    },
    {
      id: "konzept-ecklage",
      slot: "right-tall",
      context: "Ecklage · Stadtraum",
      title: "Wirkung im Straßenraum",
      caption:
        "Konzeptansicht einer Bar an einer historischen Eckfassade mit beleuchtetem Schriftzug im Markisenvolant.",
      image: {
        src: "/images/referenzen/lichtsaum-konzept-bar-am-markt-eckfassade-abend.webp",
        width: 1536,
        height: 1024,
        alt: "Historische Eckfassade einer Bar am Abend mit schwarzer Markise, leuchtendem Schriftzug „BAR AM MARKT“ und Tischen auf regennassem Kopfsteinpflaster.",
        focalPoint: { x: 63, y: 50 }
      },
      assetKind: "concept-visual",
      permission: "public-approved"
    }
  ]
};
