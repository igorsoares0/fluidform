"use client";

import { useEditorStore } from "@/lib/store/editor-store";
import { ELEMENT_REGISTRY } from "./elements";
import { ContentSection } from "./inspector/ContentSection";
import { LayoutSection } from "./inspector/LayoutSection";
import { StyleSection } from "./inspector/StyleSection";
import { LogicSection } from "./inspector/LogicSection";
import { ThemePanel } from "./inspector/ThemePanel";

export function Inspector() {
  const breakpoint = useEditorStore((s) => s.breakpoint);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const theme = useEditorStore((s) => s.present.theme);
  const elements = useEditorStore((s) =>
    s.present.pages.find((p) => p.id === s.activePageId)?.canvas.elements,
  );

  const selected =
    selectedIds.length === 1
      ? elements?.find((e) => e.id === selectedIds[0])
      : undefined;

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-l border-zinc-200 bg-white">
      <div className="flex h-11 items-center border-b border-zinc-200 px-4 text-sm font-semibold text-zinc-700">
        {selected
          ? ELEMENT_REGISTRY[selected.type].label
          : selectedIds.length > 1
            ? `${selectedIds.length} selected`
            : "Theme"}
      </div>

      <div className="flex-1 overflow-y-auto">
        {selected ? (
          <>
            <ContentSection element={selected} />
            <LayoutSection element={selected} breakpoint={breakpoint} />
            <StyleSection element={selected} theme={theme} />
            <LogicSection element={selected} />
          </>
        ) : selectedIds.length > 1 ? (
          <div className="px-4 py-10 text-center text-xs text-zinc-400">
            Multiple elements selected. Select a single element to edit its
            properties.
          </div>
        ) : (
          <ThemePanel />
        )}
      </div>
    </aside>
  );
}
