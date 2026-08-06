import {
  MINI_CONFIGURATOR_CONSTRAINTS,
  isWithinMiniConfiguratorConstraint
} from "@/features/mini-configurator/constraints";
import type {
  MiniConfiguratorConfig,
  MiniConfiguratorGeometry,
  MiniConfiguratorGeometryIssue,
  MiniConfiguratorTextMeasurement
} from "@/features/mini-configurator/types";

export function evaluateMiniConfiguratorGeometry(
  configuration: MiniConfiguratorConfig,
  measurement: MiniConfiguratorTextMeasurement
): MiniConfiguratorGeometry {
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
  const compositionStartMm = hasLeftLogo
    ? leftLogoStartMm
    : textStartMm;
  const compositionEndMm = hasRightLogo
    ? rightLogoEndMm
    : textEndMm;
  const compositionWidthMm = compositionEndMm - compositionStartMm;
  const issues: MiniConfiguratorGeometryIssue[] = [];

  if (
    !isWithinMiniConfiguratorConstraint(
      configuration.valanceHeightMm,
      MINI_CONFIGURATOR_CONSTRAINTS.valanceHeightMm
    )
  ) {
    issues.push("VALANCE_HEIGHT_OUT_OF_RANGE");
  }

  if (
    !isWithinMiniConfiguratorConstraint(
      configuration.letterHeightMm,
      MINI_CONFIGURATOR_CONSTRAINTS.letterHeightMm
    )
  ) {
    issues.push("LETTERS_TOO_TALL");
  }

  if (
    textStartMm < availableTextStartMm ||
    textEndMm > availableTextEndMm
  ) {
    issues.push("COMPOSITION_TOO_WIDE");
  }

  return {
    safeMarginMm,
    availableWidthMm,
    compositionWidthMm,
    compositionStartMm,
    textStartMm,
    textCenterMm: textStartMm + measurement.widthMm / 2,
    textBaselineMm:
      configuration.valanceHeightMm / 2 + measurement.baselineOffsetMm,
    logoCentersMm,
    logoSizeMm,
    logoGapMm,
    issues
  };
}
