import type { TextElement as TextEl } from "@/lib/types";
import { textStyle } from "./style";

export function TextElement({ element }: { element: TextEl }) {
  return (
    <div className="flex h-full w-full items-center">
      <p className="w-full leading-relaxed" style={textStyle(element.style)}>
        {element.text || "Paragraph text"}
      </p>
    </div>
  );
}
