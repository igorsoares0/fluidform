"use client";

import { useEditorStore } from "@/lib/store/editor-store";
import { resolveElementStyle } from "@/lib/theme";
import type { Element, ShadowToken, ThemeConfig } from "@/lib/types";
import {
  ColorField,
  NumberField,
  Row,
  Section,
  SelectField,
  SliderField,
} from "./controls";

const hasBox = (t: Element["type"]) =>
  t === "input" ||
  t === "button" ||
  t === "select" ||
  t === "date" ||
  t === "upload" ||
  t === "image";

export function StyleSection({
  element,
  theme,
}: {
  element: Element;
  theme: ThemeConfig;
}) {
  const updateStyle = useEditorStore((s) => s.updateStyle);
  const id = element.id;
  // Display the *resolved* values (theme defaults + overrides) so the controls
  // reflect what's actually rendered. Editing writes a per-element override.
  const st = resolveElementStyle(element, theme);
  const own = element.style;

  // Reset a theme-driven property back to inheriting from the theme.
  const reset = (key: keyof typeof own) =>
    own[key] !== undefined
      ? () => updateStyle(id, { [key]: undefined })
      : undefined;

  return (
    <Section title="Style">
      {element.type !== "image" ? (
        <Row label="Text color" onReset={reset("color")}>
          <ColorField
            value={st.color ?? "#000000"}
            onChange={(color) => updateStyle(id, { color })}
          />
        </Row>
      ) : null}

      {element.type === "heading" || element.type === "text" ? (
        <>
          <Row label="Font size">
            <NumberField
              value={st.fontSize ?? 16}
              min={8}
              onChange={(fontSize) => updateStyle(id, { fontSize })}
            />
          </Row>
          <Row label="Weight">
            <SelectField<string>
              value={String(st.fontWeight ?? 400)}
              onChange={(v) => updateStyle(id, { fontWeight: Number(v) })}
              options={[
                { value: "400", label: "Regular" },
                { value: "500", label: "Medium" },
                { value: "600", label: "Semibold" },
                { value: "700", label: "Bold" },
                { value: "800", label: "Extrabold" },
              ]}
            />
          </Row>
        </>
      ) : null}

      {hasBox(element.type) ? (
        <>
          <Row label="Background" onReset={reset("background")}>
            <ColorField
              value={st.background ?? "#ffffff"}
              onChange={(background) => updateStyle(id, { background })}
            />
          </Row>
          <Row label="Border" onReset={reset("borderColor")}>
            <ColorField
              value={st.borderColor ?? "#d4d4d8"}
              onChange={(borderColor) => updateStyle(id, { borderColor })}
            />
          </Row>
          <Row label="Border width">
            <NumberField
              value={st.borderWidth ?? 0}
              min={0}
              max={12}
              onChange={(borderWidth) => updateStyle(id, { borderWidth })}
            />
          </Row>
          <Row label="Radius" onReset={reset("radius")}>
            <NumberField
              value={st.radius ?? 0}
              min={0}
              onChange={(radius) => updateStyle(id, { radius })}
            />
          </Row>
          <Row label="Shadow" onReset={reset("shadow")}>
            <SelectField<ShadowToken>
              value={st.shadow ?? "none"}
              onChange={(shadow) => updateStyle(id, { shadow })}
              options={[
                { value: "none", label: "None" },
                { value: "sm", label: "Small" },
                { value: "md", label: "Medium" },
                { value: "lg", label: "Large" },
                { value: "xl", label: "X-Large" },
              ]}
            />
          </Row>
        </>
      ) : null}

      <Row label="Opacity">
        <SliderField
          value={Math.round((st.opacity ?? 1) * 100)}
          min={0}
          max={100}
          onChange={(v) => updateStyle(id, { opacity: v / 100 })}
        />
      </Row>
    </Section>
  );
}
