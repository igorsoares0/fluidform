import type { HeadingElement as HeadingEl } from "@/lib/types";
import { textStyle } from "./style";

export function HeadingElement({ element }: { element: HeadingEl }) {
  const align = element.style.textAlign ?? "left";
  return (
    <div
      className="flex h-full w-full items-center"
      style={{
        justifyContent:
          align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
      }}
    >
      <h2 className="w-full leading-tight" style={textStyle(element.style)}>
        {element.text || "Heading"}
      </h2>
    </div>
  );
}
