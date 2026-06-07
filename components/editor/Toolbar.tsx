"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEditorStore } from "@/lib/store/editor-store";
import { saveForm } from "@/lib/api";
import type { Breakpoint, ElementType } from "@/lib/types";
import { ELEMENT_GROUPS, ELEMENT_REGISTRY } from "./elements";
import { Segmented } from "./inspector/controls";

const SAVE_LABEL: Record<string, string> = {
  idle: "",
  saving: "Saving…",
  saved: "Saved",
  error: "Save failed",
};

export function Toolbar({ formId }: { formId: string }) {
  const title = useEditorStore((s) => s.present.title);
  const setTitle = useEditorStore((s) => s.setTitle);
  const addElement = useEditorStore((s) => s.addElement);
  const breakpoint = useEditorStore((s) => s.breakpoint);
  const setBreakpoint = useEditorStore((s) => s.setBreakpoint);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const canUndo = useEditorStore((s) => s.past.length > 0);
  const canRedo = useEditorStore((s) => s.future.length > 0);
  const saveStatus = useEditorStore((s) => s.saveStatus);

  const [addOpen, setAddOpen] = useState(false);

  const insert = (type: ElementType) => {
    addElement(type);
    setAddOpen(false);
  };

  return (
    <header className="relative z-30 flex h-14 shrink-0 items-center gap-4 border-b border-zinc-200 bg-white px-4">
      {/* Brand + title */}
      <div className="flex items-center gap-2">
        <Link
          href="/"
          title="Dashboard"
          className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-sm font-bold text-white hover:bg-blue-700"
        >
          F
        </Link>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-40 rounded-md px-2 py-1 text-sm font-medium text-zinc-800 outline-none hover:bg-zinc-100 focus:bg-zinc-100"
        />
        <span className="w-16 text-xs text-zinc-400">{SAVE_LABEL[saveStatus]}</span>
      </div>

      <div className="h-6 w-px bg-zinc-200" />

      {/* Add element menu */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setAddOpen((o) => !o)}
          className="flex items-center gap-1.5 rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-700"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add element
        </button>

        <AnimatePresence>
          {addOpen ? (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setAddOpen(false)} />
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.12 }}
                className="absolute top-full left-0 z-50 mt-2 w-64 rounded-xl border border-zinc-200 bg-white p-3 shadow-xl"
              >
                {ELEMENT_GROUPS.map((group) => (
                  <div key={group.title} className="mb-2 last:mb-0">
                    <p className="mb-1 px-1 text-[11px] font-semibold tracking-wide text-zinc-400 uppercase">
                      {group.title}
                    </p>
                    <div className="grid grid-cols-3 gap-1">
                      {group.types.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => insert(type)}
                          className="flex flex-col items-center gap-1 rounded-lg px-1 py-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                        >
                          {ELEMENT_REGISTRY[type].icon}
                          <span className="text-[10px] leading-none">
                            {ELEMENT_REGISTRY[type].label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            </>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* Undo / redo */}
        <div className="flex items-center gap-1">
          <ToolbarIconBtn label="Undo" disabled={!canUndo} onClick={undo}>
            <UndoIcon />
          </ToolbarIconBtn>
          <ToolbarIconBtn label="Redo" disabled={!canRedo} onClick={redo}>
            <UndoIcon flip />
          </ToolbarIconBtn>
        </div>

        <div className="h-6 w-px bg-zinc-200" />

        {/* Breakpoint switcher */}
        <div className="w-52">
          <Segmented<Breakpoint>
            value={breakpoint}
            onChange={setBreakpoint}
            options={[
              { value: "desktop", label: "Desktop" },
              { value: "tablet", label: "Tablet" },
              { value: "mobile", label: "Mobile" },
            ]}
          />
        </div>

        <div className="h-6 w-px bg-zinc-200" />

        {/* Preview: flush latest schema, then open the public form. */}
        <button
          type="button"
          onClick={async () => {
            try {
              await saveForm(formId, useEditorStore.getState().present);
            } catch {
              /* open anyway with last saved version */
            }
            window.open(`/f/${formId}`, "_blank", "noopener");
          }}
          className="rounded-md bg-blue-600 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
        >
          Preview
        </button>
      </div>
    </header>
  );
}

function ToolbarIconBtn({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:text-zinc-300 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}

function UndoIcon({ flip }: { flip?: boolean }) {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: flip ? "scaleX(-1)" : "none" }}
    >
      <path d="M9 14L4 9l5-5" />
      <path d="M4 9h11a5 5 0 015 5v1" />
    </svg>
  );
}
