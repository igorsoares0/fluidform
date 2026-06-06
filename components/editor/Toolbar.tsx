"use client";

import { motion } from "framer-motion";
import { useEditorStore } from "@/lib/store/editor-store";
import type { Breakpoint } from "@/lib/types";
import { ELEMENT_REGISTRY, INSERTABLE_TYPES } from "./elements";
import { Segmented } from "./inspector/controls";

export function Toolbar() {
  const title = useEditorStore((s) => s.present.title);
  const setTitle = useEditorStore((s) => s.setTitle);
  const addElement = useEditorStore((s) => s.addElement);
  const breakpoint = useEditorStore((s) => s.breakpoint);
  const setBreakpoint = useEditorStore((s) => s.setBreakpoint);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const canUndo = useEditorStore((s) => s.past.length > 0);
  const canRedo = useEditorStore((s) => s.future.length > 0);

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-zinc-200 bg-white px-4">
      {/* Brand + title */}
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-sm font-bold text-white">
          F
        </div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-44 rounded-md px-2 py-1 text-sm font-medium text-zinc-800 outline-none hover:bg-zinc-100 focus:bg-zinc-100"
        />
      </div>

      <div className="h-6 w-px bg-zinc-200" />

      {/* Insert elements */}
      <div className="flex items-center gap-1">
        {INSERTABLE_TYPES.map((type) => (
          <motion.button
            key={type}
            type="button"
            whileTap={{ scale: 0.94 }}
            onClick={() => addElement(type)}
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          >
            {ELEMENT_REGISTRY[type].icon}
            {ELEMENT_REGISTRY[type].label}
          </motion.button>
        ))}
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
