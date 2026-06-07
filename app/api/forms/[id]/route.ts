import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toJson } from "@/lib/json";
import { isValidSchema } from "@/lib/validate";
import { normalizeSchema } from "@/lib/theme";
import type { FormSchema } from "@/lib/types";

type Ctx = { params: Promise<{ id: string }> };

// GET /api/forms/[id] — load a form's schema for the editor.
export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const form = await prisma.form.findUnique({ where: { id } });
  if (!form) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const schema = normalizeSchema(form.schema as unknown as FormSchema);
  return NextResponse.json({
    id: form.id,
    title: form.title,
    published: form.published,
    schema,
  });
}

// PUT /api/forms/[id] — save the schema (and optional published flag).
export async function PUT(req: Request, { params }: Ctx) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body || !isValidSchema(body.schema)) {
    return NextResponse.json({ error: "Invalid schema" }, { status: 400 });
  }
  const schema = normalizeSchema(body.schema as FormSchema);
  try {
    await prisma.form.update({
      where: { id },
      data: {
        title: schema.title,
        schema: toJson(schema),
        ...(typeof body.published === "boolean"
          ? { published: body.published }
          : {}),
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

// DELETE /api/forms/[id]
export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  try {
    await prisma.form.delete({ where: { id } });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
