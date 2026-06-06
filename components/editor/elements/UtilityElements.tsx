import type { DateElement, ElementStyle, UploadElement } from "@/lib/types";
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

export function DatePreview({
  element,
  style,
}: {
  element: DateElement;
  style: ElementStyle;
}) {
  return (
    <div className="flex h-full w-full flex-col gap-1.5">
      <FieldLabel text={element.label} required={element.required} color={style.color} />
      <div
        className="flex flex-1 items-center justify-between px-3 text-sm"
        style={{ ...boxStyle(style), color: "#9ca3af", minHeight: 40 }}
      >
        <span>mm / dd / yyyy</span>
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      </div>
    </div>
  );
}

export function UploadPreview({
  element,
  style,
}: {
  element: UploadElement;
  style: ElementStyle;
}) {
  return (
    <div className="flex h-full w-full flex-col gap-1.5">
      <FieldLabel text={element.label} required={element.required} color={style.color} />
      <div
        className="flex flex-1 flex-col items-center justify-center gap-1 text-sm"
        style={{
          borderRadius: style.radius,
          border: `1.5px dashed ${style.borderColor ?? "#d4d4d8"}`,
          background: style.background,
          color: "#9ca3af",
          minHeight: 56,
        }}
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
        </svg>
        <span className="text-xs">Click to upload</span>
      </div>
    </div>
  );
}
