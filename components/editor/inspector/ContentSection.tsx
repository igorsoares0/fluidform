"use client";

import { useEditorStore } from "@/lib/store/editor-store";
import type { Element, InputType, ButtonAction, TextAlign } from "@/lib/types";
import {
  Row,
  Section,
  SelectField,
  Segmented,
  TextArea,
  TextField,
  Toggle,
} from "./controls";

export function ContentSection({ element }: { element: Element }) {
  const updateElement = useEditorStore((s) => s.updateElement);
  const updateStyle = useEditorStore((s) => s.updateStyle);
  const id = element.id;

  if (element.type === "heading" || element.type === "text") {
    return (
      <Section title="Content">
        <TextArea
          value={element.text}
          onChange={(text) => updateElement(id, { text })}
        />
        <Row label="Align">
          <Segmented<TextAlign>
            value={element.style.textAlign ?? "left"}
            onChange={(textAlign) => updateStyle(id, { textAlign })}
            options={[
              { value: "left", label: "L" },
              { value: "center", label: "C" },
              { value: "right", label: "R" },
            ]}
          />
        </Row>
      </Section>
    );
  }

  if (element.type === "input") {
    return (
      <Section title="Content">
        <Row label="Label">
          <TextField
            value={element.label}
            onChange={(label) => updateElement(id, { label })}
          />
        </Row>
        <Row label="Placeholder">
          <TextField
            value={element.placeholder}
            onChange={(placeholder) => updateElement(id, { placeholder })}
          />
        </Row>
        <Row label="Type">
          <SelectField<InputType>
            value={element.inputType}
            onChange={(inputType) => updateElement(id, { inputType })}
            options={[
              { value: "text", label: "Text" },
              { value: "email", label: "Email" },
              { value: "phone", label: "Phone" },
              { value: "number", label: "Number" },
              { value: "password", label: "Password" },
            ]}
          />
        </Row>
        <Row label="Required">
          <Toggle
            checked={element.required}
            onChange={(required) => updateElement(id, { required })}
          />
        </Row>
      </Section>
    );
  }

  // button
  return (
    <Section title="Content">
      <Row label="Label">
        <TextField
          value={element.label}
          onChange={(label) => updateElement(id, { label })}
        />
      </Row>
      <Row label="Action">
        <SelectField<ButtonAction>
          value={element.action}
          onChange={(action) => updateElement(id, { action })}
          options={[
            { value: "submit", label: "Submit" },
            { value: "next", label: "Next step" },
            { value: "link", label: "Link" },
          ]}
        />
      </Row>
      {element.action === "link" ? (
        <Row label="URL">
          <TextField
            value={element.href ?? ""}
            placeholder="https://"
            onChange={(href) => updateElement(id, { href })}
          />
        </Row>
      ) : null}
    </Section>
  );
}
