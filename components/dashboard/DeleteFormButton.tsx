"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteForm } from "@/lib/api";

export function DeleteFormButton({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        if (!confirm("Delete this form and all its responses?")) return;
        setBusy(true);
        try {
          await deleteForm(id);
          router.refresh();
        } finally {
          setBusy(false);
        }
      }}
      className="rounded-md px-2 py-1 text-xs font-medium text-zinc-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
    >
      Delete
    </button>
  );
}
