import "server-only";

import { z } from "zod";

import { calculateConfiguratorAuthoritatively } from "@/features/configurator/server-calculation";
import type {
  ConfiguratorAuthoritativeResult,
  ConfiguratorCalculation
} from "@/features/configurator/types";
import { configuratorProjectSelectionSchema } from "@/features/configurator/validation";

import {
  CONFIGURATOR_PROJECT_SNAPSHOT_SCHEMA_VERSION,
  type ConfiguratorProjectSnapshot,
  type LeadRequestContext
} from "./request-context";

const configuratorProjectSubmissionSchema =
  configuratorProjectSelectionSchema.extend({
    confirmedPricingVersion: z.string().trim().min(1).max(64)
  });

export type ConfiguratorPricingChangedResult = Readonly<{
  kind: "pricing_changed";
  pricingVersion: string;
  calculation: ConfiguratorCalculation;
}>;

export type PreparedConfiguratorProjectContext =
  | Readonly<{ kind: "absent" }>
  | Readonly<{ kind: "ready"; requestContext: LeadRequestContext }>
  | Readonly<{ kind: "invalid"; message: string }>
  | Readonly<{ kind: "unavailable" }>
  | ConfiguratorPricingChangedResult;

export async function prepareConfiguratorProjectContext(
  input: unknown
): Promise<PreparedConfiguratorProjectContext> {
  if (input === undefined) {
    return { kind: "absent" };
  }

  const parsed = configuratorProjectSubmissionSchema.safeParse(input);

  if (!parsed.success) {
    return {
      kind: "invalid",
      message: "Die angehängte Konfiguration ist nicht gültig."
    };
  }

  const { confirmedPricingVersion, configuration, services, postalCode } =
    parsed.data;
  let authoritativeResult: ConfiguratorAuthoritativeResult;

  try {
    authoritativeResult = await calculateConfiguratorAuthoritatively(
      configuration,
      confirmedPricingVersion
    );
  } catch {
    return { kind: "unavailable" };
  }

  if (authoritativeResult.status === "pricing-changed") {
    return {
      kind: "pricing_changed",
      pricingVersion: authoritativeResult.calculation.pricingVersion,
      calculation: authoritativeResult.calculation
    };
  }

  if (authoritativeResult.status === "invalid") {
    return {
      kind: "invalid",
      message: "Die angehängte Konfiguration konnte nicht berechnet werden."
    };
  }

  if (authoritativeResult.status === "unavailable") {
    return { kind: "unavailable" };
  }

  const requestContext: ConfiguratorProjectSnapshot = {
    schemaVersion: CONFIGURATOR_PROJECT_SNAPSHOT_SCHEMA_VERSION,
    origin: "full_configurator",
    evaluation: "valid",
    configuration,
    services,
    ...(postalCode ? { postalCode } : {}),
    calculation: authoritativeResult.calculation,
    pricingVersion: authoritativeResult.calculation.pricingVersion,
    netTotalCents: authoritativeResult.calculation.netTotalCents
  };

  return { kind: "ready", requestContext };
}
