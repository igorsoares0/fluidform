import type { ElementStyle, InputElement as InputEl } from "@/lib/types";
import { boxStyle } from "./style";

export function InputElement({
  element,
  style,
}: {
  element: InputEl;
  style: ElementStyle;
}) {
  return (
    <div className="flex h-full w-full flex-col gap-1.5">
      {element.label ? (
        <label className="text-sm font-medium" style={{ color: style.color }}>
          {element.label}
          {element.required ? <span className="text-red-500"> *</span> : null}
        </label>
      ) : null}
      <div
        className="flex flex-1 items-center px-3 text-sm"
        style={{
          ...boxStyle(style),
          color: "#9ca3af",
          minHeight: 40,
        }}
      >
        {element.placeholder || "Placeholder"}
      </div>
    </div>
  );
}
