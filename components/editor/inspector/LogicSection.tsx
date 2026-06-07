"use client";

import { useEditorStore } from "@/lib/store/editor-store";
import { fieldChoices } from "@/lib/logic";
import type { Element } from "@/lib/types";
import { Section } from "./controls";
import { RuleBuilder } from "./RuleBuilder";

export function LogicSection({ element }: { element: Element }) {
  const schema = useEditorStore((s) => s.present);
  const updateElement = useEditorStore((s) => s.updateElement);
  const fields = fieldChoices(schema, element.id);

  return (
    <Section title="Logic">
      <RuleBuilder
        rule={element.logic}
        fields={fields}
        onChange={(logic) => updateElement(element.id, { logic })}
      />
    </Section>
  );
}
