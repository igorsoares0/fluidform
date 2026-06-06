"use client";

import { useEditorStore } from "@/lib/store/editor-store";
import {
  FONT_OPTIONS,
  PRESETS,
  PRESET_LABELS,
  PRESET_NAMES,
} from "@/lib/theme";
import type { ShadowToken, ThemeColors } from "@/lib/types";
import {
  ColorField,
  NumberField,
  Row,
  Section,
  SelectField,
} from "./controls";

const COLOR_FIELDS: { key: keyof ThemeColors; label: string }[] = [
  { key: "background", label: "Background" },
  { key: "surface", label: "Surface" },
  { key: "text", label: "Text" },
  { key: "mutedText", label: "Muted text" },
  { key: "primary", label: "Primary" },
  { key: "primaryText", label: "On primary" },
  { key: "border", label: "Border" },
];

export function ThemePanel() {
  const theme = useEditorStore((s) => s.present.theme);
  const setPreset = useEditorStore((s) => s.setThemePreset);
  const updateColors = useEditorStore((s) => s.updateThemeColors);
  const updateProp = useEditorStore((s) => s.updateThemeProp);

  return (
    <>
      <Section title="Preset">
        <div className="grid grid-cols-3 gap-2">
          {PRESET_NAMES.map((name) => {
            const t = PRESETS[name];
            const active = theme.preset === name;
            return (
              <button
                key={name}
                type="button"
                onClick={() => setPreset(name)}
                className={`overflow-hidden rounded-lg border text-left transition-colors ${
                  active
                    ? "border-blue-500 ring-1 ring-blue-500"
                    : "border-zinc-200 hover:border-zinc-300"
                }`}
              >
                <div
                  className="flex h-10 items-center gap-1 px-2"
                  style={{ backgroundColor: t.colors.background }}
                >
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: t.colors.text }}
                  />
                  <span
                    className="h-3 w-6 rounded-full"
                    style={{ backgroundColor: t.colors.primary }}
                  />
                </div>
                <div className="px-2 py-1 text-[11px] font-medium text-zinc-600">
                  {PRESET_LABELS[name]}
                </div>
              </button>
            );
          })}
        </div>
        {theme.preset === "custom" ? (
          <p className="text-[11px] text-zinc-400">
            Custom theme — based on a preset, with edits.
          </p>
        ) : null}
      </Section>

      <Section title="Colors">
        {COLOR_FIELDS.map(({ key, label }) => (
          <Row key={key} label={label}>
            <ColorField
              value={theme.tokens.colors[key]}
              onChange={(v) => updateColors({ [key]: v })}
            />
          </Row>
        ))}
      </Section>

      <Section title="Surface">
        <Row label="Font">
          <SelectField<string>
            value={theme.tokens.fontFamily}
            onChange={(fontFamily) => updateProp({ fontFamily })}
            options={FONT_OPTIONS}
          />
        </Row>
        <Row label="Radius">
          <NumberField
            value={theme.tokens.radius}
            min={0}
            onChange={(radius) => updateProp({ radius })}
          />
        </Row>
        <Row label="Shadow">
          <SelectField<ShadowToken>
            value={theme.tokens.shadow}
            onChange={(shadow) => updateProp({ shadow })}
            options={[
              { value: "none", label: "None" },
              { value: "sm", label: "Small" },
              { value: "md", label: "Medium" },
              { value: "lg", label: "Large" },
              { value: "xl", label: "X-Large" },
            ]}
          />
        </Row>
      </Section>
    </>
  );
}
