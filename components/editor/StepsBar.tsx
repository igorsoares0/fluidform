"use client";

import { useState } from "react";
import { useEditorStore } from "@/lib/store/editor-store";
import { fieldChoices } from "@/lib/logic";
import { RuleBuilder } from "./inspector/RuleBuilder";

export function StepsBar() {
  const schema = useEditorStore((s) => s.present);
  const pages = schema.pages;
  const activePageId = useEditorStore((s) => s.activePageId);
  const setActivePage = useEditorStore((s) => s.setActivePage);
  const addPage = useEditorStore((s) => s.addPage);
  const deletePage = useEditorStore((s) => s.deletePage);
  const renamePage = useEditorStore((s) => s.renamePage);
  const setPageLogic = useEditorStore((s) => s.setPageLogic);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [logicPageId, setLogicPageId] = useState<string | null>(null);

  const logicPage = pages.find((p) => p.id === logicPageId);

  const startRename = (id: string, name: string) => {
    setEditingId(id);
    setDraft(name);
  };
  const commitRename = () => {
    if (editingId && draft.trim()) renamePage(editingId, draft.trim());
    setEditingId(null);
  };

  return (
    <div className="relative flex h-10 shrink-0 items-center gap-1 border-b border-zinc-200 bg-white px-3">
      <span className="mr-1 text-[11px] font-semibold tracking-wide text-zinc-400 uppercase">
        Steps
      </span>
      <div className="flex items-center gap-1 overflow-x-auto">
        {pages.map((page, i) => {
          const active = page.id === activePageId;
          const editing = editingId === page.id;
          return (
            <div
              key={page.id}
              onClick={() => setActivePage(page.id)}
              onDoubleClick={() => startRename(page.id, page.name)}
              className={`group flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1 text-xs ${
                active
                  ? "bg-blue-50 text-blue-700"
                  : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              <span className="text-zinc-400">{i + 1}</span>
              {editing ? (
                <input
                  autoFocus
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onBlur={commitRename}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitRename();
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-24 rounded border border-blue-300 bg-white px-1 text-xs outline-none"
                />
              ) : (
                <span className="font-medium">{page.name}</span>
              )}
              <button
                type="button"
                aria-label="Step logic"
                title="Conditional visibility"
                onClick={(e) => {
                  e.stopPropagation();
                  setLogicPageId((cur) => (cur === page.id ? null : page.id));
                }}
                className={`ml-0.5 hover:text-blue-600 ${
                  page.logic
                    ? "text-blue-600"
                    : "text-zinc-300 opacity-0 group-hover:opacity-100"
                }`}
              >
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 3v12a3 3 0 003 3h6M18 6l3 3-3 3" />
                </svg>
              </button>
              {pages.length > 1 ? (
                <button
                  type="button"
                  aria-label="Delete step"
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePage(page.id);
                  }}
                  className="text-zinc-300 opacity-0 group-hover:opacity-100 hover:text-red-500"
                >
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
      <button
        type="button"
        onClick={addPage}
        title="Add step"
        className="ml-1 flex h-6 items-center gap-1 rounded-md px-2 text-xs font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Add
      </button>

      {logicPage ? (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setLogicPageId(null)} />
          <div className="absolute top-full left-3 z-50 mt-1 w-72 rounded-xl border border-zinc-200 bg-white p-3 shadow-xl">
            <p className="mb-2 text-[11px] font-semibold tracking-wide text-zinc-400 uppercase">
              Show “{logicPage.name}” when
            </p>
            <RuleBuilder
              rule={logicPage.logic}
              fields={fieldChoices(schema)}
              onChange={(logic) => setPageLogic(logicPage.id, logic)}
            />
          </div>
        </>
      ) : null}
    </div>
  );
}
