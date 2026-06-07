"use client";

import { useEditorStore } from "@/lib/store/editor-store";
import type {
  ButtonAction,
  Element,
  InputType,
  ObjectFit,
  TextAlign,
} from "@/lib/types";
import {
  NumberField,
  OptionsEditor,
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

  // Shared controls reused across field types.
  const labelRow = "label" in element && (
    <Row label="Label">
      <TextField
        value={element.label}
        onChange={(label) => updateElement(id, { label })}
      />
    </Row>
  );
  const requiredRow = "required" in element && (
    <Row label="Required">
      <Toggle
        checked={element.required}
        onChange={(required) => updateElement(id, { required })}
      />
    </Row>
  );

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

  if (element.type === "image") {
    return (
      <Section title="Content">
        <Row label="Image URL">
          <TextField
            value={element.src}
            placeholder="https://…"
            onChange={(src) => updateElement(id, { src })}
          />
        </Row>
        <Row label="Alt text">
          <TextField
            value={element.alt}
            onChange={(alt) => updateElement(id, { alt })}
          />
        </Row>
        <Row label="Fit">
          <SelectField<ObjectFit>
            value={element.fit}
            onChange={(fit) => updateElement(id, { fit })}
            options={[
              { value: "cover", label: "Cover" },
              { value: "contain", label: "Contain" },
              { value: "fill", label: "Fill" },
            ]}
          />
        </Row>
      </Section>
    );
  }

  if (element.type === "input") {
    return (
      <Section title="Content">
        {labelRow}
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
        {requiredRow}
      </Section>
    );
  }

  if (element.type === "button") {
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

  if (element.type === "select") {
    return (
      <Section title="Content">
        {labelRow}
        <Row label="Placeholder">
          <TextField
            value={element.placeholder}
            onChange={(placeholder) => updateElement(id, { placeholder })}
          />
        </Row>
        <OptionsEditor
          value={element.options}
          onChange={(options) => updateElement(id, { options })}
        />
        {requiredRow}
      </Section>
    );
  }

  if (element.type === "radio" || element.type === "checkbox") {
    return (
      <Section title="Content">
        {labelRow}
        <OptionsEditor
          value={element.options}
          onChange={(options) => updateElement(id, { options })}
        />
        {requiredRow}
      </Section>
    );
  }

  if (element.type === "rating") {
    return (
      <Section title="Content">
        {labelRow}
        <Row label="Max stars">
          <NumberField
            value={element.max}
            min={1}
            max={10}
            onChange={(max) => updateElement(id, { max })}
          />
        </Row>
        {requiredRow}
      </Section>
    );
  }

  if (element.type === "slider") {
    return (
      <Section title="Content">
        {labelRow}
        <Row label="Min">
          <NumberField
            value={element.min}
            onChange={(min) => updateElement(id, { min })}
          />
        </Row>
        <Row label="Max">
          <NumberField
            value={element.max}
            onChange={(max) => updateElement(id, { max })}
          />
        </Row>
        <Row label="Step">
          <NumberField
            value={element.step}
            min={1}
            onChange={(step) => updateElement(id, { step })}
          />
        </Row>
        {requiredRow}
      </Section>
    );
  }

  // nps, date, upload — label + required only
  return (
    <Section title="Content">
      {labelRow}
      {requiredRow}
    </Section>
  );
}
