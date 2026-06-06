"use client";

import { useEffect } from "react";
import { useEditorStore } from "@/lib/store/editor-store";
import { Toolbar } from "./Toolbar";
import { LayersPanel } from "./LayersPanel";
import { Canvas } from "./Canvas";
import { Inspector } from "./Inspector";

function isEditableTarget(t: EventTarget | null): boolean {
  if (!(t instanceof HTMLElement)) return false;
  const tag = t.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    t.isContentEditable
  );
}

export function EditorShell() {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const store = useEditorStore.getState();
      const mod = e.metaKey || e.ctrlKey;

      if (mod && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) store.redo();
        else store.undo();
        return;
      }
      if (mod && e.key.toLowerCase() === "y") {
        e.preventDefault();
        store.redo();
        return;
      }
      if (mod && e.key.toLowerCase() === "d") {
        e.preventDefault();
        store.duplicateSelected();
        return;
      }

      // Destructive / typing-sensitive keys: ignore while editing a field.
      if (isEditableTarget(e.target)) return;

      if (e.key === "Delete" || e.key === "Backspace") {
        if (store.selectedIds.length > 0) {
          e.preventDefault();
          store.deleteSelected();
        }
      } else if (e.key === "Escape") {
        store.clearSelection();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="fluidform-editor flex h-screen w-screen flex-col overflow-hidden bg-zinc-50 text-zinc-900">
      <Toolbar />
      <div className="flex min-h-0 flex-1">
        <LayersPanel />
        <main className="min-w-0 flex-1">
          <Canvas />
        </main>
        <Inspector />
      </div>
    </div>
  );
}
