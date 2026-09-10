"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/lib/store";
import { useIsTouchDevice } from "@/hooks/use-media-query";

const LABELS: Record<string, string> = {
  view: "VIEW ↗",
  explore: "EXPLORE",
};

export function CustomCursor() {
  const isTouch = useIsTouchDevice();
  const { cursorVariant, cursorText } = useUIStore();
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { damping: 30, stiffness: 400, mass: 0.4 });
  const springY = useSpring(y, { damping: 30, stiffness: 400, mass: 0.4 });

  useEffect(() => {
    if (isTouch) return;

    function handleMove(e: PointerEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);
    }
    function handleLeave() {
      setVisible(false);
    }

    window.addEventListener("pointermove", handleMove);
    document.documentElement.classList.add("custom-cursor-active");
    document.addEventListener("mouseleave", handleLeave);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      document.removeEventListener("mouseleave", handleLeave);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, [isTouch, visible, x, y]);

  if (isTouch) return null;

  const isExpanded = cursorVariant !== "default" && cursorVariant !== "hidden";
  const label = cursorText || LABELS[cursorVariant] || "";

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[100]"
      style={{ x: springX, y: springY }}
      animate={{ opacity: visible && cursorVariant !== "hidden" ? 1 : 0 }}
      transition={{ duration: 0.15 }}
    >
      <motion.div
        className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-text bg-bg/80"
        animate={{
          width: isExpanded ? 64 : 8,
          height: isExpanded ? 64 : 8,
          borderWidth: isExpanded ? 1 : 0,
        }}
        style={{ backgroundColor: isExpanded ? undefined : "var(--color-text)" }}
        transition={{ type: "spring", damping: 28, stiffness: 320 }}
      >
        <AnimatePresence>
          {isExpanded && label && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-mono text-[9px] font-medium tracking-widest text-text"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
