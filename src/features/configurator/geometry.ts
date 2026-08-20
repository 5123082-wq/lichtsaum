import { CONFIGURATOR_CONSTRAINTS } from "@/features/configurator/options";
import type {
  ConfiguratorConfigurationV1,
  ConfiguratorGeometry,
  ConfiguratorGeometryIssue,
  ConfiguratorTextMeasurement
} from "@/features/configurator/types";

export function evaluateConfiguratorGeometry(
  configuration: ConfiguratorConfigurationV1,
  measurement: ConfiguratorTextMeasurement
): ConfiguratorGeometry {
  const safeMarginMm = Math.min(
    configuration.valanceWidthMm * 0.1,
    Math.max(20, configuration.valanceWidthMm * 0.04)
  );
  const availableWidthMm = Math.max(
    0,
    configuration.valanceWidthMm - safeMarginMm * 2
  );
  const hasLeftLogo = configuration.compositionMode !== "text-only";
  const hasRightLogo = configuration.compositionMode === "logo-both";
  const hasLogo = hasLeftLogo || hasRightLogo;
  const logoSizeMm = hasLogo ? configuration.letterHeightMm : 0;
  const logoGapMm = hasLogo
    ? Math.max(20, configuration.letterHeightMm * 0.3)
    : 0;
  const textStartMm =
    (configuration.valanceWidthMm - measurement.widthMm) / 2;
  const textEndMm = textStartMm + measurement.widthMm;
  const leftLogoStartMm = safeMarginMm;
  const leftLogoEndMm = leftLogoStartMm + logoSizeMm;
  const rightLogoEndMm = configuration.valanceWidthMm - safeMarginMm;
  const rightLogoStartMm = rightLogoEndMm - logoSizeMm;
  const availableTextStartMm = hasLeftLogo
    ? leftLogoEndMm + logoGapMm
    : safeMarginMm;
  const availableTextEndMm = hasRightLogo
    ? rightLogoStartMm - logoGapMm
    : configuration.valanceWidthMm - safeMarginMm;
  const logoCentersMm = [
    ...(hasLeftLogo ? [leftLogoStartMm + logoSizeMm / 2] : []),
    ...(hasRightLogo ? [rightLogoStartMm + logoSizeMm / 2] : [])
  ];
  const compositionStartMm = hasLeftLogo ? leftLogoStartMm : textStartMm;
  const compositionEndMm = hasRightLogo ? rightLogoEndMm : textEndMm;
  const lightSegmentLengthsMm = [
    ...(hasLeftLogo ? [logoSizeMm] : []),
    measurement.widthMm,
    ...(hasRightLogo ? [logoSizeMm] : [])
  ];
  const issues: ConfiguratorGeometryIssue[] = [];

  if (
    !Number.isSafeInteger(configuration.valanceWidthMm) ||
    configuration.valanceWidthMm <
      CONFIGURATOR_CONSTRAINTS.valanceWidthMm.min
  ) {
    issues.push("VALANCE_WIDTH_OUT_OF_RANGE");
  }

  if (
    !Number.isSafeInteger(configuration.valanceHeightMm) ||
    configuration.valanceHeightMm <
      CONFIGURATOR_CONSTRAINTS.valanceHeightMm.min ||
    configuration.valanceHeightMm >
      CONFIGURATOR_CONSTRAINTS.valanceHeightMm.max
  ) {
    issues.push("VALANCE_HEIGHT_OUT_OF_RANGE");
  }

  if (
    !Number.isSafeInteger(configuration.letterHeightMm) ||
    configuration.letterHeightMm <
      CONFIGURATOR_CONSTRAINTS.letterHeightMm.min ||
    configuration.letterHeightMm >
      CONFIGURATOR_CONSTRAINTS.letterHeightMm.max
  ) {
    issues.push("LETTER_HEIGHT_OUT_OF_RANGE");
  }

  if (
    measurement.text !== configuration.text ||
    measurement.fontId !== configuration.fontId ||
    measurement.visibleHeightMm !== configuration.letterHeightMm
  ) {
    issues.push("TEXT_MEASUREMENT_MISMATCH");
  }

  if (
    !Number.isFinite(measurement.widthMm) ||
    measurement.widthMm <= 0 ||
    textStartMm < availableTextStartMm ||
    textEndMm > availableTextEndMm
  ) {
    issues.push("COMPOSITION_TOO_WIDE");
  }

  return {
    safeMarginMm,
    availableWidthMm,
    compositionWidthMm: compositionEndMm - compositionStartMm,
    compositionStartMm,
    compositionEndMm,
    textStartMm,
    textCenterMm: textStartMm + measurement.widthMm / 2,
    textBaselineMm:
      configuration.valanceHeightMm / 2 + measurement.baselineOffsetMm,
    logoCentersMm,
    logoSizeMm,
    logoGapMm,
    lightSegmentLengthsMm,
    issues
  };
}
