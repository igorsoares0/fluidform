import type {
  ElementStyle,
  NpsElement,
  RatingElement,
  SliderElement,
} from "@/lib/types";

function FieldLabel({
  text,
  required,
  color,
}: {
  text: string;
  required: boolean;
  color?: string;
}) {
  if (!text) return null;
  return (
    <label className="text-sm font-medium" style={{ color }}>
      {text}
      {required ? <span className="text-red-500"> *</span> : null}
    </label>
  );
}

function Star({ filled, color }: { filled: boolean; color: string }) {
  return (
    <svg
      className="h-7 w-7"
      viewBox="0 0 24 24"
      fill={filled ? color : "none"}
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
    >
      <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7L12 2z" />
    </svg>
  );
}

export function RatingPreview({
  element,
  style,
  accent,
}: {
  element: RatingElement;
  style: ElementStyle;
  accent: string;
}) {
  const filled = Math.min(4, element.max);
  return (
    <div className="flex h-full w-full flex-col gap-2">
      <FieldLabel text={element.label} required={element.required} color={style.color} />
      <div className="flex gap-1">
        {Array.from({ length: element.max }).map((_, i) => (
          <Star key={i} filled={i < filled} color={accent} />
        ))}
      </div>
    </div>
  );
}

export function NpsPreview({
  element,
  style,
  accent,
}: {
  element: NpsElement;
  style: ElementStyle;
  accent: string;
}) {
  return (
    <div className="flex h-full w-full flex-col gap-2">
      <FieldLabel text={element.label} required={element.required} color={style.color} />
      <div className="flex gap-1">
        {Array.from({ length: 11 }).map((_, i) => (
          <span
            key={i}
            className="flex h-8 flex-1 items-center justify-center rounded border text-xs font-medium"
            style={{
              borderColor: i === 9 ? accent : style.borderColor,
              background: i === 9 ? accent : "transparent",
              color: i === 9 ? "#fff" : style.color,
            }}
          >
            {i}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SliderPreview({
  element,
  style,
  accent,
}: {
  element: SliderElement;
  style: ElementStyle;
  accent: string;
}) {
  const pct = 60;
  return (
    <div className="flex h-full w-full flex-col gap-2">
      <FieldLabel text={element.label} required={element.required} color={style.color} />
      <div className="relative flex items-center" style={{ height: 16 }}>
        <div
          className="h-1.5 w-full rounded-full"
          style={{ background: style.borderColor ?? "#e4e4e7" }}
        />
        <div
          className="absolute h-1.5 rounded-full"
          style={{ width: `${pct}%`, background: accent }}
        />
        <span
          className="absolute h-4 w-4 -translate-x-1/2 rounded-full border-2 bg-white"
          style={{ left: `${pct}%`, borderColor: accent }}
        />
      </div>
      <div className="flex justify-between text-xs" style={{ color: style.color, opacity: 0.6 }}>
        <span>{element.min}</span>
        <span>{element.max}</span>
      </div>
    </div>
  );
}
