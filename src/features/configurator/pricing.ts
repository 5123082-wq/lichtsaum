import "server-only";

import type {
  ConfiguratorPanelAllocation,
  ConfiguratorPanelCounts
} from "@/features/configurator/types";

export const CONFIGURATOR_PRICING_VERSION = "2026-10-20.v6" as const;
// Owner-approved net selling prices. Keep tariff calculation server-only.
const ELECTRICAL_SET_PRICE_CENTS = 15_000;
const VALANCE_PRICE_CENTS_PER_METER: Readonly<Record<number, number>> = {
  200: 4500,
  250: 5000,
  300: 5500
};

const PANEL_CATALOG = [
  { lengthMm: 600, priceCents: 45_000 },
  { lengthMm: 1000, priceCents: 60_000 },
  { lengthMm: 1200, priceCents: 75_000 }
] as const;

function roundMillimeters(value: number): number {
  return Math.round(value * 1_000_000) / 1_000_000;
}

export type ConfiguratorPricedPanelAllocation = Readonly<{
  allocation: ConfiguratorPanelAllocation;
  panelPriceCents: number;
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
    const panelPriceCents = panelCount * panel.priceCents;

    if (
      !Number.isSafeInteger(totalLengthMm) ||
      !Number.isSafeInteger(panelPriceCents)
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
      panelPriceCents
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
    !Object.hasOwn(VALANCE_PRICE_CENTS_PER_METER, valanceHeightMm)
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
  let panelPriceCents = 0;

  for (const requiredLength of requiredPanelLengthsMm) {
    const pricedAllocation = selectOptimalPanelAllocation(requiredLength);

    if (!pricedAllocation) {
      return null;
    }

    requiredLengthMm += pricedAllocation.allocation.requiredLengthMm;
    totalLengthMm += pricedAllocation.allocation.totalLengthMm;
    panelCount += pricedAllocation.allocation.panelCount;
    panelPriceCents += pricedAllocation.panelPriceCents;
    aggregateCounts[600] += pricedAllocation.allocation.counts[600];
    aggregateCounts[1000] += pricedAllocation.allocation.counts[1000];
    aggregateCounts[1200] += pricedAllocation.allocation.counts[1200];
  }

  if (
    !Number.isFinite(requiredLengthMm) ||
    !Number.isSafeInteger(totalLengthMm) ||
    !Number.isSafeInteger(panelCount) ||
    !Number.isSafeInteger(panelPriceCents)
  ) {
    return null;
  }

  const roundedRequiredLengthMm = roundMillimeters(requiredLengthMm);

  const valanceCents = Math.round(
    valanceWidthMm * VALANCE_PRICE_CENTS_PER_METER[valanceHeightMm] / 1000
  );
  const netTotalCents = valanceCents + panelPriceCents + ELECTRICAL_SET_PRICE_CENTS;

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
