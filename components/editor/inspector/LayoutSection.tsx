"use client";

import { useEditorStore } from "@/lib/store/editor-store";
import type { Breakpoint, Element } from "@/lib/types";
import { NumberField, Row, Section } from "./controls";

export function LayoutSection({
  element,
  breakpoint,
}: {
  element: Element;
  breakpoint: Breakpoint;
}) {
  const commitPosition = useEditorStore((s) => s.commitPosition);
  const pos = element.position[breakpoint];

  const set = (patch: Partial<typeof pos>) =>
    commitPosition(element.id, breakpoint, { ...pos, ...patch });

  return (
    <Section title="Layout">
      <Row label="X">
        <NumberField value={pos.x} onChange={(x) => set({ x })} />
      </Row>
      <Row label="Y">
        <NumberField value={pos.y} onChange={(y) => set({ y })} />
      </Row>
      <Row label="Width">
        <NumberField value={pos.width} min={1} onChange={(width) => set({ width })} />
      </Row>
      <Row label="Height">
        <NumberField
          value={pos.height}
          min={1}
          onChange={(height) => set({ height })}
        />
      </Row>
    </Section>
  );
}
