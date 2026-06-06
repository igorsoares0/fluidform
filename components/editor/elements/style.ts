import type { CSSProperties } from "react";
import type { ElementStyle, ShadowToken } from "@/lib/types";

const SHADOWS: Record<ShadowToken, string> = {
  none: "none",
  sm: "0 1px 2px rgba(0,0,0,0.06)",
  md: "0 4px 12px rgba(0,0,0,0.08)",
  lg: "0 10px 30px rgba(0,0,0,0.12)",
  xl: "0 20px 60px rgba(0,0,0,0.18)",
};

/** Translate the shared ElementStyle tokens into inline CSS. */
export function boxStyle(style: ElementStyle): CSSProperties {
  return {
    background: style.background,
    color: style.color,
    borderStyle: style.borderWidth ? "solid" : undefined,
    borderColor: style.borderColor,
    borderWidth: style.borderWidth,
    borderRadius: style.radius,
    boxShadow: style.shadow ? SHADOWS[style.shadow] : undefined,
    opacity: style.opacity,
  };
}

export function textStyle(style: ElementStyle): CSSProperties {
  return {
    color: style.color,
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    textAlign: style.textAlign,
    opacity: style.opacity,
  };
}
