import { describe, expect, it } from "vitest";
import {
  CONFIGURATOR_MARKUP_PERCENT,
  applyMarkupCents,
  calculateConfiguratorNet,
  selectOptimalPanelAllocation
} from "@/features/configurator/pricing";

describe("supplier panel catalogue and pricing", () => {
  it.each([
    [600, 600, 53515], [601, 1000, 63305], [1000, 1000, 63305],
    [1001, 1200, 69410], [1201, 1600, 79090], [1600, 1600, 79090],
    [1601, 2000, 85525], [2000, 2000, 85525]
  ])("covers %i mm with one %i mm panel", (required, size, purchase) => {
    const result = selectOptimalPanelAllocation(required);
    expect(result?.allocation).toMatchObject({ panelCount: 1, totalLengthMm: size });
    expect(result?.panelCostCents).toBe(purchase);
  });

  it("preserves equal-panel allocation for longer segments and independent logos", () => {
    expect(selectOptimalPanelAllocation(2001)?.allocation).toMatchObject({
      panelCount: 2, counts: { 1200: 2 }
    });
    expect(selectOptimalPanelAllocation(4001)?.allocation).toMatchObject({
      panelCount: 3, counts: { 1600: 3 }
    });
    expect(calculateConfiguratorNet(9500, 300, [170, 709, 170])).toMatchObject({
      netTotalCents: 305378,
      panelAllocation: { panelCount: 3, counts: { 600: 2, 1000: 1 } }
    });
  });

  it.each([[200, 117458], [250, 121958], [300, 126458]])(
    "prices the 6 m screenshot at height %i using supplier costs plus 50%%",
    (height, total) => {
      expect(calculateConfiguratorNet(6000, height, [773.8])).toMatchObject({
        netTotalCents: total,
        panelAllocation: { panelCount: 1, counts: { 1000: 1 }, wasteMm: 226.2 }
      });
    }
  );

  it("excludes electrical costs and rounds the marked-up subtotal once", () => {
    expect(CONFIGURATOR_MARKUP_PERCENT).toBe(50);
    expect(applyMarkupCents(84305, 50)).toBe(126458);
    expect(calculateConfiguratorNet(3870, 250, [600])?.netTotalCents).toBe(97688);
  });

  it("rejects unsupported heights, invalid lengths and arithmetic overflow", () => {
    expect(calculateConfiguratorNet(6000, 270, [773.8])).toBeNull();
    expect(calculateConfiguratorNet(0, 300, [773.8])).toBeNull();
    expect(calculateConfiguratorNet(6000, 300, [])).toBeNull();
    expect(selectOptimalPanelAllocation(NaN)).toBeNull();
    expect(selectOptimalPanelAllocation(-1)).toBeNull();
    expect(calculateConfiguratorNet(Number.MAX_SAFE_INTEGER, 300, [600])).toBeNull();
  });

  it("has no arbitrary panel-count ceiling", () => {
    expect(selectOptimalPanelAllocation(100000)?.allocation).toMatchObject({
      panelCount: 50, totalLengthMm: 100000, counts: { 2000: 50 }
    });
  });
});
