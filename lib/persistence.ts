import { normalizeSchema } from "./theme";
import type { FormSchema } from "./types";

// Frontend-only persistence. The whole FormSchema is autosaved to localStorage
// so work survives refresh. Swapped for a backend (Postgres) in a later milestone
// without changing the editor/renderer surface.
export const STORAGE_KEY = "fluidform:v1:schema";

/** Cheap structural guard — enough to reject corrupt/old payloads. */
export function isValidSchema(value: unknown): value is FormSchema {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  if (typeof v.id !== "string" || typeof v.title !== "string") return false;
  if (!Array.isArray(v.pages) || v.pages.length === 0) return false;
  return v.pages.every((p) => {
    const page = p as Record<string, unknown>;
    const canvas = page?.canvas as Record<string, unknown> | undefined;
    return (
      typeof page?.id === "string" && Array.isArray(canvas?.elements)
    );
  });
}

export function loadSchema(): FormSchema | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return isValidSchema(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveSchema(schema: FormSchema): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(schema));
  } catch {
    // storage full / unavailable — ignore for now.
  }
}

// --- useSyncExternalStore adapters (client-only reads without hydration churn) ---

let snapshotCache: { raw: string | null; value: FormSchema | null } = {
  raw: null,
  value: null,
};

/** Stable-reference snapshot of the saved schema (cached by raw string). */
export function getSchemaSnapshot(): FormSchema | null {
  if (typeof window === "undefined") return null;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    raw = null;
  }
  if (raw === snapshotCache.raw) return snapshotCache.value;
  let value: FormSchema | null = null;
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      value = isValidSchema(parsed) ? normalizeSchema(parsed) : null;
    } catch {
      value = null;
    }
  }
  snapshotCache = { raw, value };
  return value;
}

export function getServerSchemaSnapshot(): FormSchema | null {
  return null;
}

export function subscribeSchema(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}
