import { describe, expect, it } from "vitest";

import {
  CONFIGURATOR_ELECTRICAL_MARKUP_PERCENT,
  CONFIGURATOR_PANEL_MARKUP_PERCENT,
  CONFIGURATOR_VALANCE_MARKUP_PERCENT,
  applyMarkupCents,
  calculateConfiguratorNet,
  selectOptimalPanelAllocation
} from "@/features/configurator/pricing";

describe("configurator panel allocation", () => {
  it("matches exhaustive enumeration across representative lengths", () => {
    const panelTypes = [
      { lengthMm: 600, costCents: 15_000 },
      { lengthMm: 1000, costCents: 20_000 },
      { lengthMm: 1200, costCents: 25_000 }
    ] as const;

    for (let requiredLengthMm = 1; requiredLengthMm <= 10_000; requiredLengthMm += 37) {
      let expected:
        | Readonly<{
            costCents: number;
            wasteMm: number;
            panelCount: number;
          }>
        | undefined;
      const maximumCount = Math.ceil(requiredLengthMm / 600) + 2;

      for (let count600 = 0; count600 <= maximumCount; count600 += 1) {
        for (let count1000 = 0; count1000 <= maximumCount; count1000 += 1) {
          for (let count1200 = 0; count1200 <= maximumCount; count1200 += 1) {
            const totalLengthMm =
              count600 * panelTypes[0].lengthMm +
              count1000 * panelTypes[1].lengthMm +
              count1200 * panelTypes[2].lengthMm;

            if (totalLengthMm < requiredLengthMm) {
              continue;
            }

            const candidate = {
              costCents:
                count600 * panelTypes[0].costCents +
                count1000 * panelTypes[1].costCents +
                count1200 * panelTypes[2].costCents,
              wasteMm: totalLengthMm - requiredLengthMm,
              panelCount: count600 + count1000 + count1200
            };

            if (
              !expected ||
              candidate.costCents < expected.costCents ||
              (candidate.costCents === expected.costCents &&
                candidate.wasteMm < expected.wasteMm) ||
              (candidate.costCents === expected.costCents &&
                candidate.wasteMm === expected.wasteMm &&
                candidate.panelCount < expected.panelCount)
            ) {
              expected = candidate;
            }
          }
        }
      }

      const actual = selectOptimalPanelAllocation(requiredLengthMm);

      expect(actual).not.toBeNull();
      expect({
        costCents: actual?.panelCostCents,
        wasteMm: actual?.allocation.wasteMm,
        panelCount: actual?.allocation.panelCount
      }).toEqual(expected);
    }
  });

  it("uses the lowest-cost unrestricted panel combination", () => {
    expect(selectOptimalPanelAllocation(1)?.allocation.counts).toEqual({
      600: 1,
      1000: 0,
      1200: 0
    });
    expect(selectOptimalPanelAllocation(601)?.allocation.counts).toEqual({
      600: 0,
      1000: 1,
      1200: 0
    });
    expect(selectOptimalPanelAllocation(1001)?.allocation.counts).toEqual({
      600: 0,
      1000: 0,
      1200: 1
    });
  });

  it("breaks equal-cost ties by waste and then panel count", () => {
    const wasteTie = selectOptimalPanelAllocation(1601)?.allocation;
    expect(wasteTie).toMatchObject({
      totalLengthMm: 1800,
      wasteMm: 199,
      panelCount: 2,
      counts: { 600: 1, 1000: 0, 1200: 1 }
    });

    const countTie = selectOptimalPanelAllocation(3401)?.allocation;
    expect(countTie).toMatchObject({
      totalLengthMm: 3600,
      wasteMm: 199,
      panelCount: 3,
      counts: { 600: 0, 1000: 0, 1200: 3 }
    });
  });

  it("has no fixed panel-count ceiling", () => {
    const result = selectOptimalPanelAllocation(100_000)?.allocation;

    expect(result).toMatchObject({
      totalLengthMm: 100_000,
      wasteMm: 0,
      panelCount: 100,
      counts: { 600: 0, 1000: 100, 1200: 0 }
    });
  });

  it("calculates component markups and totals in integer cents", () => {
    expect(CONFIGURATOR_ELECTRICAL_MARKUP_PERCENT).toBe(25);
    expect(CONFIGURATOR_VALANCE_MARKUP_PERCENT).toBe(25);
    expect(CONFIGURATOR_PANEL_MARKUP_PERCENT).toBe(100);
    expect(applyMarkupCents(10_000, CONFIGURATOR_ELECTRICAL_MARKUP_PERCENT)).toBe(
      12_500
    );
    expect(applyMarkupCents(12_000, CONFIGURATOR_VALANCE_MARKUP_PERCENT)).toBe(
      15_000
    );
    expect(applyMarkupCents(20_000, CONFIGURATOR_PANEL_MARKUP_PERCENT)).toBe(
      40_000
    );
    expect(calculateConfiguratorNet(3000, 1200)).toEqual({
      netTotalCents: 77_500,
      panelAllocation: {
        requiredLengthMm: 1200,
        totalLengthMm: 1200,
        wasteMm: 0,
        panelCount: 1,
        counts: { 600: 0, 1000: 0, 1200: 1 }
      }
    });
    expect(Number.isSafeInteger(calculateConfiguratorNet(3000, 1200)?.netTotalCents)).toBe(
      true
    );

    expect(calculateConfiguratorNet(2000, 1600)).toMatchObject({
      netTotalCents: 92_500,
      panelAllocation: {
        counts: { 600: 1, 1000: 1, 1200: 0 }
      }
    });
  });
});
