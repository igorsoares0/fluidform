"use client";

import { useEditorStore } from "@/lib/store/editor-store";
import type { Element, ShadowToken } from "@/lib/types";
import {
  ColorField,
  NumberField,
  Row,
  Section,
  SelectField,
  SliderField,
} from "./controls";

const hasBox = (t: Element["type"]) => t === "input" || t === "button";

export function StyleSection({ element }: { element: Element }) {
  const updateStyle = useEditorStore((s) => s.updateStyle);
  const id = element.id;
  const st = element.style;

  return (
    <Section title="Style">
      <Row label="Text color">
        <ColorField
          value={st.color ?? "#000000"}
          onChange={(color) => updateStyle(id, { color })}
        />
      </Row>

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
          <Row label="Background">
            <ColorField
              value={st.background ?? "#ffffff"}
              onChange={(background) => updateStyle(id, { background })}
            />
          </Row>
          <Row label="Border">
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
          <Row label="Radius">
            <NumberField
              value={st.radius ?? 0}
              min={0}
              onChange={(radius) => updateStyle(id, { radius })}
            />
          </Row>
          <Row label="Shadow">
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
