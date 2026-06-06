"use client";

import type {
  CheckboxElement,
  DateElement,
  ElementStyle,
  NpsElement,
  RadioElement,
  RatingElement,
  SelectElement,
  SliderElement,
  UploadElement,
} from "@/lib/types";
import { boxStyle } from "../editor/elements/style";

function FieldLabel({
  text,
  required,
  color,
}: {
  text: string;
  required: boolean;
  color?: string;
}) {
  if (!text) return null;
  return (
    <span className="text-sm font-medium" style={{ color }}>
      {text}
      {required ? <span className="text-red-500"> *</span> : null}
    </span>
  );
}

const errorRing = "outline outline-2 outline-red-500";

export function RenderSelect({
  element,
  style,
  value,
  error,
  onChange,
}: {
  element: SelectElement;
  style: ElementStyle;
  value: string;
  error?: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex h-full w-full flex-col gap-1.5">
      <FieldLabel text={element.label} required={element.required} color={style.color} />
      <select
        value={value}
        required={element.required}
        onChange={(e) => onChange(e.target.value)}
        className={`min-h-10 flex-1 px-3 text-sm ${error ? errorRing : ""}`}
        style={{ ...boxStyle(style), borderStyle: "solid", borderWidth: style.borderWidth ?? 1 }}
      >
        <option value="" disabled>
          {element.placeholder || "Select an option"}
        </option>
        {element.options.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

export function RenderRadio({
  element,
  style,
  accent,
  value,
  onChange,
}: {
  element: RadioElement;
  style: ElementStyle;
  accent: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex h-full w-full flex-col gap-2">
      <FieldLabel text={element.label} required={element.required} color={style.color} />
      <div className="flex flex-col gap-2">
        {element.options.map((opt, i) => (
          <label key={i} className="flex cursor-pointer items-center gap-2.5">
            <input
              type="radio"
              name={element.id}
              checked={value === opt}
              onChange={() => onChange(opt)}
              style={{ accentColor: accent }}
              className="h-4 w-4"
            />
            <span className="text-sm" style={{ color: style.color }}>
              {opt}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

export function RenderCheckbox({
  element,
  style,
  accent,
  value,
  onChange,
}: {
  element: CheckboxElement;
  style: ElementStyle;
  accent: string;
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (opt: string) =>
    onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]);

  return (
    <div className="flex h-full w-full flex-col gap-2">
      <FieldLabel text={element.label} required={element.required} color={style.color} />
      <div className="flex flex-col gap-2">
        {element.options.map((opt, i) => (
          <label key={i} className="flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={value.includes(opt)}
              onChange={() => toggle(opt)}
              style={{ accentColor: accent }}
              className="h-4 w-4"
            />
            <span className="text-sm" style={{ color: style.color }}>
              {opt}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

export function RenderRating({
  element,
  style,
  accent,
  value,
  onChange,
}: {
  element: RatingElement;
  style: ElementStyle;
  accent: string;
  value: number | undefined;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex h-full w-full flex-col gap-2">
      <FieldLabel text={element.label} required={element.required} color={style.color} />
      <div className="flex gap-1">
        {Array.from({ length: element.max }).map((_, i) => {
          const filled = (value ?? 0) > i;
          return (
            <button
              key={i}
              type="button"
              onClick={() => onChange(i + 1)}
              aria-label={`${i + 1} stars`}
              className="cursor-pointer"
            >
              <svg className="h-7 w-7" viewBox="0 0 24 24" fill={filled ? accent : "none"} stroke={accent} strokeWidth="1.5" strokeLinejoin="round">
                <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7L12 2z" />
              </svg>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function RenderNps({
  element,
  style,
  accent,
  value,
  onChange,
}: {
  element: NpsElement;
  style: ElementStyle;
  accent: string;
  value: number | undefined;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex h-full w-full flex-col gap-2">
      <FieldLabel text={element.label} required={element.required} color={style.color} />
      <div className="flex gap-1">
        {Array.from({ length: 11 }).map((_, i) => {
          const active = value === i;
          return (
            <button
              key={i}
              type="button"
              onClick={() => onChange(i)}
              className="flex h-8 flex-1 cursor-pointer items-center justify-center rounded border text-xs font-medium transition-colors"
              style={{
                borderColor: active ? accent : style.borderColor,
                background: active ? accent : "transparent",
                color: active ? "#fff" : style.color,
              }}
            >
              {i}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function RenderSlider({
  element,
  style,
  accent,
  value,
  onChange,
}: {
  element: SliderElement;
  style: ElementStyle;
  accent: string;
  value: number | undefined;
  onChange: (v: number) => void;
}) {
  const current = value ?? element.min;
  return (
    <div className="flex h-full w-full flex-col gap-2">
      <div className="flex items-center justify-between">
        <FieldLabel text={element.label} required={element.required} color={style.color} />
        <span className="text-sm font-medium" style={{ color: style.color }}>
          {current}
        </span>
      </div>
      <input
        type="range"
        min={element.min}
        max={element.max}
        step={element.step}
        value={current}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ accentColor: accent }}
        className="w-full"
      />
      <div className="flex justify-between text-xs" style={{ color: style.color, opacity: 0.6 }}>
        <span>{element.min}</span>
        <span>{element.max}</span>
      </div>
    </div>
  );
}

export function RenderDate({
  element,
  style,
  value,
  error,
  onChange,
}: {
  element: DateElement;
  style: ElementStyle;
  value: string;
  error?: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex h-full w-full flex-col gap-1.5">
      <FieldLabel text={element.label} required={element.required} color={style.color} />
      <input
        type="date"
        value={value}
        required={element.required}
        onChange={(e) => onChange(e.target.value)}
        className={`min-h-10 flex-1 px-3 text-sm ${error ? errorRing : ""}`}
        style={{ ...boxStyle(style), borderStyle: "solid", borderWidth: style.borderWidth ?? 1 }}
      />
    </label>
  );
}

export function RenderUpload({
  element,
  style,
  value,
  error,
  onChange,
}: {
  element: UploadElement;
  style: ElementStyle;
  value: string;
  error?: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex h-full w-full cursor-pointer flex-col gap-1.5">
      <FieldLabel text={element.label} required={element.required} color={style.color} />
      <div
        className={`flex flex-1 flex-col items-center justify-center gap-1 text-sm ${
          error ? errorRing : ""
        }`}
        style={{
          borderRadius: style.radius,
          border: `1.5px dashed ${style.borderColor ?? "#d4d4d8"}`,
          background: style.background,
          color: value ? style.color : "#9ca3af",
          minHeight: 56,
        }}
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
        </svg>
        <span className="text-xs">{value || "Click to upload"}</span>
      </div>
      <input
        type="file"
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0]?.name ?? "")}
      />
    </label>
  );
}
