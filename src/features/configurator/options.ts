import {
  DEFAULT_MINI_CONFIGURATOR_CONFIG,
  MINI_CONFIGURATOR_AWNING_COLORS,
  MINI_CONFIGURATOR_COMPOSITION_MODES,
  MINI_CONFIGURATOR_FONTS,
  MINI_CONFIGURATOR_LIGHT_COLORS,
  SUPPORTED_MINI_CONFIGURATOR_TEXT
} from "@/features/mini-configurator/options";
import { MINI_CONFIGURATOR_CONSTRAINTS } from "@/features/mini-configurator/constraints";
import type {
  ConfiguratorConfigurationV1,
  ConfiguratorServiceId
} from "@/features/configurator/types";
import { CONFIGURATOR_SCHEMA_VERSION } from "@/features/configurator/types";

// The full tool and homepage teaser intentionally share one visual-option
// registry. Their state envelopes and calculation behavior remain separate.
export const CONFIGURATOR_FONTS = MINI_CONFIGURATOR_FONTS;
export const CONFIGURATOR_COMPOSITION_MODES =
  MINI_CONFIGURATOR_COMPOSITION_MODES;
export const CONFIGURATOR_AWNING_COLORS = MINI_CONFIGURATOR_AWNING_COLORS;
export const CONFIGURATOR_LIGHT_COLORS = MINI_CONFIGURATOR_LIGHT_COLORS;
export const CONFIGURATOR_CONSTRAINTS = MINI_CONFIGURATOR_CONSTRAINTS;
export const SUPPORTED_CONFIGURATOR_TEXT = SUPPORTED_MINI_CONFIGURATOR_TEXT;

export const CONFIGURATOR_SERVICES = [
  { id: "design", label: "Gestaltung" },
  { id: "delivery", label: "Lieferung" },
  { id: "site-measurement", label: "Aufmaß" },
  { id: "old-valance-removal", label: "Demontage des alten Volants" },
  { id: "new-valance-installation", label: "Montage des neuen Volants" },
  { id: "electrical-connection", label: "Elektroanschluss" }
] as const satisfies ReadonlyArray<{
  id: ConfiguratorServiceId;
  label: string;
}>;

export const DEFAULT_CONFIGURATOR_CONFIGURATION: ConfiguratorConfigurationV1 = {
  schemaVersion: CONFIGURATOR_SCHEMA_VERSION,
  compositionMode: DEFAULT_MINI_CONFIGURATOR_CONFIG.compositionMode,
  text: DEFAULT_MINI_CONFIGURATOR_CONFIG.text,
  fontId: DEFAULT_MINI_CONFIGURATOR_CONFIG.fontId as ConfiguratorConfigurationV1["fontId"],
  valanceWidthMm: DEFAULT_MINI_CONFIGURATOR_CONFIG.valanceWidthMm,
  valanceHeightMm: DEFAULT_MINI_CONFIGURATOR_CONFIG.valanceHeightMm,
  letterHeightMm: DEFAULT_MINI_CONFIGURATOR_CONFIG.letterHeightMm,
  awningColorId:
    DEFAULT_MINI_CONFIGURATOR_CONFIG.awningColorId as ConfiguratorConfigurationV1["awningColorId"],
  lightColorId:
    DEFAULT_MINI_CONFIGURATOR_CONFIG.lightColorId as ConfiguratorConfigurationV1["lightColorId"]
};
