import type { ElementStyle, HeadingElement as HeadingEl } from "@/lib/types";
import { textStyle } from "./style";

export function HeadingElement({
  element,
  style,
}: {
  element: HeadingEl;
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
        {element.text || "Heading"}
      </h2>
    </div>
  );
}
