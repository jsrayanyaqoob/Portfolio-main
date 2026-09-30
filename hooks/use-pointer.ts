"use client";

import { useEffect, useRef } from "react";

/** Normalized pointer position in [-1, 1], read via a ref (no re-renders). */
export function usePointerRef() {
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    function handleMove(e: PointerEvent) {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    }
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  return pointer;
}
