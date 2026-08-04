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
    direction: "Moderner Grotesk",
    family: "LICHTSAUM Montserrat",
    source: "/fonts/lichtsaum-configurator/montserrat-variable.woff2",
    weight: "400"
  },
  {
    id: "open-sans",
    label: "Open Sans",
    direction: "Offener Sans",
    family: "LICHTSAUM Open Sans",
    source: "/fonts/lichtsaum-configurator/open-sans-variable.woff2",
    weight: "400"
  },
  {
    id: "oswald",
    label: "Oswald",
    direction: "Schmal und präzise",
    family: "LICHTSAUM Oswald",
    source: "/fonts/lichtsaum-configurator/oswald-variable.woff2",
    weight: "400"
  },
  {
    id: "pt-sans",
    label: "PT Sans",
    direction: "Ruhiger Humanist",
    family: "LICHTSAUM PT Sans",
    source: "/fonts/lichtsaum-configurator/pt-sans-regular.woff2",
    weight: "400"
  },
  {
    id: "playfair-display",
    label: "Playfair Display",
    direction: "Kontrastreiche Serif",
    family: "LICHTSAUM Playfair Display",
    source: "/fonts/lichtsaum-configurator/playfair-display-variable.woff2",
    weight: "400"
  },
  {
    id: "rubik",
    label: "Rubik",
    direction: "Konzeptioneller Sans",
    family: "LICHTSAUM Rubik",
    source: "/fonts/lichtsaum-configurator/rubik-variable.woff2",
    weight: "400"
  },
  {
    id: "fira-sans",
    label: "Fira Sans",
    direction: "Technischer Sans",
    family: "LICHTSAUM Fira Sans",
    source: "/fonts/lichtsaum-configurator/fira-sans-regular.woff2",
    weight: "400"
  },
  {
    id: "source-sans-3",
    label: "Source Sans 3",
    direction: "Editorialer Sans",
    family: "LICHTSAUM Source Sans 3",
    source: "/fonts/lichtsaum-configurator/source-sans-3-variable.woff2",
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

export const MINI_CONFIGURATOR_AWNING_COLORS = [
  { id: "anthracite", label: "Anthrazit", value: "#34383A" },
  { id: "deep-black", label: "Tiefschwarz", value: "#171717" },
  { id: "white", label: "Weiß", value: "#E7E4DF" },
  { id: "cream-white", label: "Cremeweiß", value: "#DED5C3" },
  { id: "light-grey", label: "Hellgrau", value: "#B7B6B2" },
  { id: "sand", label: "Sand", value: "#C5B7A2" },
  { id: "warm-grey", label: "Warmgrau", value: "#827C74" },
  { id: "night-blue", label: "Nachtblau", value: "#263746" },
  { id: "dark-green", label: "Dunkelgrün", value: "#263D32" },
  { id: "terracotta", label: "Terrakotta", value: "#914936" },
  { id: "bordeaux", label: "Bordeaux", value: "#57272B" }
] as const;

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
  /^[\p{Script=Latin}\p{Script=Cyrillic}\p{Number}\p{Mark}\s.,!?&+/\-–—:'"()@№%€$]*$/u;
