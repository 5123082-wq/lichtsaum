import { describe, expect, it } from "vitest";
import {
  calculateConfiguratorNet,
  selectOptimalPanelAllocation
} from "@/features/configurator/pricing";

describe("approved three-panel catalogue and selling prices", () => {
  it.each([
    [600, 600, 45000], [601, 1000, 60000], [1000, 1000, 60000],
    [1001, 1200, 75000], [1200, 1200, 75000]
  ])("covers %i mm with one %i mm panel", (required, size, price) => {
    const result = selectOptimalPanelAllocation(required);
    expect(result?.allocation).toMatchObject({ panelCount: 1, totalLengthMm: size });
    expect(result?.panelPriceCents).toBe(price);
  });

  it.each([
    [1201, 2, 1000], [1600, 2, 1000], [2000, 2, 1000],
    [2001, 2, 1200], [2401, 3, 1000], [4001, 4, 1200]
  ])("covers %i mm with %i equal %i mm panels without retired sizes", (length, count, size) => {
    const result = selectOptimalPanelAllocation(length);
    expect(result?.allocation).toMatchObject({
      panelCount: count, totalLengthMm: count * size, counts: { [size]: count }
    });
    expect(result?.allocation.counts).not.toHaveProperty("1600");
    expect(result?.allocation.counts).not.toHaveProperty("2000");
  });

  it("prices independent logo segments and adds one electrical set for the configuration", () => {
    expect(calculateConfiguratorNet(9500, 300, [170, 709, 170])).toMatchObject({
      netTotalCents: 217250,
      panelAllocation: { panelCount: 3, counts: { 600: 2, 1000: 1 } }
    });
  });

  it.each([[200, 102000], [250, 105000], [300, 108000]])(
    "prices 6 m at height %i with one 1000 mm panel and one electrical set",
    (height, total) => {
      expect(calculateConfiguratorNet(6000, height, [773.8])).toMatchObject({
        netTotalCents: total,
        panelAllocation: { panelCount: 1, counts: { 1000: 1 }, wasteMm: 226.2 }
      });
    }
  );

  it("charges the full fractional valance length and rounds to cents", () => {
    expect(calculateConfiguratorNet(3870, 250, [600])?.netTotalCents).toBe(79350);
    expect(calculateConfiguratorNet(1001, 200, [600])?.netTotalCents).toBe(64505);
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
      panelCount: 84, totalLengthMm: 100800, counts: { 1200: 84 }
    });
  });
});
