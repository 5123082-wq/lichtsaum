import "server-only";

import { evaluateConfiguratorGeometry } from "@/features/configurator/geometry";
import {
  CONFIGURATOR_PRICING_VERSION,
  calculateConfiguratorNet
} from "@/features/configurator/pricing";
import { measureConfiguratorTextOnServer } from "@/features/configurator/server-font-metrics";
import type {
  ConfiguratorAuthoritativeResult,
  ConfiguratorCalculationIssue,
  ConfiguratorGeometryIssue
} from "@/features/configurator/types";
import {
  getConfiguratorValidationIssuePaths,
  parseConfiguratorConfiguration
} from "@/features/configurator/validation";

function invalidConfigurationResult(
  rawConfiguration: unknown
): ConfiguratorAuthoritativeResult {
  const paths = getConfiguratorValidationIssuePaths(rawConfiguration);
  const issues: ConfiguratorCalculationIssue[] =
    paths.length === 0
      ? [{ code: "INVALID_CONFIGURATION" }]
      : paths.map((path) => ({
          code: "INVALID_CONFIGURATION",
          ...(path ? { path } : {})
        }));

  return { status: "invalid", issues };
}

function geometryIssue(
  code: ConfiguratorGeometryIssue
): ConfiguratorCalculationIssue {
  return { code };
}

export async function calculateConfiguratorAuthoritatively(
  rawConfiguration: unknown,
  confirmedPricingVersion?: string | null
): Promise<ConfiguratorAuthoritativeResult> {
  if (
    confirmedPricingVersion !== undefined &&
    confirmedPricingVersion !== null &&
    typeof confirmedPricingVersion !== "string"
  ) {
    return {
      status: "invalid",
      issues: [
        { code: "INVALID_CONFIGURATION", path: "confirmedPricingVersion" }
      ]
    };
  }

  const configuration = parseConfiguratorConfiguration(rawConfiguration);

  if (!configuration) {
    return invalidConfigurationResult(rawConfiguration);
  }

  const measurementResult = measureConfiguratorTextOnServer(configuration);

  if (measurementResult.status === "unsupported-glyph") {
    return {
      status: "invalid",
      issues: [{ code: "UNSUPPORTED_GLYPH", path: "text" }]
    };
  }

  if (measurementResult.status === "failed") {
    return {
      status: "unavailable",
      issues: [{ code: "FONT_MEASUREMENT_FAILED" }]
    };
  }

  const geometry = evaluateConfiguratorGeometry(
    configuration,
    measurementResult.measurement
  );

  if (geometry.issues.length > 0) {
    return {
      status: "invalid",
      issues: geometry.issues.map(geometryIssue)
    };
  }

  const pricedCalculation = calculateConfiguratorNet(
    configuration.valanceWidthMm,
    geometry.compositionWidthMm
  );

  if (!pricedCalculation) {
    return {
      status: "invalid",
      issues: [{ code: "CALCULATION_OVERFLOW" }]
    };
  }

  const calculation = {
    pricingVersion: CONFIGURATOR_PRICING_VERSION,
    netTotalCents: pricedCalculation.netTotalCents,
    measurement: measurementResult.measurement,
    geometry,
    panelAllocation: pricedCalculation.panelAllocation
  } as const;

  if (
    confirmedPricingVersion !== undefined &&
    confirmedPricingVersion !== null &&
    confirmedPricingVersion !== CONFIGURATOR_PRICING_VERSION
  ) {
    return {
      status: "pricing-changed",
      confirmedPricingVersion,
      calculation
    };
  }

  return { status: "ok", calculation };
}
