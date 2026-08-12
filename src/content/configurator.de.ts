import type { ConfiguratorTechnicalSection } from "@/features/configurator/types";

export const configuratorPageContent = {
  eyebrow: "Konfigurator",
  title: "Leuchtvolant konfigurieren",
  description:
    "Leuchtvolant für Ihr Projekt konfigurieren und einen vorläufigen Nettopreis mit anschließendem Projekt-Check erhalten.",
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
