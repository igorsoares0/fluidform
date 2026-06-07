import { CANVAS_MIN_HEIGHT, CANVAS_WIDTH } from "./grid";
import { uid } from "./defaults";
import { defaultTheme } from "./theme";
import type { FormSchema, Page } from "./types";

// Server-safe schema construction (no zustand) so API routes and the editor
// store can both create blank forms.

export function createPage(name: string): Page {
  return {
    id: uid(),
    name,
    canvas: {
      width: CANVAS_WIDTH.desktop,
      minHeight: CANVAS_MIN_HEIGHT,
      elements: [],
    },
  };
}

export function createInitialSchema(title = "Untitled form"): FormSchema {
  return {
    id: uid(),
    title,
    theme: defaultTheme(),
    pages: [createPage("Page 1")],
    settings: { showProgress: false },
  };
}
