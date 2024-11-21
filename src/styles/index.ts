// styles.ts
import { CSSProperties } from "react";

export const tipsStyle: CSSProperties = {
  lineHeight: "100%",
  fontSize: 18,
};

export const hiddenStyle: CSSProperties = {
  transition: "visibility 0s, opacity ease-in-out 1s",
  opacity: 0,
  visibility: "hidden" as const,
};

export function showHiddenStyle(el: HTMLElement | null) {
  if (el?.style) {
    setTimeout(() => {
      el.style.removeProperty("visibility");
      el.style.opacity = "1";
    }, 300);
  }
}
