"use client";

import { useEffect, useMemo, useState } from "react";
import { CANVAS_MIN_HEIGHT, CANVAS_WIDTH } from "@/lib/grid";
import { resolveElementStyle } from "@/lib/theme";
import type { Breakpoint, Element, FormSchema } from "@/lib/types";
import {
  RenderButton,
  RenderHeading,
  RenderInput,
  RenderText,
} from "./fields";

function breakpointForWidth(w: number): Breakpoint {
  if (w < 640) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

function canvasHeight(elements: Element[], bp: Breakpoint): number {
  let max = CANVAS_MIN_HEIGHT;
  for (const el of elements) {
    const p = el.position[bp];
    max = Math.max(max, p.y + p.height + 48);
  }
  return max;
}

type Values = Record<string, string>;

export function FormRenderer({ schema }: { schema: FormSchema }) {
  const [vw, setVw] = useState(1024);
  const [pageIndex, setPageIndex] = useState(0);
  const [values, setValues] = useState<Values>({});
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const bp = breakpointForWidth(vw);
  const theme = schema.theme;
  const pages = schema.pages;
  const page = pages[Math.min(pageIndex, pages.length - 1)];
  const elements = useMemo(
    () => page.canvas.elements.filter((e) => !e.hidden),
    [page],
  );

  const cw = CANVAS_WIDTH[bp];
  const ch = canvasHeight(elements, bp);
  const containerWidth = Math.min(vw - 32, cw);
  const scale = containerWidth / cw;

  function validateCurrentPage(): boolean {
    const missing = new Set<string>();
    for (const el of elements) {
      if (el.type === "input" && el.required) {
        if (!(values[el.id] ?? "").trim()) missing.add(el.id);
      }
    }
    setErrors(missing);
    return missing.size === 0;
  }

  function activateButton(el: Extract<Element, { type: "button" }>) {
    if (el.action === "link") {
      if (el.href) window.open(el.href, "_blank", "noopener");
      return;
    }
    if (!validateCurrentPage()) return;
    const isLast = pageIndex >= pages.length - 1;
    if (el.action === "submit" || isLast) {
      setSubmitted(true);
    } else {
      setErrors(new Set());
      setPageIndex((i) => i + 1);
    }
  }

  if (submitted) {
    const answered = pages
      .flatMap((p) => p.canvas.elements)
      .filter((e): e is Extract<Element, { type: "input" }> => e.type === "input")
      .map((e) => ({ label: e.label || e.placeholder || "Field", value: values[e.id] ?? "" }))
      .filter((e) => e.value.trim().length > 0);

    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-zinc-200">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-zinc-900">Thank you!</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Your response was recorded (locally — no backend yet).
          </p>
          {answered.length > 0 ? (
            <dl className="mt-5 space-y-2 text-left">
              {answered.map((a, i) => (
                <div key={i} className="rounded-lg bg-zinc-50 px-3 py-2">
                  <dt className="text-[11px] font-medium tracking-wide text-zinc-400 uppercase">
                    {a.label}
                  </dt>
                  <dd className="text-sm text-zinc-800">{a.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-10"
      style={{ backgroundColor: theme.tokens.colors.background, fontFamily: theme.tokens.fontFamily }}
    >
      {pages.length > 1 ? (
        <div className="mx-auto mb-6 w-full max-w-md px-4">
          <div className="mb-1.5 flex justify-between text-xs text-zinc-400">
            <span>{page.name}</span>
            <span>
              Step {pageIndex + 1} of {pages.length}
            </span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-zinc-200">
            <div
              className="h-full bg-blue-600 transition-all"
              style={{ width: `${((pageIndex + 1) / pages.length) * 100}%` }}
            />
          </div>
        </div>
      ) : null}

      <div
        className="relative mx-auto"
        style={{ width: cw * scale, height: ch * scale }}
      >
        <div
          className="absolute top-0 left-0 overflow-hidden rounded-xl"
          style={{
            width: cw,
            height: ch,
            backgroundColor: theme.tokens.colors.background,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {elements.map((el) => {
            const p = el.position[bp];
            const style = resolveElementStyle(el, theme);
            return (
              <div
                key={el.id}
                className="absolute"
                style={{ left: p.x, top: p.y, width: p.width, height: p.height }}
              >
                {el.type === "heading" ? (
                  <RenderHeading element={el} style={style} />
                ) : el.type === "text" ? (
                  <RenderText element={el} style={style} />
                ) : el.type === "input" ? (
                  <RenderInput
                    element={el}
                    style={style}
                    value={values[el.id] ?? ""}
                    error={errors.has(el.id)}
                    onChange={(v) =>
                      setValues((prev) => ({ ...prev, [el.id]: v }))
                    }
                  />
                ) : (
                  <RenderButton
                    element={el}
                    style={style}
                    onActivate={() => activateButton(el)}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
