import type {
  MiniConfiguratorFont,
  MiniConfiguratorTextMeasurement
} from "@/features/mini-configurator/types";

const REFERENCE_FONT_SIZE_PX = 1000;
const FONT_LOAD_TIMEOUT_MS = 2000;
const fontLoadCache = new Map<string, Promise<FontFace>>();

function loadConfiguratorFont(font: MiniConfiguratorFont): Promise<FontFace> {
  const cachedFont = fontLoadCache.get(font.id);

  if (cachedFont) {
    return cachedFont;
  }

  const fontPromise = new FontFace(
    font.family,
    `url("${font.source}") format("woff2")`,
    { style: "normal", weight: font.weight }
  )
    .load()
    .then((loadedFont) => {
      document.fonts.add(loadedFont);
      return loadedFont;
    })
    .catch((error: unknown) => {
      fontLoadCache.delete(font.id);
      throw error;
    });

  fontLoadCache.set(font.id, fontPromise);

  return fontPromise;
}

export async function measureMiniConfiguratorText(
  text: string,
  font: MiniConfiguratorFont,
  visibleHeightMm: number
): Promise<MiniConfiguratorTextMeasurement | null> {
  await Promise.race([
    loadConfiguratorFont(font).catch(() => null),
    new Promise<null>((resolve) => {
      window.setTimeout(resolve, FONT_LOAD_TIMEOUT_MS);
    })
  ]);

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    return null;
  }

  context.font = `${font.weight} ${REFERENCE_FONT_SIZE_PX}px "${font.family}"`;
  context.textBaseline = "alphabetic";
  context.fontKerning = "normal";

  const textMetrics = context.measureText(text);
  const fallbackMetrics = context.measureText("H");
  const ascentPx =
    textMetrics.actualBoundingBoxAscent || fallbackMetrics.actualBoundingBoxAscent;
  const descentPx =
    textMetrics.actualBoundingBoxDescent ||
    fallbackMetrics.actualBoundingBoxDescent;
  const visibleHeightPx = ascentPx + descentPx;

  if (
    !Number.isFinite(visibleHeightPx) ||
    visibleHeightPx <= 0 ||
    !Number.isFinite(textMetrics.width) ||
    textMetrics.width <= 0
  ) {
    return null;
  }

  const millimetersPerPixel = visibleHeightMm / visibleHeightPx;

  return {
    text,
    fontId: font.id,
    visibleHeightMm,
    widthMm: textMetrics.width * millimetersPerPixel,
    svgFontSizeMm: REFERENCE_FONT_SIZE_PX * millimetersPerPixel,
    baselineOffsetMm: ((ascentPx - descentPx) / 2) * millimetersPerPixel
  };
}
