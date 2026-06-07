import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toJson } from "@/lib/json";
import { normalizeSchema } from "@/lib/theme";
import { isElementVisible, isPageVisible } from "@/lib/logic";
import { isAnswered, isFieldElement, type Values } from "@/components/render/value";
import type { FormSchema } from "@/lib/types";

type Ctx = { params: Promise<{ id: string }> };

// GET /api/forms/[id]/responses — list submissions (newest first).
export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const responses = await prisma.response.findMany({
    where: { formId: id },
    orderBy: { createdAt: "desc" },
    select: { id: true, data: true, createdAt: true },
  });
  return NextResponse.json(responses);
}

// POST /api/forms/[id]/responses — submit a filled form.
export async function POST(req: Request, { params }: Ctx) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body || typeof body.data !== "object" || body.data === null) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
  const data = body.data as Values;

  const form = await prisma.form.findUnique({ where: { id } });
  if (!form) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Server-side required-field validation (defence in depth).
  const schema = normalizeSchema(form.schema as unknown as FormSchema);
  const missing: string[] = [];
  for (const page of schema.pages) {
    if (!isPageVisible(page, data)) continue;
    for (const el of page.canvas.elements) {
      if (el.hidden || !isElementVisible(el, data)) continue;
      if (isFieldElement(el) && "required" in el && el.required) {
        if (!isAnswered(el, data[el.id])) missing.push(el.id);
      }
    }
  }
  if (missing.length > 0) {
    return NextResponse.json(
      { error: "Missing required fields", missing },
      { status: 400 },
    );
  }

  await prisma.response.create({
    data: { formId: id, data: toJson(data) },
  });
  return NextResponse.json({ ok: true }, { status: 201 });
}
