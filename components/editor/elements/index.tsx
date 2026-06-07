import type { ReactNode } from "react";
import type { Element, ElementType, ThemeConfig } from "@/lib/types";
import { resolveElementStyle, themeAccent } from "@/lib/theme";
import { HeadingElement } from "./HeadingElement";
import { TextElement } from "./TextElement";
import { InputElement } from "./InputElement";
import { ButtonElement } from "./ButtonElement";
import { ImageElement } from "./ImageElement";
import {
  CheckboxPreview,
  RadioPreview,
  SelectPreview,
} from "./ChoiceElements";
import { NpsPreview, RatingPreview, SliderPreview } from "./ScaleElements";
import { DatePreview, UploadPreview } from "./UtilityElements";

const ic = "h-4 w-4";
const svgProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const ICONS: Record<ElementType, ReactNode> = {
  heading: (
    <svg className={ic} viewBox="0 0 24 24" {...svgProps}>
      <path d="M6 4v16M18 4v16M6 12h12" />
    </svg>
  ),
  text: (
    <svg className={ic} viewBox="0 0 24 24" {...svgProps}>
      <path d="M4 6h16M4 12h16M4 18h10" />
    </svg>
  ),
  input: (
    <svg className={ic} viewBox="0 0 24 24" {...svgProps}>
      <rect x="3" y="8" width="18" height="8" rx="2" />
      <path d="M7 12h4" />
    </svg>
  ),
  button: (
    <svg className={ic} viewBox="0 0 24 24" {...svgProps}>
      <rect x="3" y="9" width="18" height="6" rx="3" />
    </svg>
  ),
  image: (
    <svg className={ic} viewBox="0 0 24 24" {...svgProps}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  ),
  select: (
    <svg className={ic} viewBox="0 0 24 24" {...svgProps}>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M14 10l2 2 2-2" />
    </svg>
  ),
  radio: (
    <svg className={ic} viewBox="0 0 24 24" {...svgProps}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3.5" fill="currentColor" stroke="none" />
    </svg>
  ),
  checkbox: (
    <svg className={ic} viewBox="0 0 24 24" {...svgProps}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 12l3 3 5-6" />
    </svg>
  ),
  rating: (
    <svg className={ic} viewBox="0 0 24 24" {...svgProps}>
      <path d="M12 3l2.5 5.5 6 .5-4.5 4 1.3 5.8L12 16l-5.3 3.3L8 13.5 3.5 9.5l6-.5L12 3z" />
    </svg>
  ),
  nps: (
    <svg className={ic} viewBox="0 0 24 24" {...svgProps}>
      <rect x="3" y="9" width="4" height="6" rx="1" />
      <rect x="10" y="9" width="4" height="6" rx="1" />
      <rect x="17" y="9" width="4" height="6" rx="1" />
    </svg>
  ),
  slider: (
    <svg className={ic} viewBox="0 0 24 24" {...svgProps}>
      <path d="M3 12h18" />
      <circle cx="9" cy="12" r="3" fill="currentColor" stroke="none" />
    </svg>
  ),
  date: (
    <svg className={ic} viewBox="0 0 24 24" {...svgProps}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
  upload: (
    <svg className={ic} viewBox="0 0 24 24" {...svgProps}>
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
    </svg>
  ),
};

type RegistryEntry = { label: string; icon: ReactNode };

export const ELEMENT_REGISTRY: Record<ElementType, RegistryEntry> = {
  heading: { label: "Heading", icon: ICONS.heading },
  text: { label: "Text", icon: ICONS.text },
  image: { label: "Image", icon: ICONS.image },
  input: { label: "Input", icon: ICONS.input },
  button: { label: "Button", icon: ICONS.button },
  select: { label: "Dropdown", icon: ICONS.select },
  radio: { label: "Radio", icon: ICONS.radio },
  checkbox: { label: "Checkboxes", icon: ICONS.checkbox },
  rating: { label: "Rating", icon: ICONS.rating },
  nps: { label: "NPS", icon: ICONS.nps },
  slider: { label: "Slider", icon: ICONS.slider },
  date: { label: "Date", icon: ICONS.date },
  upload: { label: "Upload", icon: ICONS.upload },
};

/** Grouped element types for the toolbar "Add" menu. */
export const ELEMENT_GROUPS: { title: string; types: ElementType[] }[] = [
  { title: "Content", types: ["heading", "text", "image", "button"] },
  { title: "Inputs", types: ["input", "date", "upload"] },
  { title: "Choice", types: ["select", "radio", "checkbox"] },
  { title: "Feedback", types: ["rating", "nps", "slider"] },
];

/** Dispatch an element to its renderer with theme-resolved style applied. */
export function renderElement(element: Element, theme: ThemeConfig): ReactNode {
  const style = resolveElementStyle(element, theme);
  const accent = themeAccent(theme);
  switch (element.type) {
    case "heading":
      return <HeadingElement element={element} style={style} />;
    case "text":
      return <TextElement element={element} style={style} />;
    case "image":
      return <ImageElement element={element} style={style} />;
    case "input":
      return <InputElement element={element} style={style} />;
    case "button":
      return <ButtonElement element={element} style={style} />;
    case "select":
      return <SelectPreview element={element} style={style} />;
    case "radio":
      return <RadioPreview element={element} style={style} accent={accent} />;
    case "checkbox":
      return <CheckboxPreview element={element} style={style} accent={accent} />;
    case "rating":
      return <RatingPreview element={element} style={style} accent={accent} />;
    case "nps":
      return <NpsPreview element={element} style={style} accent={accent} />;
    case "slider":
      return <SliderPreview element={element} style={style} accent={accent} />;
    case "date":
      return <DatePreview element={element} style={style} />;
    case "upload":
      return <UploadPreview element={element} style={style} />;
  }
}
