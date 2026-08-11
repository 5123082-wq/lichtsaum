import type { ConfiguratorFont } from "@/features/configurator/types";

const fontLoadPromises = new Map<string, Promise<void>>();

export function loadConfiguratorFont(font: ConfiguratorFont): Promise<void> {
  const cachedPromise = fontLoadPromises.get(font.id);

  if (cachedPromise) {
    return cachedPromise;
  }

  const loadPromise = new FontFace(
    font.family,
    `url("${font.source}") format("woff2")`,
    { style: "normal", weight: String(font.weight) }
  )
    .load()
    .then((fontFace) => {
      document.fonts.add(fontFace);
    })
    .catch((error: unknown) => {
      fontLoadPromises.delete(font.id);
      throw error;
    });

  fontLoadPromises.set(font.id, loadPromise);

  return loadPromise;
}
