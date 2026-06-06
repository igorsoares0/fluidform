import type { Position } from "./types";

// Smart snapping (spec: edge / center / canvas-center snapping with visual guides).
// Pure + testable: given a moving rect and surrounding rects, return an adjusted
// position plus the guide lines that should be drawn.

export const SNAP_THRESHOLD = 6; // px

/** A visual alignment guide. axis "x" => vertical line at `position`. */
export type Guide = {
  axis: "x" | "y";
  position: number;
};

type Rect = Pick<Position, "x" | "y" | "width" | "height">;

type Lines = { x: number[]; y: number[] };

/** The snap lines a rect exposes on each axis: near edge, center, far edge. */
function rectLines(r: Rect): Lines {
  return {
    x: [r.x, r.x + r.width / 2, r.x + r.width],
    y: [r.y, r.y + r.height / 2, r.y + r.height],
  };
}

function canvasLines(width: number, height: number): Lines {
  return {
    x: [0, width / 2, width],
    y: [0, height / 2, height],
  };
}

type AxisResult = { delta: number; guide: number | null };

/**
 * For a moving rect's set of lines on one axis, find the closest target line
 * within threshold. Returns the delta to apply and the guide position to draw.
 */
function snapAxis(
  movingLines: number[],
  targetLines: number[],
  threshold: number,
): AxisResult {
  let best: AxisResult = { delta: 0, guide: null };
  let bestDist = threshold + 1;

  for (const m of movingLines) {
    for (const t of targetLines) {
      const dist = Math.abs(m - t);
      if (dist < bestDist) {
        bestDist = dist;
        best = { delta: t - m, guide: t };
      }
    }
  }
  return best;
}

export type SnapResult = {
  x: number;
  y: number;
  guides: Guide[];
};

/**
 * Snap a moving rect against other rects + the canvas frame.
 * `others` should exclude the element being moved.
 */
export function snapMove(
  rect: Rect,
  others: Rect[],
  canvas: { width: number; height: number },
  threshold = SNAP_THRESHOLD,
): SnapResult {
  const targets: Lines = { x: [], y: [] };
  const cl = canvasLines(canvas.width, canvas.height);
  targets.x.push(...cl.x);
  targets.y.push(...cl.y);
  for (const o of others) {
    const ol = rectLines(o);
    targets.x.push(...ol.x);
    targets.y.push(...ol.y);
  }

  const moving = rectLines(rect);
  const sx = snapAxis(moving.x, targets.x, threshold);
  const sy = snapAxis(moving.y, targets.y, threshold);

  const guides: Guide[] = [];
  if (sx.guide !== null) guides.push({ axis: "x", position: sx.guide });
  if (sy.guide !== null) guides.push({ axis: "y", position: sy.guide });

  return {
    x: rect.x + sx.delta,
    y: rect.y + sy.delta,
    guides,
  };
}

/**
 * Snap a single moving edge value to nearby candidate lines (used during resize).
 * Returns the snapped value and, when snapped, the guide to draw.
 */
export function snapEdge(
  value: number,
  candidates: number[],
  axis: "x" | "y",
  threshold = SNAP_THRESHOLD,
): { value: number; guide: Guide | null } {
  let bestValue = value;
  let bestDist = threshold + 1;
  let guide: Guide | null = null;
  for (const c of candidates) {
    const dist = Math.abs(value - c);
    if (dist < bestDist) {
      bestDist = dist;
      bestValue = c;
      guide = { axis, position: c };
    }
  }
  return { value: bestValue, guide };
}

/** Collect candidate edge lines (element edges + canvas frame) on each axis. */
export function edgeCandidates(
  others: Rect[],
  canvas: { width: number; height: number },
): Lines {
  const lines: Lines = {
    x: [0, canvas.width / 2, canvas.width],
    y: [0, canvas.height / 2, canvas.height],
  };
  for (const o of others) {
    lines.x.push(o.x, o.x + o.width);
    lines.y.push(o.y, o.y + o.height);
  }
  return lines;
}
