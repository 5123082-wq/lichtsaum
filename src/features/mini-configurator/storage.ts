import {
  MINI_CONFIGURATOR_CONSTRAINTS,
  isWithinMiniConfiguratorConstraint
} from "@/features/mini-configurator/constraints";
import {
  MINI_CONFIGURATOR_AWNING_COLORS,
  MINI_CONFIGURATOR_COMPOSITION_MODES,
  MINI_CONFIGURATOR_FONTS,
  MINI_CONFIGURATOR_LIGHT_COLORS,
  MINI_CONFIGURATOR_PREVIEW_MODES
} from "@/features/mini-configurator/options";
import {
  MINI_CONFIGURATOR_STATE_VERSION,
  type MiniConfiguratorConfig,
  type MiniConfiguratorStoredState
} from "@/features/mini-configurator/types";

export const MINI_CONFIGURATOR_STORAGE_KEY =
  "lichtsaum:mini-configurator:v2";

const compositionModeIds = new Set<string>(
  MINI_CONFIGURATOR_COMPOSITION_MODES.map((option) => option.id)
);
const fontIds = new Set<string>(
  MINI_CONFIGURATOR_FONTS.map((option) => option.id)
);
const awningColorIds = new Set<string>(
  MINI_CONFIGURATOR_AWNING_COLORS.map((option) => option.id)
);
const lightColorIds = new Set<string>(
  MINI_CONFIGURATOR_LIGHT_COLORS.map((option) => option.id)
);
const previewModeIds = new Set<string>(
  MINI_CONFIGURATOR_PREVIEW_MODES.map((option) => option.id)
);

export function isMiniConfiguratorConfig(
  value: unknown
): value is MiniConfiguratorConfig {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.text === "string" &&
    candidate.text.length <= 60 &&
    typeof candidate.compositionMode === "string" &&
    compositionModeIds.has(
      candidate.compositionMode as MiniConfiguratorConfig["compositionMode"]
    ) &&
    typeof candidate.fontId === "string" &&
    fontIds.has(candidate.fontId) &&
    isWithinMiniConfiguratorConstraint(
      candidate.valanceWidthMm,
      MINI_CONFIGURATOR_CONSTRAINTS.valanceWidthMm
    ) &&
    isWithinMiniConfiguratorConstraint(
      candidate.valanceHeightMm,
      MINI_CONFIGURATOR_CONSTRAINTS.valanceHeightMm
    ) &&
    isWithinMiniConfiguratorConstraint(
      candidate.letterHeightMm,
      MINI_CONFIGURATOR_CONSTRAINTS.letterHeightMm
    ) &&
    typeof candidate.awningColorId === "string" &&
    awningColorIds.has(candidate.awningColorId) &&
    typeof candidate.lightColorId === "string" &&
    lightColorIds.has(candidate.lightColorId) &&
    typeof candidate.previewMode === "string" &&
    previewModeIds.has(
      candidate.previewMode as MiniConfiguratorConfig["previewMode"]
    )
  );
}

export function parseMiniConfiguratorStoredState(
  rawValue: string | null
): MiniConfiguratorConfig | null {
  if (!rawValue) {
    return null;
  }

  try {
    const storedState = JSON.parse(rawValue) as Partial<MiniConfiguratorStoredState>;

    if (
      storedState.version !== MINI_CONFIGURATOR_STATE_VERSION ||
      !isMiniConfiguratorConfig(storedState.configuration)
    ) {
      return null;
    }

    return storedState.configuration;
  } catch {
    return null;
  }
}

export function writeMiniConfiguratorStoredState(
  storage: Pick<Storage, "setItem">,
  configuration: MiniConfiguratorConfig
) {
  const storedState: MiniConfiguratorStoredState = {
    version: MINI_CONFIGURATOR_STATE_VERSION,
    configuration
  };

  storage.setItem(MINI_CONFIGURATOR_STORAGE_KEY, JSON.stringify(storedState));
}
