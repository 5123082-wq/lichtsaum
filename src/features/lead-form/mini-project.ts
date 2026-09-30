import {
  MINI_CONFIGURATOR_AWNING_COLORS,
  MINI_CONFIGURATOR_COMPOSITION_MODES,
  MINI_CONFIGURATOR_FONTS,
  MINI_CONFIGURATOR_LIGHT_COLORS,
  MINI_CONFIGURATOR_PREVIEW_MODES
} from "@/features/mini-configurator/options";
import type { MiniProjectConfiguration } from "./request-context";

const labels = new Map<string, string>([
  ...MINI_CONFIGURATOR_AWNING_COLORS, ...MINI_CONFIGURATOR_COMPOSITION_MODES,
  ...MINI_CONFIGURATOR_FONTS, ...MINI_CONFIGURATOR_LIGHT_COLORS,
  ...MINI_CONFIGURATOR_PREVIEW_MODES
].map((option) => [option.id, option.label]));

export function miniProjectRows(configuration: MiniProjectConfiguration): [string, string][] {
  const size = (value: number | undefined) => value === undefined ? "Noch nicht angegeben" : `${value} mm`;
  return [
    ["Beschriftung", configuration.text.trim() || "Noch nicht angegeben"],
    ["Schrift", labels.get(configuration.fontId) ?? configuration.fontId],
    ["Komposition", labels.get(configuration.compositionMode) ?? configuration.compositionMode],
    ["Volantbreite", size(configuration.valanceWidthMm)],
    ["Volanthöhe", size(configuration.valanceHeightMm)],
    ["Buchstabenhöhe", size(configuration.letterHeightMm)],
    ["Volantfarbe", labels.get(configuration.awningColorId) ?? configuration.awningColorId],
    ["Lichtfarbe", labels.get(configuration.lightColorId) ?? configuration.lightColorId],
    ["Ansicht", labels.get(configuration.previewMode) ?? configuration.previewMode]
  ];
}
