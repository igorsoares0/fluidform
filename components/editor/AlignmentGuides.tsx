"use client";

import { useEditorStore } from "@/lib/store/editor-store";

/** Draws the live snap/alignment guides reported by the store during drag/resize. */
export function AlignmentGuides() {
  const guides = useEditorStore((s) => s.dragGuides);
  if (guides.length === 0) return null;

  return (
    <>
      {guides.map((g, i) =>
        g.axis === "x" ? (
          <div
            key={i}
            className="pointer-events-none absolute top-0 bottom-0 z-50 w-px bg-blue-500"
            style={{ left: g.position }}
          />
        ) : (
          <div
            key={i}
            className="pointer-events-none absolute right-0 left-0 z-50 h-px bg-blue-500"
            style={{ top: g.position }}
          />
        ),
      )}
    </>
  );
}
