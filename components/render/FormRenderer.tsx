"use client";

import { useEffect, useState } from "react";
import { CANVAS_MIN_HEIGHT, CANVAS_WIDTH } from "@/lib/grid";
import { resolveElementStyle, themeAccent } from "@/lib/theme";
import { submitResponse } from "@/lib/api";
import { isElementVisible, isPageVisible } from "@/lib/logic";
import type { Breakpoint, Element, FormSchema } from "@/lib/types";
import {
  RenderButton,
  RenderHeading,
  RenderInput,
  RenderText,
} from "./fields";
import {
  RenderCheckbox,
  RenderDate,
  RenderNps,
  RenderRadio,
  RenderRating,
  RenderSelect,
  RenderSlider,
  RenderUpload,
} from "./extraFields";
import {
  displayValue,
  fieldLabel,
  isAnswered,
  isFieldElement,
  type FieldValue,
  type Values,
} from "./value";

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

export function FormRenderer({
  schema,
  formId,
}: {
  schema: FormSchema;
  formId?: string;
}) {
  const [vw, setVw] = useState(1024);
  const [pageIndex, setPageIndex] = useState(0);
  const [values, setValues] = useState<Values>({});
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const bp = breakpointForWidth(vw);
  const theme = schema.theme;
  const accent = themeAccent(theme);
  const pages = schema.pages;
  // Pages and fields can be hidden by conditional logic based on current answers.
  const visiblePages = pages.filter((p) => isPageVisible(p, values));
  const page =
    visiblePages[Math.min(pageIndex, visiblePages.length - 1)] ?? pages[0];
  const pageElements = page.canvas.elements.filter((e) => !e.hidden);
  const elements = pageElements.filter((e) => isElementVisible(e, values));

  const cw = CANVAS_WIDTH[bp];
  // Height stays stable (based on non-hidden elements) so toggling fields
  // doesn't make the form jump.
  const ch = canvasHeight(pageElements, bp);
  const containerWidth = Math.min(vw - 32, cw);
  const scale = containerWidth / cw;

  const setValue = (id: string, v: FieldValue) =>
    setValues((prev) => ({ ...prev, [id]: v }));

  function validateCurrentPage(): boolean {
    const missing = new Set<string>();
    for (const el of elements) {
      if (isFieldElement(el) && "required" in el && el.required) {
        if (!isAnswered(el, values[el.id])) missing.add(el.id);
      }
    }
    setErrors(missing);
    return missing.size === 0;
  }

  async function activateButton(el: Extract<Element, { type: "button" }>) {
    if (el.action === "link") {
      if (el.href) window.open(el.href, "_blank", "noopener");
      return;
    }
    if (submitting) return;
    if (!validateCurrentPage()) return;
    const isLast = pageIndex >= visiblePages.length - 1;
    if (el.action === "submit" || isLast) {
      if (formId) {
        setSubmitting(true);
        const res = await submitResponse(formId, values);
        setSubmitting(false);
        if (!res.ok) {
          if (res.missing) setErrors(new Set(res.missing));
          return;
        }
      }
      setSubmitted(true);
    } else {
      setErrors(new Set());
      setPageIndex((i) => i + 1);
    }
  }

  function renderField(el: Element) {
    const style = resolveElementStyle(el, theme);
    const err = errors.has(el.id);
    switch (el.type) {
      case "heading":
        return <RenderHeading element={el} style={style} />;
      case "text":
        return <RenderText element={el} style={style} />;
      case "button":
        return (
          <RenderButton element={el} style={style} onActivate={() => activateButton(el)} />
        );
      case "input":
        return (
          <RenderInput
            element={el}
            style={style}
            value={(values[el.id] as string) ?? ""}
            error={err}
            onChange={(v) => setValue(el.id, v)}
          />
        );
      case "select":
        return (
          <RenderSelect
            element={el}
            style={style}
            value={(values[el.id] as string) ?? ""}
            error={err}
            onChange={(v) => setValue(el.id, v)}
          />
        );
      case "radio":
        return (
          <RenderRadio
            element={el}
            style={style}
            accent={accent}
            value={(values[el.id] as string) ?? ""}
            onChange={(v) => setValue(el.id, v)}
          />
        );
      case "checkbox":
        return (
          <RenderCheckbox
            element={el}
            style={style}
            accent={accent}
            value={(values[el.id] as string[]) ?? []}
            onChange={(v) => setValue(el.id, v)}
          />
        );
      case "rating":
        return (
          <RenderRating
            element={el}
            style={style}
            accent={accent}
            value={values[el.id] as number | undefined}
            onChange={(v) => setValue(el.id, v)}
          />
        );
      case "nps":
        return (
          <RenderNps
            element={el}
            style={style}
            accent={accent}
            value={values[el.id] as number | undefined}
            onChange={(v) => setValue(el.id, v)}
          />
        );
      case "slider":
        return (
          <RenderSlider
            element={el}
            style={style}
            accent={accent}
            value={values[el.id] as number | undefined}
            onChange={(v) => setValue(el.id, v)}
          />
        );
      case "date":
        return (
          <RenderDate
            element={el}
            style={style}
            value={(values[el.id] as string) ?? ""}
            error={err}
            onChange={(v) => setValue(el.id, v)}
          />
        );
      case "upload":
        return (
          <RenderUpload
            element={el}
            style={style}
            value={(values[el.id] as string) ?? ""}
            error={err}
            onChange={(v) => setValue(el.id, v)}
          />
        );
    }
  }

  if (submitted) {
    const answered = visiblePages
      .flatMap((p) => p.canvas.elements)
      .filter(
        (e) =>
          isFieldElement(e) &&
          isElementVisible(e, values) &&
          isAnswered(e, values[e.id]),
      )
      .map((e) => ({ label: fieldLabel(e), value: displayValue(values[e.id]) }));

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
      {visiblePages.length > 1 ? (
        <div className="mx-auto mb-6 w-full max-w-md px-4">
          <div className="mb-1.5 flex justify-between text-xs text-zinc-400">
            <span>{page.name}</span>
            <span>
              Step {Math.min(pageIndex + 1, visiblePages.length)} of{" "}
              {visiblePages.length}
            </span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-zinc-200">
            <div
              className="h-full transition-all"
              style={{
                width: `${(Math.min(pageIndex + 1, visiblePages.length) / visiblePages.length) * 100}%`,
                background: accent,
              }}
            />
          </div>
        </div>
      ) : null}

      <div className="relative mx-auto" style={{ width: cw * scale, height: ch * scale }}>
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
            return (
              <div
                key={el.id}
                className="absolute"
                style={{ left: p.x, top: p.y, width: p.width, height: p.height }}
              >
                {renderField(el)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
