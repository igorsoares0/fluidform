import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 text-center">
      <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-xl font-bold text-white">
        F
      </span>
      <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-zinc-900">
        Design beautiful forms on a fluid canvas.
      </h1>
      <p className="mt-4 max-w-md text-lg text-zinc-500">
        FluidForm is a visual form builder — compose, style, and arrange fields
        freely, like designing a landing page that happens to collect data.
      </p>
      <Link
        href="/editor"
        className="mt-8 inline-flex h-11 items-center rounded-full bg-zinc-900 px-7 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
      >
        Open the editor
      </Link>
    </div>
  );
}
