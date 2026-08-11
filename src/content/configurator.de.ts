import type { ConfiguratorTechnicalSection } from "@/features/configurator/types";

export const configuratorPageContent = {
  eyebrow: "Konfigurator",
  title: "Leuchtvolant konfigurieren.",
  description:
    "Leuchtvolant für ein gewerbliches Projekt konfigurieren und einen vorläufigen Nettopreis mit anschließendem Projekt-Check erhalten.",
  intro:
    "Stellen Sie Maße, Schrift und Gestaltung für Ihr gewerbliches Projekt zusammen. Der Rechner prüft die eingegebene Komposition und zeigt eine vorläufige Netto-Kalkulation.",
  explanation:
    "Die Darstellung ist schematisch. Gewählte Dienstleistungen werden für die manuelle Projektprüfung vorgemerkt und verändern den angezeigten Preis nicht.",
  technicalSections: [] as readonly ConfiguratorTechnicalSection[]
} as const;

export function hasTechnicalSectionContent(
  section: ConfiguratorTechnicalSection
) {
  return Boolean(
    section.intro?.trim() ||
      section.specRows?.length ||
      section.notes?.some((note) => note.trim())
  );
}
