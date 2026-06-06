import type {
  CheckboxElement,
  ElementStyle,
  RadioElement,
  SelectElement,
} from "@/lib/types";
import { boxStyle } from "./style";

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
    <label className="text-sm font-medium" style={{ color }}>
      {text}
      {required ? <span className="text-red-500"> *</span> : null}
    </label>
  );
}

export function SelectPreview({
  element,
  style,
}: {
  element: SelectElement;
  style: ElementStyle;
}) {
  return (
    <div className="flex h-full w-full flex-col gap-1.5">
      <FieldLabel text={element.label} required={element.required} color={style.color} />
      <div
        className="flex flex-1 items-center justify-between px-3 text-sm"
        style={{ ...boxStyle(style), color: "#9ca3af", minHeight: 40 }}
      >
        <span>{element.placeholder || "Select an option"}</span>
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}

export function RadioPreview({
  element,
  style,
  accent,
}: {
  element: RadioElement;
  style: ElementStyle;
  accent: string;
}) {
  return (
    <div className="flex h-full w-full flex-col gap-2">
      <FieldLabel text={element.label} required={element.required} color={style.color} />
      <div className="flex flex-col gap-2">
        {element.options.map((opt, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <span
              className="flex h-4 w-4 items-center justify-center rounded-full border"
              style={{ borderColor: i === 0 ? accent : style.borderColor }}
            >
              {i === 0 ? (
                <span className="h-2 w-2 rounded-full" style={{ background: accent }} />
              ) : null}
            </span>
            <span className="text-sm" style={{ color: style.color }}>
              {opt}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CheckboxPreview({
  element,
  style,
  accent,
}: {
  element: CheckboxElement;
  style: ElementStyle;
  accent: string;
}) {
  return (
    <div className="flex h-full w-full flex-col gap-2">
      <FieldLabel text={element.label} required={element.required} color={style.color} />
      <div className="flex flex-col gap-2">
        {element.options.map((opt, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <span
              className="flex h-4 w-4 items-center justify-center rounded border"
              style={{
                borderColor: i === 0 ? accent : style.borderColor,
                background: i === 0 ? accent : "transparent",
              }}
            >
              {i === 0 ? (
                <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              ) : null}
            </span>
            <span className="text-sm" style={{ color: style.color }}>
              {opt}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
