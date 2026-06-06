import type { InputElement as InputEl } from "@/lib/types";
import { boxStyle } from "./style";

export function InputElement({ element }: { element: InputEl }) {
  return (
    <div className="flex h-full w-full flex-col gap-1.5">
      {element.label ? (
        <label
          className="text-sm font-medium"
          style={{ color: element.style.color ?? "#0a0a0a" }}
        >
          {element.label}
          {element.required ? <span className="text-red-500"> *</span> : null}
        </label>
      ) : null}
      <div
        className="flex flex-1 items-center px-3 text-sm"
        style={{
          ...boxStyle(element.style),
          color: "#9ca3af",
          minHeight: 40,
        }}
      >
        {element.placeholder || "Placeholder"}
      </div>
    </div>
  );
}
