import "server-only";

import type {
  ConfiguratorPanelAllocation,
  ConfiguratorPanelCounts
} from "@/features/configurator/types";

export const CONFIGURATOR_PRICING_VERSION = "2026-08-11.v1" as const;
export const CONFIGURATOR_MARKUP_PERCENT = 0 as const;

const ELECTRICAL_SET_CENTS = 10_000;
const FINISHED_VALANCE_CENTS_PER_MM = 4;

const PANEL_CATALOG = [
  { lengthMm: 600, costCents: 15_000 },
  { lengthMm: 1000, costCents: 20_000 },
  { lengthMm: 1200, costCents: 25_000 }
] as const;

type Candidate = Readonly<{
  costCents: number;
  totalLengthMm: number;
  panelCount: number;
  counts: ConfiguratorPanelCounts;
}>;

export type ConfiguratorPricedPanelAllocation = Readonly<{
  allocation: ConfiguratorPanelAllocation;
  panelCostCents: number;
}>;

export type ConfiguratorNetCalculation = Readonly<{
  netTotalCents: number;
  panelAllocation: ConfiguratorPanelAllocation;
}>;

function isBetterCandidate(
  candidate: Candidate,
  current: Candidate | null
): boolean {
  if (!current) {
    return true;
  }

  if (candidate.costCents !== current.costCents) {
    return candidate.costCents < current.costCents;
  }

  if (candidate.totalLengthMm !== current.totalLengthMm) {
    return candidate.totalLengthMm < current.totalLengthMm;
  }

  if (candidate.panelCount !== current.panelCount) {
    return candidate.panelCount < current.panelCount;
  }

  // The specified tie-breaks are exhausted. Prefer longer panels to keep the
  // otherwise equivalent result deterministic across runtimes.
  if (candidate.counts[1200] !== current.counts[1200]) {
    return candidate.counts[1200] > current.counts[1200];
  }

  return candidate.counts[1000] > current.counts[1000];
}

export function selectOptimalPanelAllocation(
  requiredLengthMm: number
): ConfiguratorPricedPanelAllocation | null {
  if (!Number.isFinite(requiredLengthMm) || requiredLengthMm <= 0) {
    return null;
  }

  let best: Candidate | null = null;

  // Five 600 mm panels are strictly dominated by three 1000 mm panels;
  // five 1200 mm panels are strictly dominated by six 1000 mm panels.
  // Therefore every optimum has at most four of either outer size, while
  // the unrestricted 1000 mm count covers arbitrarily long compositions.
  for (let count600 = 0; count600 <= 4; count600 += 1) {
    for (let count1200 = 0; count1200 <= 4; count1200 += 1) {
      const outerLengthMm = count600 * 600 + count1200 * 1200;
      const remainingLengthMm = Math.max(
        0,
        requiredLengthMm - outerLengthMm
      );
      const count1000 = Math.ceil(remainingLengthMm / 1000);
      const counts: ConfiguratorPanelCounts = {
        600: count600,
        1000: count1000,
        1200: count1200
      };
      const totalLengthMm = outerLengthMm + count1000 * 1000;
      const panelCount = count600 + count1000 + count1200;
      const costCents =
        count600 * PANEL_CATALOG[0].costCents +
        count1000 * PANEL_CATALOG[1].costCents +
        count1200 * PANEL_CATALOG[2].costCents;

      if (
        !Number.isSafeInteger(totalLengthMm) ||
        !Number.isSafeInteger(panelCount) ||
        !Number.isSafeInteger(costCents)
      ) {
        continue;
      }

      const candidate: Candidate = {
        costCents,
        totalLengthMm,
        panelCount,
        counts
      };

      if (isBetterCandidate(candidate, best)) {
        best = candidate;
      }
    }
  }

  if (!best) {
    return null;
  }

  return {
    allocation: {
      requiredLengthMm,
      totalLengthMm: best.totalLengthMm,
      wasteMm: best.totalLengthMm - requiredLengthMm,
      panelCount: best.panelCount,
      counts: best.counts
    },
    panelCostCents: best.costCents
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

export function calculateConfiguratorNet(
  valanceWidthMm: number,
  requiredPanelLengthMm: number
): ConfiguratorNetCalculation | null {
  if (!Number.isSafeInteger(valanceWidthMm) || valanceWidthMm < 1) {
    return null;
  }

  const pricedAllocation = selectOptimalPanelAllocation(
    requiredPanelLengthMm
  );

  if (!pricedAllocation) {
    return null;
  }

  const valanceCents = valanceWidthMm * FINISHED_VALANCE_CENTS_PER_MM;
  const subtotalCents =
    ELECTRICAL_SET_CENTS +
    valanceCents +
    pricedAllocation.panelCostCents;
  const netTotalCents = applyMarkupCents(
    subtotalCents,
    CONFIGURATOR_MARKUP_PERCENT
  );

  if (netTotalCents === null) {
    return null;
  }

  return {
    netTotalCents,
    panelAllocation: pricedAllocation.allocation
  };
}
