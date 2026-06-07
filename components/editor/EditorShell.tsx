"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useEditorStore } from "@/lib/store/editor-store";
import { fetchForm, saveForm } from "@/lib/api";
import { Toolbar } from "./Toolbar";
import { LayersPanel } from "./LayersPanel";
import { Canvas } from "./Canvas";
import { Inspector } from "./Inspector";
import { StepsBar } from "./StepsBar";

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

export function EditorShell({ formId }: { formId: string }) {
  const [status, setStatus] = useState<"loading" | "ready" | "notfound">(
    "loading",
  );

  // Load the form from the API on mount, then autosave (debounced) to the API
  // on every schema change.
  useEffect(() => {
    let active = true;
    let skipNext = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const store = useEditorStore.getState();
    store.setSaveStatus("idle");

    fetchForm(formId)
      .then((form) => {
        if (!active) return;
        if (!form) {
          setStatus("notfound");
          return;
        }
        skipNext = true; // the load itself shouldn't trigger a save
        store.loadSchema(form.schema);
        setStatus("ready");
      })
      .catch(() => active && setStatus("notfound"));

    const unsub = useEditorStore.subscribe((state, prev) => {
      if (state.present === prev.present) return;
      if (skipNext) {
        skipNext = false;
        return;
      }
      clearTimeout(timer);
      useEditorStore.getState().setSaveStatus("saving");
      const schema = state.present;
      timer = setTimeout(async () => {
        try {
          await saveForm(formId, schema);
          useEditorStore.getState().setSaveStatus("saved");
        } catch {
          useEditorStore.getState().setSaveStatus("error");
        }
      }, 600);
    });
    return () => {
      active = false;
      clearTimeout(timer);
      unsub();
    };
  }, [formId]);

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

  if (status === "notfound") {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-3 bg-zinc-50 text-center">
        <p className="text-sm text-zinc-500">This form doesn’t exist.</p>
        <Link
          href="/"
          className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-700"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="fluidform-editor flex h-screen w-screen flex-col overflow-hidden bg-zinc-50 text-zinc-900">
      <Toolbar formId={formId} />
      <div className="flex min-h-0 flex-1">
        <LayersPanel />
        <main className="flex min-w-0 flex-1 flex-col">
          <StepsBar />
          <div className="min-h-0 flex-1">
            <Canvas />
          </div>
        </main>
        <Inspector />
      </div>
      {status === "loading" ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 text-sm text-zinc-500">
          Loading…
        </div>
      ) : null}
    </div>
  );
}
