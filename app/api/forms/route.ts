import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toJson } from "@/lib/json";
import { createInitialSchema } from "@/lib/schema-factory";

// GET /api/forms — list forms for the dashboard.
export async function GET() {
  const forms = await prisma.form.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      published: true,
      updatedAt: true,
      _count: { select: { responses: true } },
    },
  });
  return NextResponse.json(
    forms.map((f) => ({
      id: f.id,
      title: f.title,
      published: f.published,
      updatedAt: f.updatedAt,
      responseCount: f._count.responses,
    })),
  );
}

// POST /api/forms — create a blank form, return its id.
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const title =
    typeof body?.title === "string" && body.title.trim()
      ? body.title.trim()
      : "Untitled form";
  const schema = createInitialSchema(title);
  const form = await prisma.form.create({
    data: { title, schema: toJson(schema), published: false },
  });
  return NextResponse.json({ id: form.id }, { status: 201 });
}
