import "server-only";

import type {
  ConfiguratorPanelAllocation,
  ConfiguratorPanelCounts
} from "@/features/configurator/types";

export const CONFIGURATOR_PRICING_VERSION = "2026-10-20.v5" as const;
// Keep the commercial coefficients server-only. They must never be exposed as
// part of the client-facing calculation result.
export const CONFIGURATOR_MARKUP_PERCENT = 50 as const;
const VALANCE_COST_CENTS_PER_METER: Readonly<Record<number, number>> = {
  200: 2500,
  250: 3000,
  300: 3500
};

const PANEL_CATALOG = [
  { lengthMm: 600, costCents: 53_515 },
  { lengthMm: 1000, costCents: 63_305 },
  { lengthMm: 1200, costCents: 69_410 },
  { lengthMm: 1600, costCents: 79_090 },
  { lengthMm: 2000, costCents: 85_525 }
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
      1200: panel.lengthMm === 1200 ? panelCount : 0,
      1600: panel.lengthMm === 1600 ? panelCount : 0,
      2000: panel.lengthMm === 2000 ? panelCount : 0
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
  valanceHeightMm: number,
  requiredPanelLengthsMm: readonly number[]
): ConfiguratorNetCalculation | null {
  if (
    !Number.isSafeInteger(valanceWidthMm) ||
    valanceWidthMm < 1 ||
    requiredPanelLengthsMm.length === 0 ||
    !Object.hasOwn(VALANCE_COST_CENTS_PER_METER, valanceHeightMm)
  ) {
    return null;
  }

  const aggregateCounts = {
    600: 0,
    1000: 0,
    1200: 0,
    1600: 0,
    2000: 0
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
    aggregateCounts[1600] += pricedAllocation.allocation.counts[1600] ?? 0;
    aggregateCounts[2000] += pricedAllocation.allocation.counts[2000] ?? 0;
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

  const valanceCents = Math.round(
    valanceWidthMm * VALANCE_COST_CENTS_PER_METER[valanceHeightMm] / 1000
  );
  const netTotalCents = applyMarkupCents(
    valanceCents + panelCostCents,
    CONFIGURATOR_MARKUP_PERCENT
  );

  if (netTotalCents === null || !Number.isSafeInteger(netTotalCents)) {
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
