import type { ConfiguratorTechnicalSection } from "@/features/configurator/types";

const configuratorTechnicalSections: readonly ConfiguratorTechnicalSection[] = [
  {
    title: "Was der Konfigurator berechnet",
    intro:
      "Der Konfigurator bildet einen Leuchtvolant mit den gewählten Maßen, dem Schriftzug, der Komposition sowie Volant- und Lichtfarbe ab. Aus der vollständigen beleuchteten Komposition ermittelt er die benötigte Lichtlänge und eine passende Verteilung der Lichtfelder. Auf Grundlage der eingegebenen Maße und der ermittelten Lichtfelder berechnet das System einen vorläufigen Nettopreis.",
    claimIds: ["CLM-016", "CLM-028", "CLM-029"]
  },
  {
    title: "Was der vorläufige Nettopreis nicht umfasst",
    intro:
      "Der angezeigte Betrag gilt ausschließlich für gewerbliche Projekte und versteht sich zuzüglich gesetzlicher Umsatzsteuer. Gewählte Dienstleistungen – Gestaltung, Lieferung, Aufmaß, Demontage des alten Volants, Montage des neuen Volants und Elektroanschluss – werden manuell kalkuliert und sind nicht enthalten. Der vorläufige Nettopreis ist kein verbindliches Angebot.",
    claimIds: ["CLM-029"]
  },
  {
    title: "Warum der Projekt-Check folgt",
    intro:
      "Konfiguration, Preis und Eignung beantworten drei unterschiedliche Fragen. Die Konfiguration hält die gewählte Ausführung fest. Der angezeigte Betrag ist ein vorläufiges Rechenergebnis unter den genannten Bedingungen. Ob die bestehende Gewerbemarkise für den Austausch des Volants geeignet ist und welche Leistungen erforderlich sind, wird erst am konkreten Objekt manuell geprüft. Deshalb folgt auf den Online-Konfigurator der Projekt-Check.",
    links: [
      {
        href: "/#eignung",
        label: "Eignung bestehender Gewerbemarkisen einordnen"
      },
      {
        href: "/referenzen",
        label: "Beispiele für Leuchtvolants ansehen"
      }
    ],
    claimIds: ["CLM-013", "CLM-020", "CLM-029"]
  }
];

export const configuratorPageContent = {
  eyebrow: "Konfigurator",
  title: "Leuchtvolant konfigurieren",
  metadataTitle: "Leuchtvolant konfigurieren: vorläufiger Preis",
  description:
    "Leuchtvolant für eine bestehende Gewerbemarkise konfigurieren, vorläufigen Nettopreis erhalten und das konkrete Projekt anschließend prüfen lassen.",
  technicalSections: configuratorTechnicalSections
} as const;

export function hasTechnicalSectionContent(
  section: ConfiguratorTechnicalSection
) {
  return Boolean(
    section.intro?.trim() ||
      section.specRows?.length ||
      section.notes?.some((note) => note.trim()) ||
      section.links?.some((link) => link.label.trim())
  );
}
