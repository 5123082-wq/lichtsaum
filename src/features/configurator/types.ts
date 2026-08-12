import type {
  MINI_CONFIGURATOR_AWNING_COLORS,
  MINI_CONFIGURATOR_FONTS,
  MINI_CONFIGURATOR_LIGHT_COLORS
} from "@/features/mini-configurator/options";
import type { MiniConfiguratorCompositionMode } from "@/features/mini-configurator/types";

export const CONFIGURATOR_SCHEMA_VERSION = 1 as const;
export const CONFIGURATOR_STORAGE_VERSION = 1 as const;

export type ConfiguratorCompositionMode = MiniConfiguratorCompositionMode;
export type ConfiguratorFontId =
  (typeof MINI_CONFIGURATOR_FONTS)[number]["id"];
export type ConfiguratorAwningColorId =
  (typeof MINI_CONFIGURATOR_AWNING_COLORS)[number]["id"];
export type ConfiguratorLightColorId =
  (typeof MINI_CONFIGURATOR_LIGHT_COLORS)[number]["id"];

export type ConfiguratorServiceId =
  | "design"
  | "delivery"
  | "site-measurement"
  | "old-valance-removal"
  | "new-valance-installation"
  | "electrical-connection";

export type ConfiguratorConfigurationV1 = Readonly<{
  schemaVersion: typeof CONFIGURATOR_SCHEMA_VERSION;
  compositionMode: ConfiguratorCompositionMode;
  text: string;
  fontId: ConfiguratorFontId;
  valanceWidthMm: number;
  valanceHeightMm: number;
  letterHeightMm: number;
  awningColorId: ConfiguratorAwningColorId;
  lightColorId: ConfiguratorLightColorId;
}>;

export type ConfiguratorProjectSelection = Readonly<{
  configuration: ConfiguratorConfigurationV1;
  services: readonly ConfiguratorServiceId[];
  postalCode?: string;
}>;

export type ConfiguratorStoredSelection = Readonly<{
  configuration: ConfiguratorConfigurationV1;
  services: readonly ConfiguratorServiceId[];
}>;

export type ConfiguratorStoredStateV1 = Readonly<{
  version: typeof CONFIGURATOR_STORAGE_VERSION;
  configuration: ConfiguratorConfigurationV1;
  services: readonly ConfiguratorServiceId[];
}>;

export type ConfiguratorFont = Readonly<{
  id: ConfiguratorFontId;
  label: string;
  direction: string;
  family: string;
  source: string;
  weight: "400";
}>;

export type ConfiguratorTextMeasurement = Readonly<{
  text: string;
  fontId: ConfiguratorFontId;
  visibleHeightMm: number;
  widthMm: number;
  svgFontSizeMm: number;
  baselineOffsetMm: number;
}>;

export type ConfiguratorGeometryIssue =
  | "VALANCE_WIDTH_OUT_OF_RANGE"
  | "VALANCE_HEIGHT_OUT_OF_RANGE"
  | "LETTER_HEIGHT_OUT_OF_RANGE"
  | "TEXT_MEASUREMENT_MISMATCH"
  | "COMPOSITION_TOO_WIDE";

export type ConfiguratorGeometry = Readonly<{
  safeMarginMm: number;
  availableWidthMm: number;
  compositionWidthMm: number;
  compositionStartMm: number;
  compositionEndMm: number;
  textStartMm: number;
  textCenterMm: number;
  textBaselineMm: number;
  logoCentersMm: readonly number[];
  logoSizeMm: number;
  logoGapMm: number;
  issues: readonly ConfiguratorGeometryIssue[];
}>;

export type ConfiguratorPanelCounts = Readonly<{
  600: number;
  1000: number;
  1200: number;
}>;

export type ConfiguratorPanelAllocation = Readonly<{
  requiredLengthMm: number;
  totalLengthMm: number;
  wasteMm: number;
  panelCount: number;
  counts: ConfiguratorPanelCounts;
}>;

export type ConfiguratorCalculation = Readonly<{
  pricingVersion: string;
  netTotalCents: number;
  measurement: ConfiguratorTextMeasurement;
  geometry: ConfiguratorGeometry;
  panelAllocation: ConfiguratorPanelAllocation;
}>;

export type ConfiguratorCalculationIssueCode =
  | "INVALID_CONFIGURATION"
  | "UNSUPPORTED_GLYPH"
  | "FONT_MEASUREMENT_FAILED"
  | "VALANCE_WIDTH_OUT_OF_RANGE"
  | "VALANCE_HEIGHT_OUT_OF_RANGE"
  | "LETTER_HEIGHT_OUT_OF_RANGE"
  | "TEXT_MEASUREMENT_MISMATCH"
  | "COMPOSITION_TOO_WIDE"
  | "CALCULATION_OVERFLOW";

export type ConfiguratorCalculationIssue = Readonly<{
  code: ConfiguratorCalculationIssueCode;
  path?: string;
}>;

export type ConfiguratorAuthoritativeResult =
  | Readonly<{
      status: "ok";
      calculation: ConfiguratorCalculation;
    }>
  | Readonly<{
      status: "pricing-changed";
      confirmedPricingVersion: string;
      calculation: ConfiguratorCalculation;
    }>
  | Readonly<{
      status: "invalid";
      issues: readonly ConfiguratorCalculationIssue[];
    }>
  | Readonly<{
      status: "unavailable";
      issues: readonly ConfiguratorCalculationIssue[];
    }>;

export type ConfiguratorTechnicalSpecRow = Readonly<{
  label: string;
  value: string;
}>;

export type ConfiguratorTechnicalSection = Readonly<{
  title: string;
  intro?: string;
  specRows?: readonly ConfiguratorTechnicalSpecRow[];
  notes?: readonly string[];
  claimIds?: readonly string[];
}>;
