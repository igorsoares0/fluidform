"use client";

import { newRule, OPERATOR_LABELS } from "@/lib/logic";
import type { Condition, LogicOperator, VisibilityRule } from "@/lib/types";
import { SelectField, TextField } from "./controls";

type Field = { id: string; label: string };
type Mode = "always" | "show" | "hide";

const OPERATORS: { value: LogicOperator; label: string }[] = (
  Object.keys(OPERATOR_LABELS) as LogicOperator[]
).map((op) => ({ value: op, label: OPERATOR_LABELS[op] }));

export function RuleBuilder({
  rule,
  fields,
  onChange,
}: {
  rule: VisibilityRule | undefined;
  fields: Field[];
  onChange: (rule: VisibilityRule | undefined) => void;
}) {
  if (fields.length === 0) {
    return (
      <p className="text-xs text-zinc-400">
        Add other fields first — logic shows or hides this based on their answers.
      </p>
    );
  }

  const mode: Mode = rule ? rule.action : "always";

  const setMode = (next: Mode) => {
    if (next === "always") return onChange(undefined);
    if (!rule) return onChange(newRule(next, fields[0].id));
    onChange({ ...rule, action: next });
  };

  const patchCondition = (i: number, patch: Partial<Condition>) => {
    if (!rule) return;
    onChange({
      ...rule,
      conditions: rule.conditions.map((c, idx) =>
        idx === i ? { ...c, ...patch } : c,
      ),
    });
  };
  const addCondition = () => {
    if (!rule) return;
    onChange({
      ...rule,
      conditions: [
        ...rule.conditions,
        { fieldId: fields[0].id, operator: "equals", value: "" },
      ],
    });
  };
  const removeCondition = (i: number) => {
    if (!rule) return;
    const conditions = rule.conditions.filter((_, idx) => idx !== i);
    if (conditions.length === 0) return onChange(undefined);
    onChange({ ...rule, conditions });
  };

  return (
    <div className="flex flex-col gap-2.5">
      <SelectField<Mode>
        value={mode}
        onChange={setMode}
        fullWidth
        options={[
          { value: "always", label: "Always visible" },
          { value: "show", label: "Show when…" },
          { value: "hide", label: "Hide when…" },
        ]}
      />

      {rule ? (
        <>
          {rule.conditions.length > 1 ? (
            <SelectField<"all" | "any">
              value={rule.match}
              onChange={(match) => onChange({ ...rule, match })}
              fullWidth
              options={[
                { value: "all", label: "Match all conditions" },
                { value: "any", label: "Match any condition" },
              ]}
            />
          ) : null}

          {rule.conditions.map((cond, i) => (
            <div
              key={i}
              className="flex flex-col gap-1.5 rounded-lg border border-zinc-200 p-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-zinc-400">
                  When
                </span>
                <button
                  type="button"
                  aria-label="Remove condition"
                  onClick={() => removeCondition(i)}
                  className="text-zinc-300 hover:text-red-500"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M5 12h14" />
                  </svg>
                </button>
              </div>
              <SelectField<string>
                value={cond.fieldId}
                onChange={(fieldId) => patchCondition(i, { fieldId })}
                fullWidth
                options={fields.map((f) => ({ value: f.id, label: f.label }))}
              />
              <SelectField<LogicOperator>
                value={cond.operator}
                onChange={(operator) => patchCondition(i, { operator })}
                fullWidth
                options={OPERATORS}
              />
              <TextField
                value={cond.value}
                placeholder="value"
                onChange={(value) => patchCondition(i, { value })}
              />
            </div>
          ))}

          <button
            type="button"
            onClick={addCondition}
            className="flex items-center gap-1 self-start rounded px-1.5 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add condition
          </button>
        </>
      ) : null}
    </div>
  );
}
