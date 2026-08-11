"use server";

import { calculateConfiguratorAuthoritatively } from "@/features/configurator/server-calculation";
import type { ConfiguratorAuthoritativeResult } from "@/features/configurator/types";

export async function calculateConfigurator(
  rawConfiguration: unknown,
  confirmedPricingVersion?: string | null
): Promise<ConfiguratorAuthoritativeResult> {
  return calculateConfiguratorAuthoritatively(
    rawConfiguration,
    confirmedPricingVersion
  );
}
