"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createForm } from "@/lib/api";

export function NewFormButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <button
      type="button"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        try {
          const id = await createForm();
          router.push(`/editor/${id}`);
        } catch {
          setLoading(false);
        }
      }}
      className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-60"
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M12 5v14M5 12h14" />
      </svg>
      {loading ? "Creating…" : "New form"}
    </button>
  );
}
