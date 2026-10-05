import type {
  MiniConfiguratorCompositionMode,
  MiniConfiguratorConfig,
  MiniConfiguratorFont,
  MiniConfiguratorPreviewMode
} from "@/features/mini-configurator/types";

export const MINI_CONFIGURATOR_FONTS = [
  {
    id: "montserrat",
    label: "Montserrat",
    direction: "Moderne Grotesk",
    family: "LICHTSAUM Montserrat",
    source: "/fonts/lichtsaum-configurator/montserrat-regular-400.woff2",
    weight: "400"
  },
  {
    id: "open-sans",
    label: "Open Sans",
    direction: "Offene Grotesk",
    family: "LICHTSAUM Open Sans",
    source: "/fonts/lichtsaum-configurator/open-sans-regular-400.woff2",
    weight: "400"
  },
  {
    id: "oswald",
    label: "Oswald",
    direction: "Schmal und präzise",
    family: "LICHTSAUM Oswald",
    source: "/fonts/lichtsaum-configurator/oswald-regular-400.woff2",
    weight: "400"
  },
  {
    id: "pt-sans",
    label: "PT Sans",
    direction: "Ruhige humanistische Grotesk",
    family: "LICHTSAUM PT Sans",
    source: "/fonts/lichtsaum-configurator/pt-sans-regular.woff2",
    weight: "400"
  },
  {
    id: "playfair-display",
    label: "Playfair Display",
    direction: "Kontrastreiche Serifenschrift",
    family: "LICHTSAUM Playfair Display",
    source:
      "/fonts/lichtsaum-configurator/playfair-display-regular-400.woff2",
    weight: "400"
  },
  {
    id: "rubik",
    label: "Rubik",
    direction: "Konzeptionelle Grotesk",
    family: "LICHTSAUM Rubik",
    source: "/fonts/lichtsaum-configurator/rubik-regular-400.woff2",
    weight: "400"
  },
  {
    id: "fira-sans",
    label: "Fira Sans",
    direction: "Technische Grotesk",
    family: "LICHTSAUM Fira Sans",
    source: "/fonts/lichtsaum-configurator/fira-sans-regular.woff2",
    weight: "400"
  },
  {
    id: "source-sans-3",
    label: "Source Sans 3",
    direction: "Editoriale Grotesk",
    family: "LICHTSAUM Source Sans 3",
    source:
      "/fonts/lichtsaum-configurator/source-sans-3-regular-400.woff2",
    weight: "400"
  }
] as const satisfies readonly MiniConfiguratorFont[];

export const MINI_CONFIGURATOR_COMPOSITION_MODES = [
  {
    id: "text-only",
    label: "Nur Schrift",
    description: "Schriftzug mittig, ohne Logo."
  },
  {
    id: "logo-left",
    label: "Logo links",
    description: "Logo links, Schriftzug mittig."
  },
  {
    id: "logo-both",
    label: "Logo beidseitig",
    description: "Gleiche Logos links und rechts."
  }
] as const satisfies ReadonlyArray<{
  id: MiniConfiguratorCompositionMode;
  label: string;
  description: string;
}>;

// Shared by both configurators. Names describe colour directions, not supplier fabrics.
// Keep persisted IDs stable when changing their display names or screen colours.
export const MINI_CONFIGURATOR_AWNING_COLORS = [
  { id: "cream-white", label: "Naturweiß", value: "#E8DED3" },
  { id: "sand", label: "Sandbeige", value: "#D6C6B9" },
  { id: "warm-grey", label: "Taupe", value: "#7B7168" },
  { id: "light-grey", label: "Hellgrau", value: "#A29A97" },
  { id: "anthracite", label: "Graphit", value: "#5F5F61" },
  { id: "night-blue", label: "Nachtblau", value: "#27283C" },
  { id: "dark-green", label: "Waldgrün", value: "#153F3A" },
  { id: "bordeaux", label: "Bordeaux", value: "#580C11" },
  { id: "deep-black", label: "Schwarz", value: "#0E0E0E" },
  { id: "terracotta", label: "Terrakotta", value: "#8D352C" }
] as const;

export function normalizeAwningColorId(value: unknown): unknown {
  return value === "white" ? "cream-white" : value;
}

export const MINI_CONFIGURATOR_LIGHT_COLORS = [
  { id: "warm-white", label: "Warmweiß", value: "#FFD6A1" },
  { id: "neutral-white", label: "Neutralweiß", value: "#F2F5FF" },
  { id: "rgb-red", label: "RGB-Rot", value: "#FF3B30" },
  { id: "rgb-green", label: "RGB-Grün", value: "#34C759" },
  { id: "rgb-blue", label: "RGB-Blau", value: "#0A84FF" },
  { id: "rgb-yellow", label: "RGB-Gelb", value: "#FFD60A" },
  { id: "rgb-cyan", label: "RGB-Cyan", value: "#32D7E5" },
  { id: "rgb-violet", label: "RGB-Violett", value: "#BF5AF2" }
] as const;

export const MINI_CONFIGURATOR_PREVIEW_MODES = [
  { id: "day", label: "Tag" },
  { id: "night", label: "Nacht" }
] as const satisfies ReadonlyArray<{
  id: MiniConfiguratorPreviewMode;
  label: string;
}>;

export const DEFAULT_MINI_CONFIGURATOR_CONFIG: MiniConfiguratorConfig = {
  compositionMode: "text-only",
  text: "CAFÉ LICHT",
  fontId: "montserrat",
  valanceWidthMm: 3000,
  valanceHeightMm: 300,
  letterHeightMm: 120,
  awningColorId: "anthracite",
  lightColorId: "warm-white",
  previewMode: "night"
};

export const SUPPORTED_MINI_CONFIGURATOR_TEXT =
  /^[\p{Script=Latin}\p{Script=Cyrillic}\p{Number}\p{Mark}\u0020.,!?&+/\-–—:'"()@№%€$]*$/u;
