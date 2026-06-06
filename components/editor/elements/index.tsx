import type { ReactNode } from "react";
import type { Element, ElementType } from "@/lib/types";
import { HeadingElement } from "./HeadingElement";
import { TextElement } from "./TextElement";
import { InputElement } from "./InputElement";
import { ButtonElement } from "./ButtonElement";

const ic = "h-4 w-4";

function HeadingIcon() {
  return (
    <svg className={ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M6 4v16M18 4v16M6 12h12" />
    </svg>
  );
}
function TextIcon() {
  return (
    <svg className={ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 6h16M4 12h16M4 18h10" />
    </svg>
  );
}
function InputIcon() {
  return (
    <svg className={ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="8" width="18" height="8" rx="2" />
      <path d="M7 12h4" />
    </svg>
  );
}
function ButtonIcon() {
  return (
    <svg className={ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="9" width="18" height="6" rx="3" />
    </svg>
  );
}

type RegistryEntry = {
  label: string;
  icon: ReactNode;
};

export const ELEMENT_REGISTRY: Record<ElementType, RegistryEntry> = {
  heading: { label: "Heading", icon: <HeadingIcon /> },
  text: { label: "Text", icon: <TextIcon /> },
  input: { label: "Input", icon: <InputIcon /> },
  button: { label: "Button", icon: <ButtonIcon /> },
};

export const INSERTABLE_TYPES: ElementType[] = [
  "heading",
  "text",
  "input",
  "button",
];

/** Dispatch an element to its presentational renderer (type -> component). */
export function renderElement(element: Element): ReactNode {
  switch (element.type) {
    case "heading":
      return <HeadingElement element={element} />;
    case "text":
      return <TextElement element={element} />;
    case "input":
      return <InputElement element={element} />;
    case "button":
      return <ButtonElement element={element} />;
  }
}
