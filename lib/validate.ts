import type { FormSchema } from "./types";

/** Cheap structural guard — enough to reject corrupt/old payloads. */
export function isValidSchema(value: unknown): value is FormSchema {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  if (typeof v.id !== "string" || typeof v.title !== "string") return false;
  if (!Array.isArray(v.pages) || v.pages.length === 0) return false;
  return v.pages.every((p) => {
    const page = p as Record<string, unknown>;
    const canvas = page?.canvas as Record<string, unknown> | undefined;
    return typeof page?.id === "string" && Array.isArray(canvas?.elements);
  });
}
