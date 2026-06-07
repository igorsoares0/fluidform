import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { normalizeSchema } from "@/lib/theme";
import type { Element, FormSchema } from "@/lib/types";
import {
  displayValue,
  fieldLabel,
  isFieldElement,
  type Values,
} from "@/components/render/value";

export const dynamic = "force-dynamic";

export default async function ResponsesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const form = await prisma.form.findUnique({
    where: { id },
    include: { responses: { orderBy: { createdAt: "desc" } } },
  });
  if (!form) notFound();

  const schema = normalizeSchema(form.schema as unknown as FormSchema);
  const fields: Element[] = schema.pages
    .flatMap((p) => p.canvas.elements)
    .filter(isFieldElement);

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link href="/" className="text-xs font-medium text-blue-600 hover:underline">
              ← Dashboard
            </Link>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-zinc-900">
              {form.title || "Untitled form"}
            </h1>
            <p className="text-sm text-zinc-500">
              {form.responses.length} response
              {form.responses.length === 1 ? "" : "s"}
            </p>
          </div>
          <a
            href={`/f/${form.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-zinc-900 px-4 py-2 text-xs font-medium text-white hover:bg-zinc-700"
          >
            Open form
          </a>
        </div>

        {form.responses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white py-20 text-center text-sm text-zinc-500">
            No responses yet. Share the form link to start collecting.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-zinc-200">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-100 text-xs text-zinc-400">
                  <th className="px-4 py-3 font-medium">Submitted</th>
                  {fields.map((f) => (
                    <th key={f.id} className="px-4 py-3 font-medium whitespace-nowrap">
                      {fieldLabel(f)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {form.responses.map((r) => {
                  const data = r.data as unknown as Values;
                  return (
                    <tr key={r.id} className="text-zinc-700">
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-zinc-400">
                        {new Date(r.createdAt).toLocaleString()}
                      </td>
                      {fields.map((f) => (
                        <td key={f.id} className="px-4 py-3">
                          {displayValue(data[f.id]) || (
                            <span className="text-zinc-300">—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
