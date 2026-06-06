"use client";

import { create } from "zustand";
import { CANVAS_MIN_HEIGHT, CANVAS_WIDTH } from "../grid";
import { createElement, uid } from "../defaults";
import type { Guide } from "../snapping";
import type {
  Breakpoint,
  Element,
  ElementType,
  FormSchema,
  Page,
  Position,
} from "../types";

const HISTORY_LIMIT = 100;

function clone<T>(value: T): T {
  return typeof structuredClone === "function"
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value));
}

function createInitialPage(): Page {
  return {
    id: uid(),
    name: "Page 1",
    canvas: {
      width: CANVAS_WIDTH.desktop,
      minHeight: CANVAS_MIN_HEIGHT,
      elements: [],
    },
  };
}

export function createInitialSchema(): FormSchema {
  const page = createInitialPage();
  return {
    id: uid(),
    title: "Untitled form",
    theme: { preset: "minimal" },
    pages: [page],
    settings: { showProgress: false },
  };
}

type ReorderDir = "up" | "down" | "front" | "back";

export type EditorState = {
  present: FormSchema;
  past: FormSchema[];
  future: FormSchema[];
  activePageId: string;
  selectedIds: string[];
  breakpoint: Breakpoint;
  dragGuides: Guide[];

  // selectors-as-helpers
  activePage: () => Page;
  activeElements: () => Element[];

  // persistence
  loadSchema: (schema: FormSchema) => void;

  // schema mutations (history-tracked)
  setTitle: (title: string) => void;
  addElement: (type: ElementType) => void;
  deleteSelected: () => void;
  duplicateSelected: () => void;
  updateElement: (id: string, patch: Partial<Element>) => void;
  updateStyle: (id: string, patch: Partial<Element["style"]>) => void;
  commitPosition: (id: string, bp: Breakpoint, pos: Position) => void;
  reorder: (id: string, dir: ReorderDir) => void;
  toggleLock: (id: string) => void;
  toggleHide: (id: string) => void;

  // live interaction (commit-once history)
  beginInteraction: () => void;
  endInteraction: () => void;
  updatePositionLive: (id: string, bp: Breakpoint, pos: Position) => void;
  setGuides: (guides: Guide[]) => void;

  // selection
  selectOnly: (id: string) => void;
  addToSelection: (id: string) => void;
  clearSelection: () => void;

  // view
  setBreakpoint: (bp: Breakpoint) => void;

  // history
  undo: () => void;
  redo: () => void;
};

export const useEditorStore = create<EditorState>((set, get) => {
  /** Map the active page's elements through `fn`, returning a new schema. */
  function mapElements(
    schema: FormSchema,
    pageId: string,
    fn: (els: Element[]) => Element[],
  ): FormSchema {
    return {
      ...schema,
      pages: schema.pages.map((p) =>
        p.id === pageId
          ? { ...p, canvas: { ...p.canvas, elements: fn(p.canvas.elements) } }
          : p,
      ),
    };
  }

  /** Apply a history-tracked mutation: snapshot present, clear redo stack. */
  function commit(producer: (schema: FormSchema) => FormSchema) {
    set((s) => {
      const past = [...s.past, clone(s.present)].slice(-HISTORY_LIMIT);
      return { past, future: [], present: producer(s.present) };
    });
  }

  /** Apply a mutation without touching history (used mid-interaction). */
  function live(producer: (schema: FormSchema) => FormSchema) {
    set((s) => ({ present: producer(s.present) }));
  }

  const updateOne = (id: string, fn: (el: Element) => Element) =>
    (schema: FormSchema) =>
      mapElements(schema, get().activePageId, (els) =>
        els.map((el) => (el.id === id ? fn(el) : el)),
      );

  return {
    present: createInitialSchema(),
    past: [],
    future: [],
    activePageId: "", // set right after creation below
    selectedIds: [],
    breakpoint: "desktop",
    dragGuides: [],

    activePage: () => {
      const s = get();
      return (
        s.present.pages.find((p) => p.id === s.activePageId) ??
        s.present.pages[0]
      );
    },
    activeElements: () => get().activePage().canvas.elements,

    loadSchema: (schema) =>
      set({
        present: schema,
        past: [],
        future: [],
        selectedIds: [],
        dragGuides: [],
        activePageId: schema.pages[0].id,
      }),

    setTitle: (title) => commit((sch) => ({ ...sch, title })),

    addElement: (type) => {
      const el = createElement(type);
      commit((sch) =>
        mapElements(sch, get().activePageId, (els) => [...els, el]),
      );
      set({ selectedIds: [el.id] });
    },

    deleteSelected: () => {
      const ids = new Set(get().selectedIds);
      if (ids.size === 0) return;
      commit((sch) =>
        mapElements(sch, get().activePageId, (els) =>
          els.filter((el) => !ids.has(el.id)),
        ),
      );
      set({ selectedIds: [] });
    },

    duplicateSelected: () => {
      const ids = new Set(get().selectedIds);
      if (ids.size === 0) return;
      const newIds: string[] = [];
      commit((sch) =>
        mapElements(sch, get().activePageId, (els) => {
          const dupes: Element[] = [];
          for (const el of els) {
            if (!ids.has(el.id)) continue;
            const copy = clone(el);
            copy.id = uid();
            copy.name = `${el.name} copy`;
            for (const bp of Object.keys(copy.position) as Breakpoint[]) {
              copy.position[bp].x += 16;
              copy.position[bp].y += 16;
            }
            newIds.push(copy.id);
            dupes.push(copy);
          }
          return [...els, ...dupes];
        }),
      );
      set({ selectedIds: newIds });
    },

    updateElement: (id, patch) =>
      commit(updateOne(id, (el) => ({ ...el, ...patch }) as Element)),

    updateStyle: (id, patch) =>
      commit(
        updateOne(id, (el) => ({
          ...el,
          style: { ...el.style, ...patch },
        })),
      ),

    commitPosition: (id, bp, pos) =>
      commit(
        updateOne(id, (el) => ({
          ...el,
          position: { ...el.position, [bp]: pos },
        })),
      ),

    reorder: (id, dir) =>
      commit((sch) =>
        mapElements(sch, get().activePageId, (els) => {
          const i = els.findIndex((e) => e.id === id);
          if (i === -1) return els;
          const next = [...els];
          const [item] = next.splice(i, 1);
          if (dir === "front") next.push(item);
          else if (dir === "back") next.unshift(item);
          else if (dir === "up") next.splice(Math.min(i + 1, next.length), 0, item);
          else next.splice(Math.max(i - 1, 0), 0, item);
          return next;
        }),
      ),

    toggleLock: (id) =>
      commit(updateOne(id, (el) => ({ ...el, locked: !el.locked }))),
    toggleHide: (id) =>
      commit(updateOne(id, (el) => ({ ...el, hidden: !el.hidden }))),

    beginInteraction: () =>
      set((s) => ({
        past: [...s.past, clone(s.present)].slice(-HISTORY_LIMIT),
        future: [],
      })),
    endInteraction: () => set({ dragGuides: [] }),

    updatePositionLive: (id, bp, pos) =>
      live(
        updateOne(id, (el) => ({
          ...el,
          position: { ...el.position, [bp]: pos },
        })),
      ),

    setGuides: (guides) => set({ dragGuides: guides }),

    selectOnly: (id) => set({ selectedIds: [id] }),
    addToSelection: (id) =>
      set((s) => ({
        selectedIds: s.selectedIds.includes(id)
          ? s.selectedIds.filter((x) => x !== id)
          : [...s.selectedIds, id],
      })),
    clearSelection: () => set({ selectedIds: [] }),

    setBreakpoint: (bp) => set({ breakpoint: bp }),

    undo: () =>
      set((s) => {
        if (s.past.length === 0) return s;
        const prev = s.past[s.past.length - 1];
        return {
          past: s.past.slice(0, -1),
          present: prev,
          future: [clone(s.present), ...s.future],
        };
      }),
    redo: () =>
      set((s) => {
        if (s.future.length === 0) return s;
        const next = s.future[0];
        return {
          past: [...s.past, clone(s.present)],
          future: s.future.slice(1),
          present: next,
        };
      }),
  };
});

// Initialize activePageId to the seeded page.
useEditorStore.setState((s) => ({ activePageId: s.present.pages[0].id }));
