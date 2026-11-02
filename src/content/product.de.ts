export type ProductTopic = {
  id: string; label: string; kind: "intro" | "fabric" | "form" | "light";
  note: string | null;
  slides: { id: string; label: string; title: string[]; copy: string; kicker: string; image: string; imageWidth?: number; imageHeight?: number; alt: string }[];
};

export const productTopics: ProductTopic[] = [
  {
    "id": "gestaltung",
    "label": "Der Leuchtvolant",
    "kind": "intro",
    "slides": [
      {
        "id": "story-wirkung",
        "label": "Der Leuchtvolant",
        "title": [
          "AN IHRER",
          "FASSADE."
        ],
        "copy": "Der Volant sitzt an der Vorderkante der Markise. Hier sehen Sie, wie die beleuchtete Beschriftung am Eingang wirken kann.",
        "kicker": "Die Wirkung",
        "image": "/images/product/fassade.webp",
        "alt": "Konzept einer Caféfassade mit dunkler Markise und beleuchtetem Schriftzug."
      }
    ],
    "note": null
  },
  {
    "id": "stoffe",
    "label": "Tuch & Farbe",
    "kind": "fabric",
    "slides": [
      {
        "id": "story-stoff-anthrazit",
        "label": "Gewebe",
        "title": [
          "GEWEBE &",
          "STRUKTUR."
        ],
        "copy": "Aus der Nähe wird die Struktur des Gewebes sichtbar. Am Stoffmuster lassen sich Oberfläche und Griff für den neuen Volant vergleichen.",
        "kicker": "Tuch & Farbe",
        "image": "/images/product/markisenstoff-acryl-graphit-melange.webp",
        "imageWidth": 3392,
        "imageHeight": 1248,
        "alt": "Teilweise abgerollte graphitgraue Markisenstoffbahn mit melierter Gewebestruktur."
      },
      {
        "id": "story-stoff-sand",
        "label": "Verarbeitung",
        "title": [
          "KANTE &",
          "VERARBEITUNG."
        ],
        "copy": "Stoff, Naht und Einfassung prägen den Abschluss. Hier rücken die textilen Details in den Vordergrund.",
        "kicker": "Tuch & Farbe",
        "image": "/images/product/textile-workbench-sand.webp",
        "alt": "Sandfarbene Stoffbahn mit umgeschlagener Kante auf einem Zuschneidetisch."
      },
      {
        "id": "story-stoff-palette",
        "label": "Farben",
        "title": [
          "FARBEN",
          "KOMBINIEREN."
        ],
        "copy": "Ton in Ton oder als Kontrast zur vorhandenen Markise: Stoffmuster helfen, Farben zusammen zu beurteilen.",
        "kicker": "Tuch & Farbe",
        "image": "/images/product/markisenstoff-farbfaecher-petrol-terrakotta-oliv.webp",
        "imageWidth": 3392,
        "imageHeight": 1248,
        "alt": "Neun gewebte Stoffmuster in Naturweiß, Sand, Graphit, Petrol, Blau, Grün, Oliv, Terrakotta und Ocker."
      }
    ],
    "note": "Material, Farbton und Verarbeitung werden anhand von Mustern abgestimmt."
  },
  {
    "id": "formen",
    "label": "Die Form des Volants",
    "kind": "form",
    "slides": [
      {
        "id": "story-gerade",
        "label": "Gerade",
        "title": [
          "GERADE."
        ],
        "copy": "Ein gerader Abschluss über die gesamte Breite. Die Einfassung folgt der unteren Kante.",
        "kicker": "Die gerade Form",
        "image": "/images/product/hem-straight-daylight.webp",
        "alt": "Konzept eines Leuchtvolants mit gerader Unterkante."
      },
      {
        "id": "story-welle",
        "label": "Welle",
        "title": [
          "GEWELLT."
        ],
        "copy": "Eine gleichmäßige Wellenlinie entlang der unteren Kante. Der Schriftzug sitzt auf der Fläche darüber.",
        "kicker": "Die gewellte Form",
        "image": "/images/product/hem-wave-daylight.webp",
        "alt": "Konzept eines Leuchtvolants mit sanft gewellter Unterkante."
      },
      {
        "id": "story-bogen",
        "label": "Bogen",
        "title": [
          "BOGENFÖRMIG."
        ],
        "copy": "Wiederkehrende Bögen formen den unteren Abschluss. Die Einfassung zeichnet die Kontur nach.",
        "kicker": "Die figurierte Form",
        "image": "/images/product/hem-scallop-daylight.webp",
        "alt": "Konzept eines Leuchtvolants mit bogenförmiger Unterkante."
      }
    ],
    "note": null
  },
  {
    "id": "licht",
    "label": "Die Lichtwirkung",
    "kind": "light",
    "slides": [
      {
        "id": "story-warm",
        "label": "Warmweiß",
        "title": [
          "WARMWEISS."
        ],
        "copy": "Die Schrift leuchtet in einem warmen Weißton. Schalten Sie das Licht aus, um die unbeleuchtete Ansicht zu vergleichen.",
        "kicker": "Lichtwirkung",
        "image": "/images/product/leuchtvolant-detail.webp",
        "alt": "Lichtkonzept: warmweiß leuchtende LICHTSAUM-Schrift auf dunklem Stoff."
      },
      {
        "id": "story-neutral",
        "label": "Neutralweiß",
        "title": [
          "NEUTRALWEISS."
        ],
        "copy": "Dieselbe Schrift in neutralem Weiß. Stoff, Form und Perspektive bleiben für den Vergleich gleich.",
        "kicker": "Lichtwirkung",
        "image": "/images/product/light-neutral.webp",
        "alt": "Lichtkonzept: neutralweiß leuchtende LICHTSAUM-Schrift auf demselben dunklen Stoff."
      },
      {
        "id": "story-amber",
        "label": "Amber",
        "title": [
          "AMBER."
        ],
        "copy": "Eine Lichtstudie mit amberfarbener Schrift. Vergleichen Sie den Farbton mit warmem und neutralem Weiß.",
        "kicker": "Lichtwirkung",
        "image": "/images/product/light-amber.webp",
        "alt": "Lichtkonzept: amberfarben leuchtende LICHTSAUM-Schrift auf dunklem Stoff."
      }
    ],
    "note": "Konzeptansichten. Lichtfarbe und unbeleuchtetes Schriftbild werden am Muster abgestimmt."
  }
];
