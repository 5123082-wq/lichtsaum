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
  it("uses one panel, then equal-panel combinations for one text segment", () => {
    expect(selectOptimalPanelAllocation(600)?.allocation.counts).toEqual({
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
    expect(selectOptimalPanelAllocation(1201)?.allocation.counts).toEqual({
      600: 0,
      1000: 2,
      1200: 0
    });
    expect(selectOptimalPanelAllocation(2001)?.allocation.counts).toEqual({
      600: 0,
      1000: 0,
      1200: 2
    });
    expect(selectOptimalPanelAllocation(2401)?.allocation.counts).toEqual({
      600: 0,
      1000: 3,
      1200: 0
    });
  });

  it("keeps the text allocation independent from the logo allocations", () => {
    const result = calculateConfiguratorNet(9500, [180, 709, 180]);

    expect(result).toMatchObject({
      netTotalCents: 160_000,
      panelAllocation: {
        requiredLengthMm: 1069,
        totalLengthMm: 2200,
        wasteMm: 1131,
        panelCount: 3,
        counts: { 600: 2, 1000: 1, 1200: 0 }
      }
    });
  });

  it("uses equal panels when a text segment needs more than one panel", () => {
    const wasteTie = selectOptimalPanelAllocation(1601)?.allocation;
    expect(wasteTie).toMatchObject({
      totalLengthMm: 2000,
      wasteMm: 399,
      panelCount: 2,
      counts: { 600: 0, 1000: 2, 1200: 0 }
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
      totalLengthMm: 100_800,
      wasteMm: 800,
      panelCount: 84,
      counts: { 600: 0, 1000: 0, 1200: 84 }
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
    expect(calculateConfiguratorNet(3000, [1200])).toEqual({
      netTotalCents: 77_500,
      panelAllocation: {
        requiredLengthMm: 1200,
        totalLengthMm: 1200,
        wasteMm: 0,
        panelCount: 1,
        counts: { 600: 0, 1000: 0, 1200: 1 }
      }
    });
    expect(
      Number.isSafeInteger(
        calculateConfiguratorNet(3000, [1200])?.netTotalCents
      )
    ).toBe(true);

    expect(calculateConfiguratorNet(2000, [1600])).toMatchObject({
      netTotalCents: 102_500,
      panelAllocation: {
        counts: { 600: 0, 1000: 2, 1200: 0 }
      }
    });
  });
});
