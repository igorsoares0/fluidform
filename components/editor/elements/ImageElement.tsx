import type { ElementStyle, ImageElement as ImageEl } from "@/lib/types";
import { boxStyle } from "./style";

export function ImageElement({
  element,
  style,
}: {
  element: ImageEl;
  style: ElementStyle;
}) {
  return (
    <div
      className="flex h-full w-full items-center justify-center overflow-hidden"
      style={{ ...boxStyle(style), background: element.src ? undefined : "#f4f4f5" }}
    >
      {element.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={element.src}
          alt={element.alt}
          className="h-full w-full"
          style={{ objectFit: element.fit }}
        />
      ) : (
        <div className="flex flex-col items-center gap-1 text-zinc-400">
          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
          <span className="text-xs">Add an image URL</span>
        </div>
      )}
    </div>
  );
}
