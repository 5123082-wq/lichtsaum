export const MINI_CONFIGURATOR_STATE_VERSION = 2 as const;

export type MiniConfiguratorCompositionMode =
  | "text-only"
  | "logo-left"
  | "logo-both";

export type MiniConfiguratorPreviewMode = "day" | "night";

export type MiniConfiguratorConfig = Readonly<{
  compositionMode: MiniConfiguratorCompositionMode;
  text: string;
  fontId: string;
  valanceWidthMm: number;
  valanceHeightMm: number;
  letterHeightMm: number;
  awningColorId: string;
  lightColorId: string;
  previewMode: MiniConfiguratorPreviewMode;
}>;

export type MiniConfiguratorStoredState = Readonly<{
  version: typeof MINI_CONFIGURATOR_STATE_VERSION;
  configuration: MiniConfiguratorConfig;
}>;

export type MiniConfiguratorFont = Readonly<{
  id: string;
  label: string;
  direction: string;
  family: string;
  source: string;
  weight: string;
}>;

export type MiniConfiguratorTextMeasurement = Readonly<{
  text: string;
  fontId: string;
  visibleHeightMm: number;
  widthMm: number;
  svgFontSizeMm: number;
  baselineOffsetMm: number;
}>;

export type MiniConfiguratorGeometryIssue =
  | "VALANCE_HEIGHT_OUT_OF_RANGE"
  | "LETTERS_TOO_TALL"
  | "COMPOSITION_TOO_WIDE";

export type MiniConfiguratorGeometry = Readonly<{
  safeMarginMm: number;
  availableWidthMm: number;
  compositionWidthMm: number;
  compositionStartMm: number;
  textStartMm: number;
  textCenterMm: number;
  textBaselineMm: number;
  logoCentersMm: readonly number[];
  logoSizeMm: number;
  logoGapMm: number;
  issues: readonly MiniConfiguratorGeometryIssue[];
}>;
