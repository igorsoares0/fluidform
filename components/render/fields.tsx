"use client";

import type {
  ButtonElement,
  ElementStyle,
  HeadingElement,
  InputElement,
  InputType,
  TextElement,
} from "@/lib/types";
import { boxStyle, textStyle } from "../editor/elements/style";

const INPUT_TYPE_MAP: Record<InputType, string> = {
  text: "text",
  email: "email",
  phone: "tel",
  number: "number",
  password: "password",
};

export function RenderHeading({
  element,
  style,
}: {
  element: HeadingElement;
  style: ElementStyle;
}) {
  const align = style.textAlign ?? "left";
  return (
    <div
      className="flex h-full w-full items-center"
      style={{
        justifyContent:
          align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
      }}
    >
      <h2 className="w-full leading-tight" style={textStyle(style)}>
        {element.text}
      </h2>
    </div>
  );
}

export function RenderText({
  element,
  style,
}: {
  element: TextElement;
  style: ElementStyle;
}) {
  return (
    <div className="flex h-full w-full items-center">
      <p className="w-full leading-relaxed" style={textStyle(style)}>
        {element.text}
      </p>
    </div>
  );
}

export function RenderInput({
  element,
  style,
  value,
  error,
  onChange,
}: {
  element: InputElement;
  style: ElementStyle;
  value: string;
  error?: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex h-full w-full flex-col gap-1.5">
      {element.label ? (
        <label className="text-sm font-medium" style={{ color: style.color }}>
          {element.label}
          {element.required ? <span className="text-red-500"> *</span> : null}
        </label>
      ) : null}
      <input
        type={INPUT_TYPE_MAP[element.inputType]}
        value={value}
        required={element.required}
        placeholder={element.placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-10 flex-1 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        style={{
          ...boxStyle(style),
          borderColor: error ? "#ef4444" : style.borderColor,
          borderStyle: "solid",
          borderWidth: style.borderWidth ?? 1,
        }}
      />
      {error ? (
        <span className="text-xs text-red-500">This field is required.</span>
      ) : null}
    </div>
  );
}

export function RenderButton({
  element,
  style,
  onActivate,
}: {
  element: ButtonElement;
  style: ElementStyle;
  onActivate: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onActivate}
      className="h-full w-full cursor-pointer px-4 font-semibold transition-opacity hover:opacity-90"
      style={{
        ...boxStyle(style),
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        color: style.color,
      }}
    >
      {element.label}
    </button>
  );
}
