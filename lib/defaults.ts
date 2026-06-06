import { CANVAS_WIDTH } from "./grid";
import type {
  Breakpoint,
  Element,
  ElementType,
  ResponsivePosition,
} from "./types";

const BREAKPOINTS: Breakpoint[] = ["desktop", "tablet", "mobile"];

export function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 11);
}

/**
 * Build a ResponsivePosition that horizontally centers a box of the given size
 * within each breakpoint's canvas (clamping width to fit narrow viewports).
 */
function centeredPosition(
  width: number,
  height: number,
  y: number,
): ResponsivePosition {
  const out = {} as ResponsivePosition;
  for (const bp of BREAKPOINTS) {
    const canvasW = CANVAS_WIDTH[bp];
    const w = Math.min(width, canvasW - 32);
    out[bp] = {
      x: Math.round((canvasW - w) / 2),
      y,
      width: w,
      height,
    };
  }
  return out;
}

// Stagger new elements so successive inserts don't stack perfectly.
let insertCount = 0;

type Factory = (y: number) => Element;

const factories: Record<ElementType, Factory> = {
  // Factories set only structural/typographic identity. Colors, surfaces,
  // borders and radius come from the theme (see lib/theme.ts) so switching
  // presets restyles every element. Per-element `style` overrides the theme.
  heading: (y) => ({
    id: uid(),
    type: "heading",
    name: "Heading",
    position: centeredPosition(520, 56, y),
    locked: false,
    hidden: false,
    text: "Heading",
    style: { fontSize: 36, fontWeight: 700, textAlign: "center", opacity: 1 },
  }),
  text: (y) => ({
    id: uid(),
    type: "text",
    name: "Paragraph",
    position: centeredPosition(520, 48, y),
    locked: false,
    hidden: false,
    text: "Add your supporting text here.",
    style: { fontSize: 16, fontWeight: 400, textAlign: "center", opacity: 1 },
  }),
  input: (y) => ({
    id: uid(),
    type: "input",
    name: "Input",
    position: centeredPosition(420, 72, y),
    locked: false,
    hidden: false,
    label: "Email",
    placeholder: "you@example.com",
    required: true,
    inputType: "email",
    style: { fontSize: 15, opacity: 1 },
  }),
  button: (y) => ({
    id: uid(),
    type: "button",
    name: "Button",
    position: centeredPosition(200, 48, y),
    locked: false,
    hidden: false,
    label: "Submit",
    action: "submit",
    style: { fontSize: 15, fontWeight: 600, textAlign: "center", opacity: 1 },
  }),
};

/** Create a fresh element of the given type, vertically staggered on insert. */
export function createElement(type: ElementType): Element {
  const y = 80 + (insertCount++ % 6) * 88;
  return factories[type](y);
}
