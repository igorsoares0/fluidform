import type {
  Element,
  ElementStyle,
  FormSchema,
  ThemeConfig,
  ThemeTokens,
} from "./types";

export const SANS_FONT =
  "var(--font-sans), ui-sans-serif, system-ui, sans-serif";
export const SERIF_FONT = "Georgia, 'Times New Roman', serif";

export const FONT_OPTIONS: { value: string; label: string }[] = [
  { value: SANS_FONT, label: "Sans" },
  { value: SERIF_FONT, label: "Serif" },
];

// --- Presets (spec V1: Minimal, Startup, Editorial, Luxury, Dark, Glass) ---

export const PRESETS: Record<string, ThemeTokens> = {
  minimal: {
    colors: {
      background: "#ffffff",
      surface: "#ffffff",
      text: "#0a0a0a",
      mutedText: "#52525b",
      primary: "#2563eb",
      primaryText: "#ffffff",
      border: "#d4d4d8",
    },
    fontFamily: SANS_FONT,
    radius: 10,
    shadow: "none",
  },
  startup: {
    colors: {
      background: "#f7f7ff",
      surface: "#ffffff",
      text: "#18181b",
      mutedText: "#71717a",
      primary: "#6d28d9",
      primaryText: "#ffffff",
      border: "#e4e4e7",
    },
    fontFamily: SANS_FONT,
    radius: 14,
    shadow: "md",
  },
  editorial: {
    colors: {
      background: "#faf7f2",
      surface: "#ffffff",
      text: "#1a1a1a",
      mutedText: "#6b6b6b",
      primary: "#1a1a1a",
      primaryText: "#ffffff",
      border: "#e4ddd2",
    },
    fontFamily: SERIF_FONT,
    radius: 2,
    shadow: "none",
  },
  luxury: {
    colors: {
      background: "#14110f",
      surface: "#1d1916",
      text: "#f5efe6",
      mutedText: "#b8a98f",
      primary: "#c9a227",
      primaryText: "#14110f",
      border: "#3a3026",
    },
    fontFamily: SERIF_FONT,
    radius: 4,
    shadow: "lg",
  },
  dark: {
    colors: {
      background: "#0b0b0f",
      surface: "#17171d",
      text: "#f4f4f5",
      mutedText: "#a1a1aa",
      primary: "#3b82f6",
      primaryText: "#ffffff",
      border: "#2a2a33",
    },
    fontFamily: SANS_FONT,
    radius: 12,
    shadow: "md",
  },
  glass: {
    colors: {
      background: "#e9e7ff",
      surface: "rgba(255,255,255,0.55)",
      text: "#1e1b3a",
      mutedText: "#4b466b",
      primary: "#4f46e5",
      primaryText: "#ffffff",
      border: "rgba(255,255,255,0.8)",
    },
    fontFamily: SANS_FONT,
    radius: 16,
    shadow: "lg",
  },
};

export const PRESET_NAMES = Object.keys(PRESETS);

export const PRESET_LABELS: Record<string, string> = {
  minimal: "Minimal",
  startup: "Startup",
  editorial: "Editorial",
  luxury: "Luxury",
  dark: "Dark",
  glass: "Glass",
};

export function presetTheme(name: string): ThemeConfig {
  const tokens = PRESETS[name] ?? PRESETS.minimal;
  return { preset: name, tokens: structuredClone(tokens) };
}

export function defaultTheme(): ThemeConfig {
  return presetTheme("minimal");
}

/**
 * Backfill the theme for schemas saved before the theme engine existed
 * (or partially-shaped tokens). Safe to call on every load.
 */
export function normalizeSchema(schema: FormSchema): FormSchema {
  const theme = schema.theme as Partial<ThemeConfig> | undefined;
  if (theme?.tokens?.colors && typeof theme.tokens.radius === "number") {
    return schema;
  }
  return { ...schema, theme: presetTheme(theme?.preset ?? "minimal") };
}

// --- Style resolution: theme defaults overlaid by per-element overrides ---

/** Theme-derived default style for an element type (before overrides). */
function baseStyle(type: Element["type"], t: ThemeTokens): ElementStyle {
  switch (type) {
    case "heading":
      return { color: t.colors.text };
    case "text":
      return { color: t.colors.mutedText };
    case "image":
      return { radius: t.radius };
    case "input":
    case "select":
    case "date":
    case "upload":
      return {
        background: t.colors.surface,
        color: t.colors.text,
        borderColor: t.colors.border,
        borderWidth: 1,
        radius: t.radius,
      };
    case "button":
      return {
        background: t.colors.primary,
        color: t.colors.primaryText,
        radius: t.radius,
        shadow: t.shadow,
      };
    case "radio":
    case "checkbox":
    case "rating":
    case "nps":
    case "slider":
      return { color: t.colors.text, borderColor: t.colors.border };
  }
}

/** The theme's accent color (used by choice/feedback controls). */
export function themeAccent(theme: ThemeConfig): string {
  return theme.tokens.colors.primary;
}

/** Merge only the *defined* keys of `override` onto `base`. */
function overlay(base: ElementStyle, override: ElementStyle): ElementStyle {
  const out: ElementStyle = { ...base };
  for (const [k, v] of Object.entries(override)) {
    if (v !== undefined) (out as Record<string, unknown>)[k] = v;
  }
  return out;
}

/** The effective style an element actually renders with, given the theme. */
export function resolveElementStyle(
  element: Element,
  theme: ThemeConfig,
): ElementStyle {
  return overlay(baseStyle(element.type, theme.tokens), element.style);
}
