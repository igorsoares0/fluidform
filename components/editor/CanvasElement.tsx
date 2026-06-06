"use client";

import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import { useEditorStore } from "@/lib/store/editor-store";
import { clamp, MIN_ELEMENT_SIZE } from "@/lib/grid";
import { edgeCandidates, snapEdge, snapMove, type Guide } from "@/lib/snapping";
import type { Breakpoint, Element, Position, ThemeConfig } from "@/lib/types";
import { renderElement } from "./elements";

type Handle = {
  name: string;
  hx: -1 | 0 | 1; // -1 left edge, 1 right edge, 0 none
  hy: -1 | 0 | 1; // -1 top edge, 1 bottom edge, 0 none
  cursor: string;
};

const HANDLES: Handle[] = [
  { name: "nw", hx: -1, hy: -1, cursor: "nwse-resize" },
  { name: "n", hx: 0, hy: -1, cursor: "ns-resize" },
  { name: "ne", hx: 1, hy: -1, cursor: "nesw-resize" },
  { name: "e", hx: 1, hy: 0, cursor: "ew-resize" },
  { name: "se", hx: 1, hy: 1, cursor: "nwse-resize" },
  { name: "s", hx: 0, hy: 1, cursor: "ns-resize" },
  { name: "sw", hx: -1, hy: 1, cursor: "nesw-resize" },
  { name: "w", hx: -1, hy: 0, cursor: "ew-resize" },
];

type CanvasDims = { width: number; height: number };

export function CanvasElement({
  element,
  breakpoint,
  canvas,
  theme,
}: {
  element: Element;
  breakpoint: Breakpoint;
  canvas: CanvasDims;
  theme: ThemeConfig;
}) {
  const selected = useEditorStore((s) => s.selectedIds.includes(element.id));
  const interaction = useRef(false);

  const pos = element.position[breakpoint];

  /** Rects of the other (non-selected) elements, for snapping. */
  function otherRects(excludeIds: Set<string>): Position[] {
    return useEditorStore
      .getState()
      .activeElements()
      .filter((e) => !excludeIds.has(e.id) && !e.hidden)
      .map((e) => e.position[breakpoint]);
  }

  function startDrag(e: ReactPointerEvent) {
    if (element.locked) return;
    e.stopPropagation();
    const store = useEditorStore.getState();

    // Resolve selection: clicking an unselected element selects only it;
    // clicking within an existing multi-selection keeps the group.
    const already = store.selectedIds.includes(element.id);
    if (e.shiftKey) {
      store.addToSelection(element.id);
    } else if (!already) {
      store.selectOnly(element.id);
    }
    const selectedIds = useEditorStore.getState().selectedIds;

    const startX = e.clientX;
    const startY = e.clientY;
    const starts = new Map<string, Position>();
    for (const el of useEditorStore.getState().activeElements()) {
      if (selectedIds.includes(el.id)) {
        starts.set(el.id, { ...el.position[breakpoint] });
      }
    }
    const others = otherRects(new Set(selectedIds));

    store.beginInteraction();
    interaction.current = true;

    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      const primaryStart = starts.get(element.id)!;
      const moved = { ...primaryStart, x: primaryStart.x + dx, y: primaryStart.y + dy };
      const snap = snapMove(moved, others, canvas);
      const snapDx = snap.x - moved.x;
      const snapDy = snap.y - moved.y;

      const s = useEditorStore.getState();
      for (const [id, start] of starts) {
        s.updatePositionLive(id, breakpoint, {
          ...start,
          x: Math.round(start.x + dx + snapDx),
          y: Math.round(start.y + dy + snapDy),
        });
      }
      s.setGuides(snap.guides);
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      interaction.current = false;
      useEditorStore.getState().endInteraction();
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  function startResize(e: ReactPointerEvent, handle: Handle) {
    if (element.locked) return;
    e.stopPropagation();
    const store = useEditorStore.getState();
    store.selectOnly(element.id);

    const start = { ...pos };
    const startX = e.clientX;
    const startY = e.clientY;
    const right = start.x + start.width;
    const bottom = start.y + start.height;
    const cand = edgeCandidates(otherRects(new Set([element.id])), canvas);

    store.beginInteraction();
    interaction.current = true;

    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      let { x, y, width, height } = start;
      const guides: Guide[] = [];

      if (handle.hx === 1) {
        const sn = snapEdge(right + dx, cand.x, "x");
        if (sn.guide) guides.push(sn.guide);
        width = clamp(sn.value - start.x, MIN_ELEMENT_SIZE, Infinity);
      } else if (handle.hx === -1) {
        const sn = snapEdge(start.x + dx, cand.x, "x");
        if (sn.guide) guides.push(sn.guide);
        width = clamp(right - sn.value, MIN_ELEMENT_SIZE, Infinity);
        x = right - width;
      }

      if (handle.hy === 1) {
        const sn = snapEdge(bottom + dy, cand.y, "y");
        if (sn.guide) guides.push(sn.guide);
        height = clamp(sn.value - start.y, MIN_ELEMENT_SIZE, Infinity);
      } else if (handle.hy === -1) {
        const sn = snapEdge(start.y + dy, cand.y, "y");
        if (sn.guide) guides.push(sn.guide);
        height = clamp(bottom - sn.value, MIN_ELEMENT_SIZE, Infinity);
        y = bottom - height;
      }

      const s = useEditorStore.getState();
      s.updatePositionLive(element.id, breakpoint, {
        x: Math.round(x),
        y: Math.round(y),
        width: Math.round(width),
        height: Math.round(height),
      });
      s.setGuides(guides);
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      interaction.current = false;
      useEditorStore.getState().endInteraction();
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  return (
    <div
      onPointerDown={startDrag}
      className="absolute"
      style={{
        left: pos.x,
        top: pos.y,
        width: pos.width,
        height: pos.height,
        cursor: element.locked ? "default" : "move",
        outline: selected
          ? "1.5px solid #2563eb"
          : "1px solid transparent",
        outlineOffset: 0,
      }}
    >
      {/* Presentational content — never captures pointer events itself. */}
      <div
        className="h-full w-full overflow-hidden"
        style={{ pointerEvents: "none", userSelect: "none" }}
      >
        {renderElement(element, theme)}
      </div>

      {selected && !element.locked
        ? HANDLES.map((h) => (
            <span
              key={h.name}
              onPointerDown={(e) => startResize(e, h)}
              className="absolute z-10 h-2.5 w-2.5 rounded-full border border-blue-600 bg-white"
              style={{
                cursor: h.cursor,
                left:
                  h.hx === -1 ? -5 : h.hx === 1 ? pos.width - 5 : pos.width / 2 - 5,
                top:
                  h.hy === -1 ? -5 : h.hy === 1 ? pos.height - 5 : pos.height / 2 - 5,
              }}
            />
          ))
        : null}
    </div>
  );
}
