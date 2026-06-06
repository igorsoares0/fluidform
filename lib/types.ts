// FluidForm core schema.
// Per spec (specs.md): Canvas -> Elements -> Theme -> Form Logic -> Renderer.
// The editor never manipulates React directly; everything is this JSON schema.

export type Breakpoint = "desktop" | "tablet" | "mobile";

export type ElementType =
  | "heading"
  | "text"
  | "input"
  | "button";

/** Absolute position of an element within the canvas, in px. */
export type Position = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/** Each breakpoint stores its own independent layout (spec: Responsive Positioning). */
export type ResponsivePosition = Record<Breakpoint, Position>;

export type TextAlign = "left" | "center" | "right";

/** Style tokens applied to a single element. Theme engine comes in a later milestone. */
export type ElementStyle = {
  background?: string;
  color?: string;
  borderColor?: string;
  borderWidth?: number;
  radius?: number;
  shadow?: ShadowToken;
  opacity?: number; // 0..1
  fontSize?: number;
  fontWeight?: number;
  textAlign?: TextAlign;
  padding?: number;
};

export type ShadowToken = "none" | "sm" | "md" | "lg" | "xl";

type BaseElement = {
  id: string;
  type: ElementType;
  name: string;
  position: ResponsivePosition;
  locked: boolean;
  hidden: boolean;
  style: ElementStyle;
};

export type HeadingElement = BaseElement & {
  type: "heading";
  text: string;
};

export type TextElement = BaseElement & {
  type: "text";
  text: string;
};

export type InputType = "text" | "email" | "phone" | "number" | "password";

export type InputElement = BaseElement & {
  type: "input";
  label: string;
  placeholder: string;
  required: boolean;
  inputType: InputType;
};

export type ButtonAction = "next" | "submit" | "link";

export type ButtonElement = BaseElement & {
  type: "button";
  label: string;
  action: ButtonAction;
  href?: string;
};

export type Element =
  | HeadingElement
  | TextElement
  | InputElement
  | ButtonElement;

export type Canvas = {
  width: number;
  minHeight: number;
  elements: Element[];
};

export type Page = {
  id: string;
  name: string;
  canvas: Canvas;
};

/** Minimal stubs for now — full theme/settings engines land in later milestones. */
export type ThemeConfig = {
  preset: string;
};

export type FormSettings = {
  showProgress: boolean;
};

export type FormSchema = {
  id: string;
  title: string;
  theme: ThemeConfig;
  pages: Page[];
  settings: FormSettings;
};
