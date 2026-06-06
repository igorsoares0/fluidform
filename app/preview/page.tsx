"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import {
  getSchemaSnapshot,
  getServerSchemaSnapshot,
  subscribeSchema,
} from "@/lib/persistence";
import { FormRenderer } from "@/components/render/FormRenderer";

export default function PreviewPage() {
  const schema = useSyncExternalStore(
    subscribeSchema,
    getSchemaSnapshot,
    getServerSchemaSnapshot,
  );

  if (!schema || schema.pages.every((p) => p.canvas.elements.length === 0)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-zinc-50 text-center">
        <p className="text-sm text-zinc-500">
          Nothing to preview yet — add some elements in the editor first.
        </p>
        <Link
          href="/editor"
          className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-700"
        >
          Open the editor
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-2 text-xs text-zinc-500">
        <span className="rounded-full bg-amber-100 px-2 py-0.5 font-medium text-amber-700">
          Preview
        </span>
        <span className="truncate font-medium text-zinc-700">{schema.title}</span>
        <Link href="/editor" className="font-medium text-blue-600 hover:underline">
          Back to editor
        </Link>
      </div>
      <FormRenderer schema={schema} />
    </div>
  );
}
