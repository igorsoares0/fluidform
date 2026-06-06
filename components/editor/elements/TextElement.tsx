import type { ElementStyle, TextElement as TextEl } from "@/lib/types";
import { textStyle } from "./style";

export function TextElement({
  element,
  style,
}: {
  element: TextEl;
  style: ElementStyle;
}) {
  return (
    <div className="flex h-full w-full items-center">
      <p className="w-full leading-relaxed" style={textStyle(style)}>
        {element.text || "Paragraph text"}
      </p>
    </div>
  );
}
