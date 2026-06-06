import type { Element } from "@/lib/types";

/** A collected answer for a single field. */
export type FieldValue = string | number | string[];

export type Values = Record<string, FieldValue>;

/** Whether a field has a usable answer (used for required-field validation). */
export function isAnswered(element: Element, value: FieldValue | undefined): boolean {
  switch (element.type) {
    case "checkbox":
      return Array.isArray(value) && value.length > 0;
    case "rating":
    case "nps":
    case "slider":
      return typeof value === "number";
    case "input":
    case "select":
    case "radio":
    case "date":
    case "upload":
      return typeof value === "string" && value.trim().length > 0;
    default:
      return true; // non-field elements (heading/text/button)
  }
}

/** True for element types that collect an answer and can be required. */
export function isFieldElement(element: Element): boolean {
  return (
    element.type === "input" ||
    element.type === "select" ||
    element.type === "radio" ||
    element.type === "checkbox" ||
    element.type === "rating" ||
    element.type === "nps" ||
    element.type === "slider" ||
    element.type === "date" ||
    element.type === "upload"
  );
}

/** Human-readable label for a field (for the submit summary). */
export function fieldLabel(element: Element): string {
  if ("label" in element && element.label) return element.label;
  if (element.type === "input" || element.type === "select") {
    return element.placeholder || "Field";
  }
  return "Field";
}

/** Render a collected value as display text. */
export function displayValue(value: FieldValue | undefined): string {
  if (value === undefined) return "";
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}
