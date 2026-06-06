"use client";

import { useEditorStore } from "@/lib/store/editor-store";
import { ELEMENT_REGISTRY } from "./elements";

function IconButton({
  label,
  onClick,
  active,
  children,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`flex h-6 w-6 items-center justify-center rounded text-zinc-400 hover:bg-zinc-200 hover:text-zinc-700 ${
        active ? "text-blue-600" : ""
      }`}
    >
      {children}
    </button>
  );
}

export function LayersPanel() {
  const elements = useEditorStore((s) =>
    s.present.pages.find((p) => p.id === s.activePageId)?.canvas.elements,
  );
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const selectOnly = useEditorStore((s) => s.selectOnly);
  const addToSelection = useEditorStore((s) => s.addToSelection);
  const toggleLock = useEditorStore((s) => s.toggleLock);
  const toggleHide = useEditorStore((s) => s.toggleHide);
  const reorder = useEditorStore((s) => s.reorder);

  // Front-most elements (end of array) shown first.
  const rows = [...(elements ?? [])].reverse();

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-zinc-200 bg-white">
      <div className="flex h-11 items-center border-b border-zinc-200 px-4 text-sm font-semibold text-zinc-700">
        Layers
      </div>
      <div className="flex-1 overflow-y-auto p-1.5">
        {rows.length === 0 ? (
          <p className="px-2 py-6 text-center text-xs text-zinc-400">
            No elements yet. Add one from the toolbar.
          </p>
        ) : (
          rows.map((el) => {
            const isSel = selectedIds.includes(el.id);
            return (
              <div
                key={el.id}
                onClick={(e) =>
                  e.shiftKey ? addToSelection(el.id) : selectOnly(el.id)
                }
                className={`group flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-xs ${
                  isSel
                    ? "bg-blue-50 text-blue-700"
                    : "text-zinc-600 hover:bg-zinc-100"
                }`}
              >
                <span className="shrink-0 text-zinc-400">
                  {ELEMENT_REGISTRY[el.type].icon}
                </span>
                <span className="flex-1 truncate">{el.name}</span>

                <div className="flex items-center opacity-0 group-hover:opacity-100">
                  <IconButton label="Bring forward" onClick={() => reorder(el.id, "up")}>
                    <Chevron up />
                  </IconButton>
                  <IconButton label="Send backward" onClick={() => reorder(el.id, "down")}>
                    <Chevron />
                  </IconButton>
                </div>
                <IconButton
                  label={el.hidden ? "Show" : "Hide"}
                  onClick={() => toggleHide(el.id)}
                  active={el.hidden}
                >
                  {el.hidden ? <EyeOff /> : <Eye />}
                </IconButton>
                <IconButton
                  label={el.locked ? "Unlock" : "Lock"}
                  onClick={() => toggleLock(el.id)}
                  active={el.locked}
                >
                  {el.locked ? <Lock /> : <Unlock />}
                </IconButton>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}

const sw = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

function Chevron({ up }: { up?: boolean }) {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" style={{ transform: up ? "none" : "rotate(180deg)" }} {...sw}>
      <path d="M6 15l6-6 6 6" />
    </svg>
  );
}
function Eye() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" {...sw}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function EyeOff() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" {...sw}>
      <path d="M3 3l18 18M10.6 10.6a3 3 0 004.2 4.2M9.9 5.1A9 9 0 0112 5c6.5 0 10 7 10 7a13 13 0 01-2.2 2.9M6.1 6.1A13 13 0 002 12s3.5 7 10 7a9 9 0 003-.5" />
    </svg>
  );
}
function Lock() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" {...sw}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 018 0v4" />
    </svg>
  );
}
function Unlock() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" {...sw}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 017.5-2" />
    </svg>
  );
}
