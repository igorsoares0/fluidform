"use client";

import type { ReactNode } from "react";

export function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="border-b border-zinc-200 px-4 py-3.5">
      <h3 className="mb-2.5 text-[11px] font-semibold tracking-wide text-zinc-400 uppercase">
        {title}
      </h3>
      <div className="flex flex-col gap-2.5">{children}</div>
    </div>
  );
}

export function Row({
  label,
  children,
  onReset,
}: {
  label: string;
  children: ReactNode;
  /** When set, a small "reset to theme" control appears next to the label. */
  onReset?: () => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3">
      <span className="flex shrink-0 items-center gap-1 text-xs text-zinc-500">
        {label}
        {onReset ? (
          <button
            type="button"
            title="Reset to theme"
            aria-label="Reset to theme"
            onClick={(e) => {
              e.preventDefault();
              onReset();
            }}
            className="text-zinc-300 hover:text-blue-600"
          >
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 109-9 9 9 0 00-6.4 2.7L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
        ) : null}
      </span>
      <div className="flex min-w-0 flex-1 justify-end">{children}</div>
    </label>
  );
}

const fieldCls =
  "w-full rounded-md border border-zinc-200 bg-white px-2 py-1.5 text-xs text-zinc-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

export function TextField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      className={fieldCls}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function TextArea({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <textarea
      rows={3}
      className={`${fieldCls} resize-none`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function NumberField({
  value,
  onChange,
  min,
  max,
  step = 1,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <input
      type="number"
      className={`${fieldCls} w-20 text-right`}
      value={Number.isFinite(value) ? value : 0}
      min={min}
      max={max}
      step={step}
      onChange={(e) => {
        const n = parseFloat(e.target.value);
        onChange(Number.isNaN(n) ? 0 : n);
      }}
    />
  );
}

export function ColorField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const safe = value || "#000000";
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        className="h-7 w-7 shrink-0 cursor-pointer rounded border border-zinc-200 bg-white p-0.5"
        value={safe}
        onChange={(e) => onChange(e.target.value)}
      />
      <input
        type="text"
        className={`${fieldCls} w-24`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export function SliderField({
  value,
  onChange,
  min,
  max,
  step = 1,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
}) {
  return (
    <div className="flex w-32 items-center gap-2">
      <input
        type="range"
        className="flex-1 accent-blue-600"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
      <span className="w-8 text-right text-xs tabular-nums text-zinc-500">
        {value}
      </span>
    </div>
  );
}

export function SelectField<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <select
      className={`${fieldCls} w-32 cursor-pointer`}
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-5 w-9 rounded-full transition-colors ${
        checked ? "bg-blue-600" : "bg-zinc-300"
      }`}
      aria-pressed={checked}
    >
      <span
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
          checked ? "translate-x-4" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

const segBtn =
  "flex-1 rounded px-2 py-1 text-xs font-medium transition-colors";

export function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="flex w-full gap-1 rounded-md bg-zinc-100 p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`${segBtn} ${
            value === o.value
              ? "bg-white text-zinc-900 shadow-sm"
              : "text-zinc-500 hover:text-zinc-700"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
