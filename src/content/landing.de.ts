export type LandingSectionIntro = Readonly<{
  eyebrow: string;
  title: string;
  body: string;
}>;

export type TransformationCardContent = Readonly<{
  title: string;
  alt: string;
  showColorLabel: string;
  showMonochromeLabel: string;
}>;

export type StaticTransformationCardContent = Readonly<{
  label: string;
  alt: string;
}>;

export type EngineeredPrecisionView = Readonly<{
  id: "lichtbild" | "gestaltung" | "aufmass";
  label: string;
  title: string;
  text: string;
  image: string;
  alt: string;
}>;

export type ContentCard = Readonly<{
  id: string;
  label: string;
  title: string;
  text: string;
}>;

export type EligibilitySequenceStep = Readonly<{
  id: string;
  title: string;
  text: string;
}>;

export type EligibilityPoint = Readonly<{
  id: string;
  label: string;
  text: string;
}>;

export type ProcessStep = Readonly<{
  id: string;
  number: string;
  title: string;
  text: string;
}>;

export type Constraint = Readonly<{
  id: string;
  label: string;
  text: string;
}>;

export type Alternative = Readonly<{
  id: string;
  title: string;
  suitableWhen: string;
  boundary: string;
}>;

export type FaqItem = Readonly<{
  id: string;
  question: string;
  answer: string;
}>;

export type StatusMessage = Readonly<{
  id: string;
  label: string;
  text: string;
}>;

export const transformation = {
  intro: {
    eyebrow: "Gestaltung",
    title: "Eine Fassade. Zwei Ansichten.",
    body:
      "Die Gestaltung wird für den Auftritt am Tag und als Lichtfläche bei Dunkelheit entwickelt. Ob Motiv, Kontrast und Einbausituation dafür geeignet sind, wird objektbezogen geprüft."
  },
  cards: {
    day: {
      label: "Klassisch",
      alt:
        "Konzeptvisualisierung einer klassischen Restaurantfassade bei Nacht mit dunkelblauen Markisen und den warm leuchtenden Schriftzügen „RESTAURANT“ und „LUCHINA“.",
      showColorLabel: "Farbdarstellung anzeigen.",
      showMonochromeLabel: "Schwarz-Weiß-Darstellung wiederherstellen."
    },
    comparison: {
      title: "Modern",
      alt:
        "Konzeptvisualisierung einer Café-Restaurant-Fassade bei Nacht mit besetzter Terrasse; die Aufschrift „CAFÉ RESTAURANT“ am dunklen Volant leuchtet warmweiß.",
      showColorLabel: "Farbdarstellung anzeigen.",
      showMonochromeLabel: "Schwarz-Weiß-Darstellung wiederherstellen."
    },
    context: {
      label: "High-Tech",
      alt:
        "Konzeptvisualisierung einer städtischen Café- und Bistrofassade am Abend mit dunklem Markisenvolant und warm leuchtender Beschriftung.",
      showColorLabel: "Farbdarstellung anzeigen.",
      showMonochromeLabel: "Schwarz-Weiß-Darstellung wiederherstellen."
    }
  }
} as const satisfies Readonly<{
  intro: LandingSectionIntro;
  cards: Readonly<{
    day: StaticTransformationCardContent &
      Pick<
        TransformationCardContent,
        "showColorLabel" | "showMonochromeLabel"
      >;
    comparison: TransformationCardContent;
    context: StaticTransformationCardContent &
      Pick<
        TransformationCardContent,
        "showColorLabel" | "showMonochromeLabel"
      >;
  }>;
}>;

export const engineeredPrecision = {
  intro: {
    eyebrow: "Technische Präzision",
    title: "Engineered Precision.",
    body:
      "Drei schematische Ansichten zeigen Lichtbild, Gestaltung und die für das Aufmaß relevanten Abmessungen. Die konkrete Ausführung wird objektbezogen geprüft."
  },
  views: [
    {
      id: "lichtbild",
      label: "Lichtbild",
      title: "Wirkung bei Dunkelheit.",
      text:
        "Der leuchtende Volant kann den Außenauftritt um einen zusätzlichen Lichtschriftzug ergänzen. Ist keine separate Leuchtreklame vorhanden, kann er nachts zum zentralen Lichtelement des Objekts werden.",
      image: "/images/lichtsaum-engineered-lichtbild.webp",
      alt:
        "Dunkle Markise an einer Fassade mit warmweiß leuchtendem Schriftzug LICHTSAUM und eingezeichneten Konstruktionslinien."
    },
    {
      id: "gestaltung",
      label: "Gestaltung",
      title: "Lichtfeld bestimmt den Aufwand.",
      text:
        "Die orange gestrichelte Kontur markiert den Teil des Volants, der als Lichtfeld ausgeführt wird; die übrige Fläche bleibt Stoff. Größe und Anzahl der Lichtfelder beeinflussen die Projektkosten.",
      image: "/images/lichtsaum-engineered-gestaltung-lichtfeld.webp",
      alt:
        "Schematische Ansicht der dunklen Markise mit orange gestrichelter Kontur um das Lichtfeld des leuchtenden Schriftzugs LICHTSAUM."
    },
    {
      id: "aufmass",
      label: "Aufmaß",
      title: "Abmessungen am Bestand.",
      text:
        "Gemessen werden Länge und Höhe des vorhandenen Volants direkt am konkreten Objekt. Diese Maße bilden die Grundlage für die Prüfung der ausführbaren Volantfläche.",
      image: "/images/lichtsaum-engineered-aufmass-volant.webp",
      alt:
        "Schematische Ansicht der dunklen Markise mit orangefarbenen Maßlinien für Länge und Höhe des Volants."
    }
  ]
} as const satisfies Readonly<{
  intro: LandingSectionIntro;
  views: readonly EngineeredPrecisionView[];
}>;

export const compatibility = {
  intro: {
    eyebrow: "Eignung",
    titleLines: [
      "Konstruktion prüfen.",
      "Volant erneuern."
    ],
    body:
      "Die vorhandene Markise bleibt bestehen, wenn ihre Konstruktion und Mechanik für die Nachrüstung geeignet sind."
  },
  sequence: [
    {
      id: "existing-awning",
      title: "Bestehende Markise",
      text: "Ausgangssituation am Objekt"
    },
    {
      id: "review",
      title: "Eignungsprüfung",
      text: "Konstruktion, Befestigung, Maße und Stromzuführung"
    },
    {
      id: "light-valance",
      title: "Neuer Leuchtvolant",
      text: "Nur der vordere Abschluss"
    }
  ],
  points: [
    {
      id: "review",
      label: "Was wir prüfen",
      text: "Befestigung, Maße und die Möglichkeit der Stromzuführung."
    },
    {
      id: "changes",
      label: "Was sich ändert",
      text:
        "Der textile Volant wird durch einen individuell gestalteten Leuchtvolant ersetzt."
    },
    {
      id: "stays",
      label: "Was bleibt",
      text: "Konstruktion, Markisentuch und Mechanik der Markise."
    }
  ]
} as const satisfies Readonly<{
  intro: Readonly<{
    eyebrow: string;
    titleLines: readonly [string, string];
    body: string;
  }>;
  sequence: readonly EligibilitySequenceStep[];
  points: readonly EligibilityPoint[];
}>;

export const variants = [
  {
    id: "compact",
    label: "Variante 01",
    title: "Kompakte Gestaltung",
    text:
      "Für eine kurze Wortmarke oder ein reduziertes Zeichen. Die Umsetzbarkeit wird am konkreten Volant geprüft."
  },
  {
    id: "wide",
    label: "Variante 02",
    title: "Breite Gestaltung",
    text:
      "Für eine längere Wortmarke, sofern Motiv, verfügbare Fläche und Einbausituation zusammenpassen."
  },
  {
    id: "structured",
    label: "Variante 03",
    title: "Gegliederte Gestaltung",
    text:
      "Für getrennte Markenelemente. Aufbau und Anordnung bleiben Teil der manuellen Projektprüfung."
  }
] as const satisfies readonly ContentCard[];

export const processSteps = [
  {
    id: "submit",
    number: "01",
    title: "Projekt einreichen",
    text:
      "Sie übermitteln Fotos, bekannte Maße, Motiv und die bereits geklärten Angaben zum Objekt."
  },
  {
    id: "review",
    number: "02",
    title: "Unterlagen sichten",
    text:
      "Die vorhandenen Informationen werden auf Vollständigkeit und erkennbare Klärungspunkte geprüft."
  },
  {
    id: "assess",
    number: "03",
    title: "Eignung einordnen",
    text:
      "Markise, Befestigung, Bewegung, Kabelweg, Stromversorgung, Zugang und Zuständigkeiten werden objektbezogen eingeordnet."
  },
  {
    id: "design",
    number: "04",
    title: "Gestaltung klären",
    text:
      "Motiv und mögliche Anordnung werden mit den bestätigten Grenzen des konkreten Projekts abgeglichen."
  },
  {
    id: "scope",
    number: "05",
    title: "Umfang abgrenzen",
    text:
      "Erforderliche Leistungen, offene Punkte und verantwortliche Parteien werden schriftlich festgehalten."
  },
  {
    id: "approve",
    number: "06",
    title: "Umsetzung freigeben",
    text:
      "Erst nach bestätigter Eignung, Gestaltung und Zuständigkeit kann die weitere Umsetzung freigegeben werden."
  }
] as const satisfies readonly ProcessStep[];

export const costDrivers = [
  "Ausführung und Anzahl der Gestaltungselemente",
  "Art und Aufwand der Motivaufbereitung",
  "Material- und Farbauswahl",
  "Erforderlicher Planungs- und Abstimmungsaufwand",
  "Lieferung und Logistik",
  "Demontage, Montage und Zugänglichkeit",
  "Kabelweg und erforderliche Elektroarbeiten",
  "Objektbezogene Unterlagen und lokale Abstimmungen"
] as const satisfies readonly string[];

export const constraints = [
  {
    id: "awning",
    label: "Markise",
    text:
      "Zustand und grundsätzliche Eignung der vorhandenen Markise müssen bestätigt werden."
  },
  {
    id: "movement",
    label: "Befestigung und Bewegung",
    text:
      "Befestigung, verfügbare Fläche und Bewegungsablauf dürfen nicht ungeklärt bleiben."
  },
  {
    id: "power",
    label: "Strom und Kabelweg",
    text:
      "Anschlussart, Kabelweg und elektrische Verantwortung werden für das konkrete Objekt festgelegt."
  },
  {
    id: "access",
    label: "Zugang",
    text:
      "Montagezugang und mögliche besondere Bedingungen müssen vor einer Freigabe bekannt sein."
  },
  {
    id: "permissions",
    label: "Objekt und Zustimmung",
    text:
      "Eigentümer-, Miet- und lokale Anforderungen werden objektbezogen geklärt."
  },
  {
    id: "responsibility",
    label: "Leistungsgrenzen",
    text:
      "Nur ausdrücklich bestätigte Leistungen und Zuständigkeiten gehören zum Projektumfang."
  }
] as const satisfies readonly Constraint[];

export const alternatives = [
  {
    id: "printed-valance",
    title: "Bedruckter Volant ohne Licht",
    suitableWhen:
      "Wenn eine textile Kennzeichnung am Tag ausreicht und Beleuchtung nicht Teil der Aufgabe ist.",
    boundary:
      "Gestaltung, Material und Befestigung bleiben auch hier objektbezogen zu prüfen."
  },
  {
    id: "separate-sign",
    title: "Separate Fassadenlösung",
    suitableWhen:
      "Wenn eine von der Markise unabhängige Licht- oder Beschriftungslösung besser zum Objekt passt.",
    boundary:
      "Befestigung, Stromversorgung und lokale Anforderungen sind gesondert zu klären."
  },
  {
    id: "new-awning",
    title: "Neue Markise",
    suitableWhen:
      "Wenn die bestehende Markise beschädigt, ungeeignet oder ohnehin vollständig zu ersetzen ist.",
    boundary:
      "Die Auswahl und Umsetzung eines neuen Gesamtsystems ist nicht Teil dieses Retrofit-Angebots."
  },
  {
    id: "retrofit",
    title: "LICHTSAUM Retrofit",
    suitableWhen:
      "Wenn eine geeignete bestehende Gewerbemarkise weitergenutzt und ihr Volant neu gestaltet werden soll.",
    boundary:
      "Die Eignung wird vor jeder weiteren Zusage manuell geprüft."
  }
] as const satisfies readonly Alternative[];

export const faqItems = [
  {
    id: "universal-fit",
    question: "Passt ein Leuchtvolant an jede Markise?",
    answer:
      "Nein. Vorgesehen ist der Austausch des vorhandenen Volants nur bei einer geeigneten bestehenden Gewerbemarkise. Entscheidend sind die Austauschbarkeit des Volants, die Befestigungsart und die Maße, ein ungehinderter Bewegungsablauf, ein sicher planbarer Kabelweg sowie eine geeignete Stromversorgung. Die Eignung wird am konkreten Objekt geprüft."
  },
  {
    id: "required-inputs",
    question: "Welche Unterlagen helfen bei der ersten Prüfung?",
    answer:
      "Für den ersten Kontakt genügt eine E-Mail-Adresse. Falls vorhanden, helfen Fotos der Markise und der Volantbefestigung, bekannte Maße, eine Logo- oder Schriftzugvorlage sowie Angaben zu Stromversorgung, Zugang und zum Zustimmungsstatus am Objekt."
  },
  {
    id: "dimensions",
    question: "Welche Maße sind für Volant und Schriftzug möglich?",
    answer:
      "Im aktuellen Konfigurator kann die Volanthöhe zwischen 200 und 300 mm gewählt werden. Die Buchstabenhöhe ist auf maximal 180 mm begrenzt. Ob der gesamte Schriftzug bei der gewählten Schriftart und Höhe in die verfügbare Breite passt, wird anhand seiner tatsächlich gemessenen Länge geprüft. Die finale technische Ausführung bleibt objektbezogen."
  },
  {
    id: "permission",
    question: "Brauche ich eine Genehmigung oder Zustimmung?",
    answer:
      "Das ist objekt- und standortabhängig. Zu prüfen sind insbesondere die erforderlichen Zustimmungen am Objekt sowie örtliche Vorgaben für Werbeanlagen. Bei denkmalgeschützten Gebäuden oder in geschützten Bereichen können zusätzliche denkmalrechtliche Anforderungen gelten."
  },
  {
    id: "electrical-work",
    question: "Wie werden Stromversorgung und elektrischer Anschluss geklärt?",
    answer:
      "Vor der Ausführung müssen Kabelweg, Einbauort und erforderlicher Schutz des Netzteils beziehungsweise LED-Treibers, Anschlussart sowie die Verantwortung für erforderliche Elektroarbeiten am konkreten Objekt festgelegt werden."
  },
  {
    id: "not-suitable",
    question: "Wann ist ein Leuchtvolant nicht die passende Lösung?",
    answer:
      "Nicht passend ist ein Leuchtvolant insbesondere, wenn der vorhandene Volant nicht separat austauschbar ist, die Markise beschädigt oder mechanisch ungeeignet ist oder kein sicherer Kabelweg möglich ist. Solange notwendige Zustimmungen oder örtliche Anforderungen ungeklärt sind, kann die Ausführung nicht freigegeben werden. Wenn keine Beleuchtung benötigt wird, kann ein bedruckter Volant genügen; muss die Markise selbst ersetzt werden, ist ein neues Markisensystem zu prüfen."
  }
] as const satisfies readonly FaqItem[];

export const evidenceMessages = {
  intro: {
    eyebrow: "Nachweise",
    title: "Erst prüfen, dann veröffentlichen.",
    body:
      "Objektive Aussagen werden erst übernommen, wenn Quelle, Verantwortlichkeit und zulässige Formulierung bestätigt sind."
  },
  messages: [
    {
      id: "system",
      label: "Produkt- und Systemfreigabe",
      text: "TBD · Nachweise und zulässige öffentliche Aussagen sind noch zu bestätigen."
    },
    {
      id: "scope",
      label: "Leistungsumfang",
      text: "TBD · Leistungen und verantwortliche Parteien werden vor Veröffentlichung festgelegt."
    },
    {
      id: "visuals",
      label: "Bildmaterial",
      text: "TBD · Herkunft, Aussagekraft und Nutzungsrechte müssen dokumentiert sein."
    },
    {
      id: "identity",
      label: "Unternehmens- und Kontaktdaten",
      text: "TBD · Nur bestätigte reale Angaben dürfen öffentlich erscheinen."
    }
  ],
  placeholder:
    "Dieser Bereich bleibt als gekennzeichneter Konzeptstand bestehen, bis die erforderlichen Nachweise vorliegen."
} as const satisfies Readonly<{
  intro: LandingSectionIntro;
  messages: readonly StatusMessage[];
  placeholder: string;
}>;
