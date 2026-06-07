import type { FormSchema } from "./types";
import type { Values } from "@/components/render/value";

// Client-side helpers for the forms API (Route Handlers in app/api/forms).

export type FormPayload = {
  id: string;
  title: string;
  published: boolean;
  schema: FormSchema;
};

export async function createForm(): Promise<string> {
  const res = await fetch("/api/forms", { method: "POST" });
  if (!res.ok) throw new Error("Failed to create form");
  const { id } = await res.json();
  return id as string;
}

export async function fetchForm(id: string): Promise<FormPayload | null> {
  const res = await fetch(`/api/forms/${id}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to load form");
  return res.json();
}

export async function saveForm(
  id: string,
  schema: FormSchema,
  published?: boolean,
): Promise<void> {
  const res = await fetch(`/api/forms/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ schema, published }),
  });
  if (!res.ok) throw new Error("Failed to save form");
}

export async function deleteForm(id: string): Promise<void> {
  const res = await fetch(`/api/forms/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete form");
}

export type SubmitResult =
  | { ok: true }
  | { ok: false; missing?: string[] };

export async function submitResponse(
  id: string,
  data: Values,
): Promise<SubmitResult> {
  const res = await fetch(`/api/forms/${id}/responses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data }),
  });
  if (res.ok) return { ok: true };
  const body = await res.json().catch(() => ({}));
  return { ok: false, missing: body.missing };
}
