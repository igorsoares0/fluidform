"use client";

import { useEditorStore } from "@/lib/store/editor-store";
import { CANVAS_WIDTH, columnWidth } from "@/lib/grid";
import { CanvasElement } from "./CanvasElement";
import { AlignmentGuides } from "./AlignmentGuides";

export function Canvas() {
  const breakpoint = useEditorStore((s) => s.breakpoint);
  const page = useEditorStore((s) =>
    s.present.pages.find((p) => p.id === s.activePageId),
  );
  const clearSelection = useEditorStore((s) => s.clearSelection);

  if (!page) return null;

  const width = CANVAS_WIDTH[breakpoint];
  const minHeight = page.canvas.minHeight;
  const col = columnWidth(breakpoint);

  return (
    <div className="flex h-full w-full justify-center overflow-auto bg-zinc-100 p-10">
      <div
        className="relative shrink-0 rounded-xl bg-white shadow-sm ring-1 ring-zinc-200"
        style={{
          width,
          minHeight,
          // Decorative grid dots aligned to the snapping columns.
          backgroundImage:
            "radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px)",
          backgroundSize: `${col}px ${col}px`,
        }}
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) clearSelection();
        }}
      >
        {page.canvas.elements
          .filter((el) => !el.hidden)
          .map((el) => (
            <CanvasElement
              key={el.id}
              element={el}
              breakpoint={breakpoint}
              canvas={{ width, height: minHeight }}
            />
          ))}
        <AlignmentGuides />
      </div>
    </div>
  );
}
