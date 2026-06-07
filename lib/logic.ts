import type {
  Condition,
  Element,
  FormSchema,
  Page,
  VisibilityRule,
} from "./types";
import {
  fieldLabel,
  isFieldElement,
  type FieldValue,
  type Values,
} from "@/components/render/value";

/** Fields (across all pages) that a rule can reference, with display labels. */
export function fieldChoices(
  schema: FormSchema,
  excludeId?: string,
): { id: string; label: string }[] {
  return schema.pages
    .flatMap((p) => p.canvas.elements)
    .filter((el) => isFieldElement(el) && el.id !== excludeId)
    .map((el) => ({ id: el.id, label: fieldLabel(el) }));
}

// Evaluation of conditional visibility rules against collected answers.

function asText(v: FieldValue | undefined): string {
  if (v === undefined) return "";
  if (Array.isArray(v)) return v.join(",");
  return String(v);
}

function evalCondition(cond: Condition, values: Values): boolean {
  const raw = values[cond.fieldId];
  const a = asText(raw).trim().toLowerCase();
  const b = cond.value.trim().toLowerCase();
  switch (cond.operator) {
    case "equals":
      return a === b;
    case "notEquals":
      return a !== b;
    case "contains":
      return a.includes(b);
    case "greaterThan":
      return parseFloat(asText(raw)) > parseFloat(cond.value);
    case "lessThan":
      return parseFloat(asText(raw)) < parseFloat(cond.value);
  }
}

function ruleMatches(rule: VisibilityRule, values: Values): boolean {
  if (rule.conditions.length === 0) return true;
  return rule.match === "all"
    ? rule.conditions.every((c) => evalCondition(c, values))
    : rule.conditions.some((c) => evalCondition(c, values));
}

/** Resolve a visibility rule into a boolean (no rule => always visible). */
export function isVisible(
  rule: VisibilityRule | undefined,
  values: Values,
): boolean {
  if (!rule) return true;
  const matched = ruleMatches(rule, values);
  return rule.action === "show" ? matched : !matched;
}

export function isElementVisible(element: Element, values: Values): boolean {
  return isVisible(element.logic, values);
}

export function isPageVisible(page: Page, values: Values): boolean {
  return isVisible(page.logic, values);
}

/** A fresh rule with one empty condition, defaulting to the given field. */
export function newRule(
  action: VisibilityRule["action"],
  fieldId: string,
): VisibilityRule {
  return {
    action,
    match: "all",
    conditions: [{ fieldId, operator: "equals", value: "" }],
  };
}

export const OPERATOR_LABELS: Record<Condition["operator"], string> = {
  equals: "equals",
  notEquals: "does not equal",
  contains: "contains",
  greaterThan: "greater than",
  lessThan: "less than",
};
