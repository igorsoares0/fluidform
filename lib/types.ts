// FluidForm core schema.
// Per spec (specs.md): Canvas -> Elements -> Theme -> Form Logic -> Renderer.
// The editor never manipulates React directly; everything is this JSON schema.

export type Breakpoint = "desktop" | "tablet" | "mobile";

export type ElementType =
  | "heading"
  | "text"
  | "input"
  | "button"
  | "select"
  | "radio"
  | "checkbox"
  | "rating"
  | "nps"
  | "slider"
  | "date"
  | "upload";

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

// Conditional logic (spec: field & page visibility driven by answers).
export type LogicOperator =
  | "equals"
  | "notEquals"
  | "contains"
  | "greaterThan"
  | "lessThan";

export type Condition = {
  fieldId: string; // element id whose answer is tested
  operator: LogicOperator;
  value: string;
};

export type VisibilityRule = {
  action: "show" | "hide"; // when conditions match, show or hide the target
  match: "all" | "any"; // AND / OR across conditions
  conditions: Condition[];
};

type BaseElement = {
  id: string;
  type: ElementType;
  name: string;
  position: ResponsivePosition;
  locked: boolean;
  hidden: boolean;
  style: ElementStyle;
  logic?: VisibilityRule;
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

/** Dropdown — single choice from `options`. */
export type SelectElement = BaseElement & {
  type: "select";
  label: string;
  placeholder: string;
  required: boolean;
  options: string[];
};

/** Radio group — single choice. */
export type RadioElement = BaseElement & {
  type: "radio";
  label: string;
  required: boolean;
  options: string[];
};

/** Checkbox group — multiple choice (value is a list). */
export type CheckboxElement = BaseElement & {
  type: "checkbox";
  label: string;
  required: boolean;
  options: string[];
};

/** Star rating from 1..max. */
export type RatingElement = BaseElement & {
  type: "rating";
  label: string;
  required: boolean;
  max: number;
};

/** Net Promoter Score 0..10. */
export type NpsElement = BaseElement & {
  type: "nps";
  label: string;
  required: boolean;
};

/** Numeric slider. */
export type SliderElement = BaseElement & {
  type: "slider";
  label: string;
  required: boolean;
  min: number;
  max: number;
  step: number;
};

/** Date picker. */
export type DateElement = BaseElement & {
  type: "date";
  label: string;
  required: boolean;
};

/** File upload (captures filename only until a backend exists). */
export type UploadElement = BaseElement & {
  type: "upload";
  label: string;
  required: boolean;
};

export type Element =
  | HeadingElement
  | TextElement
  | InputElement
  | ButtonElement
  | SelectElement
  | RadioElement
  | CheckboxElement
  | RatingElement
  | NpsElement
  | SliderElement
  | DateElement
  | UploadElement;

export type Canvas = {
  width: number;
  minHeight: number;
  elements: Element[];
};

export type Page = {
  id: string;
  name: string;
  canvas: Canvas;
  logic?: VisibilityRule;
};

/**
 * Theme tokens drive the whole form's look. Elements inherit these by default;
 * a per-element `style` field only overrides specific tokens when set.
 */
export type ThemeColors = {
  background: string; // page / canvas background
  surface: string; // input + card background
  text: string; // primary text
  mutedText: string; // secondary text
  primary: string; // CTA / accent background
  primaryText: string; // text on primary
  border: string; // input + card borders
};

export type ThemeTokens = {
  colors: ThemeColors;
  fontFamily: string; // CSS font-family stack applied at the form root
  radius: number; // base corner radius
  shadow: ShadowToken; // default elevation for surfaces
};

export type ThemeConfig = {
  preset: string; // preset name, or "custom" once tokens are edited
  tokens: ThemeTokens;
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
