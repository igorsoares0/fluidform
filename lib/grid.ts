import type { Breakpoint } from "./types";

// Spec: the canvas is powered by a hidden grid used only for snapping/alignment.
// Desktop 48 cols / Tablet 24 / Mobile 8.
export const GRID_COLUMNS: Record<Breakpoint, number> = {
  desktop: 48,
  tablet: 24,
  mobile: 8,
};

// Canvas width per breakpoint (px).
export const CANVAS_WIDTH: Record<Breakpoint, number> = {
  desktop: 1200,
  tablet: 768,
  mobile: 375,
};

export const CANVAS_MIN_HEIGHT = 720;

/** Width of a single grid column for the given breakpoint. */
export function columnWidth(breakpoint: Breakpoint): number {
  return CANVAS_WIDTH[breakpoint] / GRID_COLUMNS[breakpoint];
}

/** Snap a value to the nearest multiple of `step`. */
export function snapToGrid(value: number, step: number): number {
  return Math.round(value / step) * step;
}

export const MIN_ELEMENT_SIZE = 24;

/** Clamp a value into [min, max]. */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
