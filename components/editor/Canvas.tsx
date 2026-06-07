"use client";

import { useEffect, useRef, useState } from "react";
import { useEditorStore } from "@/lib/store/editor-store";
import { CANVAS_WIDTH, columnWidth } from "@/lib/grid";
import type { Breakpoint, Element } from "@/lib/types";
import { CanvasElement } from "./CanvasElement";
import { AlignmentGuides } from "./AlignmentGuides";

const PAD = 48; // breathing room around the canvas, in screen px

/** Surface height fits content tightly (floored at the base minHeight). */
function surfaceHeight(
  elements: Element[],
  bp: Breakpoint,
  minHeight: number,
): number {
  // No trailing breathing room: the lowest element's bottom *is* the surface
  // bottom, so a full-bleed element sits flush and the bottom edge stays a snap
  // target (no "chase"). Scroll padding lives outside the surface (PAD).
  let contentBottom = minHeight;
  for (const el of elements) {
    if (el.hidden) continue;
    const p = el.position[bp];
    contentBottom = Math.max(contentBottom, p.y + p.height);
  }
  return contentBottom;
}

export function Canvas() {
  const breakpoint = useEditorStore((s) => s.breakpoint);
  const page = useEditorStore((s) =>
    s.present.pages.find((p) => p.id === s.activePageId),
  );
  const theme = useEditorStore((s) => s.present.theme);
  const clearSelection = useEditorStore((s) => s.clearSelection);

  const viewportRef = useRef<HTMLDivElement>(null);
  const [availWidth, setAvailWidth] = useState(0);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const update = () => setAvailWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  if (!page) return null;

  const width = CANVAS_WIDTH[breakpoint];
  const height = surfaceHeight(page.canvas.elements, breakpoint, page.canvas.minHeight);
  const col = columnWidth(breakpoint);

  // Zoom-to-fit width: scale the canvas down so it never overflows horizontally.
  const scale = availWidth > 0 ? Math.min(1, (availWidth - PAD * 2) / width) : 1;

  return (
    <div
      ref={viewportRef}
      className="h-full w-full overflow-x-hidden overflow-y-auto bg-zinc-100"
    >
      <div className="flex min-h-full items-start justify-center" style={{ padding: PAD }}>
        {/* Sizer reserves the scaled footprint so scrolling/centering is correct. */}
        <div style={{ width: width * scale, height: height * scale }} className="relative shrink-0">
          <div
            className="absolute top-0 left-0 origin-top-left overflow-hidden rounded-xl shadow-sm ring-1 ring-zinc-200"
            style={{
              width,
              height,
              transform: `scale(${scale})`,
              backgroundColor: theme.tokens.colors.background,
              fontFamily: theme.tokens.fontFamily,
              backgroundImage:
                "radial-gradient(circle, rgba(127,127,127,0.12) 1px, transparent 1px)",
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
                  canvas={{ width, height }}
                  scale={scale}
                  theme={theme}
                />
              ))}
            <AlignmentGuides />
          </div>
        </div>
      </div>
    </div>
  );
}
