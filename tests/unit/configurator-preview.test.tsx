// @vitest-environment jsdom

import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ConfiguratorPreview } from "@/features/configurator/configurator-preview";
import { evaluateConfiguratorGeometry } from "@/features/configurator/geometry";
import { DEFAULT_CONFIGURATOR_CONFIGURATION } from "@/features/configurator/options";

afterEach(cleanup);

describe("ConfiguratorPreview", () => {
  it("preserves the exact whitespace measured by the authoritative calculation", () => {
    const configuration = {
      ...DEFAULT_CONFIGURATOR_CONFIGURATION,
      text: " A  B "
    };
    const measurement = {
      text: configuration.text,
      fontId: configuration.fontId,
      visibleHeightMm: configuration.letterHeightMm,
      widthMm: 500,
      svgFontSizeMm: 140,
      baselineOffsetMm: 20
    };
    const geometry = evaluateConfiguratorGeometry(
      configuration,
      measurement
    );
    const { container } = render(
      <ConfiguratorPreview
        configuration={configuration}
        geometry={geometry}
        measurement={measurement}
        statusText="Berechnet"
      />
    );
    const inscription = container.querySelector(
      "text[data-configurator-text]"
    );

    expect(inscription).not.toBeNull();
    expect(inscription?.textContent).toBe(configuration.text);
    expect(inscription).toHaveAttribute("xml:space", "preserve");
    expect(inscription).toHaveStyle({ whiteSpace: "pre" });
    expect(inscription).toHaveAttribute("textLength", "500");
  });
});
