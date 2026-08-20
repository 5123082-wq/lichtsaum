import "server-only";

import type {
  ConfiguratorPanelAllocation,
  ConfiguratorPanelCounts
} from "@/features/configurator/types";

export const CONFIGURATOR_PRICING_VERSION = "2026-08-20.v4" as const;
// Keep the commercial coefficients server-only. They must never be exposed as
// part of the client-facing calculation result.
export const CONFIGURATOR_ELECTRICAL_MARKUP_PERCENT = 25 as const;
export const CONFIGURATOR_VALANCE_MARKUP_PERCENT = 25 as const;
export const CONFIGURATOR_PANEL_MARKUP_PERCENT = 100 as const;

const ELECTRICAL_SET_CENTS = 10_000;
const FINISHED_VALANCE_CENTS_PER_MM = 4;

const PANEL_CATALOG = [
  { lengthMm: 600, costCents: 15_000 },
  { lengthMm: 1000, costCents: 20_000 },
  { lengthMm: 1200, costCents: 25_000 }
] as const;

function roundMillimeters(value: number): number {
  return Math.round(value * 1_000_000) / 1_000_000;
}

export type ConfiguratorPricedPanelAllocation = Readonly<{
  allocation: ConfiguratorPanelAllocation;
  panelCostCents: number;
}>;

export type ConfiguratorNetCalculation = Readonly<{
  netTotalCents: number;
  panelAllocation: ConfiguratorPanelAllocation;
}>;

export function selectOptimalPanelAllocation(
  requiredLengthMm: number
): ConfiguratorPricedPanelAllocation | null {
  if (
    !Number.isFinite(requiredLengthMm) ||
    requiredLengthMm <= 0 ||
    requiredLengthMm > Number.MAX_SAFE_INTEGER
  ) {
    return null;
  }

  const maximumPanelCount = Math.ceil(requiredLengthMm / PANEL_CATALOG[0].lengthMm);

  for (let panelCount = 1; panelCount <= maximumPanelCount; panelCount += 1) {
    // Prefer one complete panel, then two equal panels, then three equal
    // panels, etc. Within that count, use the smallest panel size that fits.
    const panel = PANEL_CATALOG.find(
      (candidate) => panelCount * candidate.lengthMm >= requiredLengthMm
    );

    if (!panel) {
      continue;
    }

    const totalLengthMm = panelCount * panel.lengthMm;
    const panelCostCents = panelCount * panel.costCents;

    if (
      !Number.isSafeInteger(totalLengthMm) ||
      !Number.isSafeInteger(panelCostCents)
    ) {
      return null;
    }

    const counts: ConfiguratorPanelCounts = {
      600: panel.lengthMm === 600 ? panelCount : 0,
      1000: panel.lengthMm === 1000 ? panelCount : 0,
      1200: panel.lengthMm === 1200 ? panelCount : 0
    };

    return {
      allocation: {
        requiredLengthMm,
        totalLengthMm,
        wasteMm: totalLengthMm - requiredLengthMm,
        panelCount,
        counts
      },
      panelCostCents
    };
  }

  return null;
}

export function calculateConfiguratorNet(
  valanceWidthMm: number,
  requiredPanelLengthsMm: readonly number[]
): ConfiguratorNetCalculation | null {
  if (
    !Number.isSafeInteger(valanceWidthMm) ||
    valanceWidthMm < 1 ||
    requiredPanelLengthsMm.length === 0
  ) {
    return null;
  }

  const aggregateCounts = {
    600: 0,
    1000: 0,
    1200: 0
  };
  let requiredLengthMm = 0;
  let totalLengthMm = 0;
  let panelCount = 0;
  let panelCostCents = 0;

  for (const requiredLength of requiredPanelLengthsMm) {
    const pricedAllocation = selectOptimalPanelAllocation(requiredLength);

    if (!pricedAllocation) {
      return null;
    }

    requiredLengthMm += pricedAllocation.allocation.requiredLengthMm;
    totalLengthMm += pricedAllocation.allocation.totalLengthMm;
    panelCount += pricedAllocation.allocation.panelCount;
    panelCostCents += pricedAllocation.panelCostCents;
    aggregateCounts[600] += pricedAllocation.allocation.counts[600];
    aggregateCounts[1000] += pricedAllocation.allocation.counts[1000];
    aggregateCounts[1200] += pricedAllocation.allocation.counts[1200];
  }

  if (
    !Number.isFinite(requiredLengthMm) ||
    !Number.isSafeInteger(totalLengthMm) ||
    !Number.isSafeInteger(panelCount) ||
    !Number.isSafeInteger(panelCostCents)
  ) {
    return null;
  }

  const roundedRequiredLengthMm = roundMillimeters(requiredLengthMm);

  const electricalCents = applyMarkupCents(
    ELECTRICAL_SET_CENTS,
    CONFIGURATOR_ELECTRICAL_MARKUP_PERCENT
  );
  const valanceCents = valanceWidthMm * FINISHED_VALANCE_CENTS_PER_MM;
  const markedUpValanceCents = applyMarkupCents(
    valanceCents,
    CONFIGURATOR_VALANCE_MARKUP_PERCENT
  );
  const markedUpPanelCostCents = applyMarkupCents(
    panelCostCents,
    CONFIGURATOR_PANEL_MARKUP_PERCENT
  );

  if (
    electricalCents === null ||
    markedUpValanceCents === null ||
    markedUpPanelCostCents === null
  ) {
    return null;
  }

  const netTotalCents =
    electricalCents + markedUpValanceCents + markedUpPanelCostCents;

  if (!Number.isSafeInteger(netTotalCents)) {
    return null;
  }

  return {
    netTotalCents,
    panelAllocation: {
      requiredLengthMm: roundedRequiredLengthMm,
      totalLengthMm,
      wasteMm: roundMillimeters(totalLengthMm - roundedRequiredLengthMm),
      panelCount,
      counts: aggregateCounts
    }
  };
}

export function applyMarkupCents(
  subtotalCents: number,
  markupPercent: number
): number | null {
  if (
    !Number.isSafeInteger(subtotalCents) ||
    subtotalCents < 0 ||
    !Number.isFinite(markupPercent) ||
    markupPercent < 0
  ) {
    return null;
  }

  const markedUpCents = Math.round(
    (subtotalCents * (100 + markupPercent)) / 100
  );

  return Number.isSafeInteger(markedUpCents) ? markedUpCents : null;
}
