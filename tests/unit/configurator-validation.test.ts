import { describe, expect, it } from "vitest";

import { DEFAULT_CONFIGURATOR_CONFIGURATION } from "@/features/configurator/options";
import {
  parseConfiguratorConfiguration,
  parseConfiguratorProjectSelection
} from "@/features/configurator/validation";

describe("configurator input validation", () => {
  it("accepts the complete allowlisted v1 configuration", () => {
    expect(
      parseConfiguratorConfiguration(DEFAULT_CONFIGURATOR_CONFIGURATION)
    ).toEqual(DEFAULT_CONFIGURATOR_CONFIGURATION);
  });

  it("rejects unknown fields, fractional millimetres and invalid geometry ranges", () => {
    expect(
      parseConfiguratorConfiguration({
        ...DEFAULT_CONFIGURATOR_CONFIGURATION,
        netTotalCents: 1
      })
    ).toBeNull();
    expect(
      parseConfiguratorConfiguration({
        ...DEFAULT_CONFIGURATOR_CONFIGURATION,
        valanceWidthMm: 2999.5
      })
    ).toBeNull();
    expect(
      parseConfiguratorConfiguration({
        ...DEFAULT_CONFIGURATOR_CONFIGURATION,
        valanceHeightMm: 199
      })
    ).toBeNull();
    expect(
      parseConfiguratorConfiguration({
        ...DEFAULT_CONFIGURATOR_CONFIGURATION,
        letterHeightMm: 181
      })
    ).toBeNull();
  });

  it("requires a single-line inscription of at most 60 characters", () => {
    expect(
      parseConfiguratorConfiguration({
        ...DEFAULT_CONFIGURATOR_CONFIGURATION,
        text: " ".repeat(5)
      })
    ).toBeNull();
    expect(
      parseConfiguratorConfiguration({
        ...DEFAULT_CONFIGURATOR_CONFIGURATION,
        text: "A".repeat(61)
      })
    ).toBeNull();
    expect(
      parseConfiguratorConfiguration({
        ...DEFAULT_CONFIGURATOR_CONFIGURATION,
        text: "ZEILE 1\nZEILE 2"
      })
    ).toBeNull();
    expect(
      parseConfiguratorConfiguration({
        ...DEFAULT_CONFIGURATOR_CONFIGURATION,
        text: "ZEILE 1\u2028ZEILE 2"
      })
    ).toBeNull();
    expect(
      parseConfiguratorConfiguration({
        ...DEFAULT_CONFIGURATOR_CONFIGURATION,
        text: "CAFÉ\u00a0LICHT"
      })
    ).toBeNull();
  });

  it("validates services and optional five-digit PLZ separately from price input", () => {
    expect(
      parseConfiguratorProjectSelection({
        configuration: DEFAULT_CONFIGURATOR_CONFIGURATION,
        services: ["design", "delivery"],
        postalCode: "10115"
      })
    ).not.toBeNull();
    expect(
      parseConfiguratorProjectSelection({
        configuration: DEFAULT_CONFIGURATOR_CONFIGURATION,
        services: ["design", "design"]
      })
    ).toBeNull();
    expect(
      parseConfiguratorProjectSelection({
        configuration: DEFAULT_CONFIGURATOR_CONFIGURATION,
        services: [],
        postalCode: "1011"
      })
    ).toBeNull();
  });
});
