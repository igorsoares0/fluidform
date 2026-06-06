import type { ButtonElement as ButtonEl, ElementStyle } from "@/lib/types";
import { boxStyle } from "./style";

export function ButtonElement({
  element,
  style,
}: {
  element: ButtonEl;
  style: ElementStyle;
}) {
  return (
    <div
      className="flex h-full w-full items-center justify-center px-4 font-semibold"
      style={{
        ...boxStyle(style),
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        color: style.color,
      }}
    >
      {element.label || "Button"}
    </div>
  );
}
