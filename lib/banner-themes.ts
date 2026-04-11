export interface BannerTheme {
  id: string;
  label: string;
  css: string;
  swatch: string;
}

export const BANNER_PRESETS: readonly BannerTheme[] = [
  {
    id: "meadow",
    label: "Eng",
    css: "linear-gradient(135deg, #7aa060 0%, #a8d08a 50%, #d4edbc 100%)",
    swatch: "#7aa060",
  },
  {
    id: "ocean",
    label: "Hav",
    css: "linear-gradient(135deg, #1a6fa8 0%, #5fa8d3 50%, #a8d8f0 100%)",
    swatch: "#5fa8d3",
  },
  {
    id: "sunset",
    label: "Solnedgang",
    css: "linear-gradient(135deg, #e07b39 0%, #f08a6e 40%, #f1b24a 100%)",
    swatch: "#f08a6e",
  },
  {
    id: "dusk",
    label: "Skumring",
    css: "linear-gradient(135deg, #8e6bb1 0%, #b898d8 50%, #e0c8f0 100%)",
    swatch: "#8e6bb1",
  },
  {
    id: "forest",
    label: "Skog",
    css: "linear-gradient(135deg, #2d6a4f 0%, #52b788 50%, #95d5b2 100%)",
    swatch: "#52b788",
  },
  {
    id: "coral",
    label: "Korall",
    css: "linear-gradient(135deg, #c85a6a 0%, #e89898 50%, #f8c8c8 100%)",
    swatch: "#c85a6a",
  },
  {
    id: "sky",
    label: "Himmel",
    css: "linear-gradient(135deg, #4a90c8 0%, #87bfe8 50%, #c8e0f8 100%)",
    swatch: "#4a90c8",
  },
  {
    id: "sand",
    label: "Sand",
    css: "linear-gradient(135deg, #c8a86a 0%, #e8c88a 50%, #f8e8c0 100%)",
    swatch: "#c8a86a",
  },
];

const PRESET_MAP = new Map(BANNER_PRESETS.map((p) => [p.id, p.css]));

export function isHexColor(value: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

export function resolveBannerBackground(value: string | null | undefined): string {
  if (!value) return BANNER_PRESETS[0].css;
  if (PRESET_MAP.has(value)) return PRESET_MAP.get(value)!;
  if (isHexColor(value)) return value;
  return BANNER_PRESETS[0].css;
}
