import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { NewFormButton } from "@/components/dashboard/NewFormButton";
import { DeleteFormButton } from "@/components/dashboard/DeleteFormButton";

export const dynamic = "force-dynamic";

function timeAgo(date: Date): string {
  return new Date(date).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function Dashboard() {
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

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-base font-bold text-white">
              F
            </span>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
                FluidForm
              </h1>
              <p className="text-sm text-zinc-500">Your forms</p>
            </div>
          </div>
          <NewFormButton />
        </header>

        {forms.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white py-20 text-center">
            <p className="text-sm text-zinc-500">
              No forms yet. Create your first one to start designing.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-zinc-100 overflow-hidden rounded-2xl bg-white ring-1 ring-zinc-200">
            {forms.map((form) => (
              <li
                key={form.id}
                className="flex items-center gap-4 px-5 py-4 hover:bg-zinc-50"
              >
                <Link href={`/editor/${form.id}`} className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-zinc-900">
                    {form.title || "Untitled form"}
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-400">
                    Edited {timeAgo(form.updatedAt)} ·{" "}
                    {form._count.responses} response
                    {form._count.responses === 1 ? "" : "s"}
                  </p>
                </Link>
                <div className="flex items-center gap-1 text-xs">
                  <Link
                    href={`/forms/${form.id}/responses`}
                    className="rounded-md px-2 py-1 font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
                  >
                    Responses
                  </Link>
                  <a
                    href={`/f/${form.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md px-2 py-1 font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
                  >
                    View
                  </a>
                  <Link
                    href={`/editor/${form.id}`}
                    className="rounded-md px-2 py-1 font-medium text-blue-600 hover:bg-blue-50"
                  >
                    Edit
                  </Link>
                  <DeleteFormButton id={form.id} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
