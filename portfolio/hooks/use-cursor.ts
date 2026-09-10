"use client";

import { useUIStore, type CursorVariant } from "@/lib/store";

export function useCursorHover(variant: CursorVariant, text?: string) {
  const setCursor = useUIStore((s) => s.setCursor);
  return {
    onMouseEnter: () => setCursor(variant, text),
    onMouseLeave: () => setCursor("default"),
  };
}
