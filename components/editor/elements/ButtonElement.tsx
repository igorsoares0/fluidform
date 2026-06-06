import type { ButtonElement as ButtonEl } from "@/lib/types";
import { boxStyle } from "./style";

export function ButtonElement({ element }: { element: ButtonEl }) {
  return (
    <div
      className="flex h-full w-full items-center justify-center px-4 font-semibold"
      style={{
        ...boxStyle(element.style),
        fontSize: element.style.fontSize,
        fontWeight: element.style.fontWeight,
        color: element.style.color,
      }}
    >
      {element.label || "Button"}
    </div>
  );
}
