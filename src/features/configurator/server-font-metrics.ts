import "server-only";

import path from "node:path";

import { openSync } from "fontkit";
import type { Font } from "fontkit";

import { CONFIGURATOR_FONTS } from "@/features/configurator/options";
import type {
  ConfiguratorConfigurationV1,
  ConfiguratorTextMeasurement
} from "@/features/configurator/types";

export type ConfiguratorFontMeasurementResult =
  | Readonly<{
      status: "ok";
      measurement: ConfiguratorTextMeasurement;
    }>
  | Readonly<{
      status: "unsupported-glyph";
    }>
  | Readonly<{
      status: "failed";
    }>;

const fontCache = new Map<ConfiguratorConfigurationV1["fontId"], Font>();

function roundMetric(value: number): number {
  return Math.round(value * 1_000_000) / 1_000_000;
}

function getFont(
  fontId: ConfiguratorConfigurationV1["fontId"]
): Font | null {
  const cached = fontCache.get(fontId);

  if (cached) {
    return cached;
  }

  const option = CONFIGURATOR_FONTS.find((font) => font.id === fontId);

  if (!option) {
    return null;
  }

  const relativeSource = option.source.replace(/^\/+/, "");
  const fontPath = path.join(process.cwd(), "public", relativeSource);
  const openedFont = openSync(fontPath);

  if ("fonts" in openedFont) {
    return null;
  }

  const font = openedFont.variationAxes.wght
    ? openedFont.getVariation({ wght: Number(option.weight) })
    : openedFont;

  fontCache.set(fontId, font);

  return font;
}

function hasEveryVisibleGlyph(font: Font, text: string): boolean {
  return Array.from(text).every((character) => {
    if (character === " ") {
      return true;
    }

    const codePoint = character.codePointAt(0);

    return codePoint !== undefined && font.hasGlyphForCodePoint(codePoint);
  });
}

export function measureConfiguratorTextOnServer(
  configuration: ConfiguratorConfigurationV1
): ConfiguratorFontMeasurementResult {
  try {
    const font = getFont(configuration.fontId);

    if (!font) {
      return { status: "failed" };
    }

    if (!hasEveryVisibleGlyph(font, configuration.text)) {
      return { status: "unsupported-glyph" };
    }

    const run = font.layout(configuration.text);
    const visibleHeightUnits = run.bbox.maxY - run.bbox.minY;

    if (
      !Number.isFinite(visibleHeightUnits) ||
      visibleHeightUnits <= 0 ||
      !Number.isFinite(run.advanceWidth) ||
      run.advanceWidth <= 0 ||
      !Number.isFinite(font.unitsPerEm) ||
      font.unitsPerEm <= 0
    ) {
      return { status: "failed" };
    }

    const millimetersPerUnit =
      configuration.letterHeightMm / visibleHeightUnits;
    const widthMm = run.advanceWidth * millimetersPerUnit;
    const svgFontSizeMm = font.unitsPerEm * millimetersPerUnit;
    const baselineOffsetMm =
      ((run.bbox.maxY + run.bbox.minY) / 2) * millimetersPerUnit;

    if (
      !Number.isFinite(widthMm) ||
      widthMm <= 0 ||
      !Number.isFinite(svgFontSizeMm) ||
      svgFontSizeMm <= 0 ||
      !Number.isFinite(baselineOffsetMm)
    ) {
      return { status: "failed" };
    }

    return {
      status: "ok",
      measurement: {
        text: configuration.text,
        fontId: configuration.fontId,
        visibleHeightMm: configuration.letterHeightMm,
        widthMm: roundMetric(widthMm),
        svgFontSizeMm: roundMetric(svgFontSizeMm),
        baselineOffsetMm: roundMetric(baselineOffsetMm)
      }
    };
  } catch {
    return { status: "failed" };
  }
}
