"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { siteConfig } from "@/config/site";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const MIN_VISIBLE_MS = 700;
const SAFETY_TIMEOUT_MS = 4000;

export function LoadingScreen() {
  const reducedMotion = useReducedMotion();
  const [exiting, setExiting] = useState(false);
  const [removed, setRemoved] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const body = document.body;
    const prevOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    const counter = { value: 0 };
    const setProgress = (v: number) => {
      if (barRef.current) barRef.current.style.width = `${v}%`;
      if (countRef.current) countRef.current.textContent = String(Math.round(v)).padStart(2, "0");
    };

    // Real load progress isn't meaningfully measurable up front, so this
    // ticks up to a believable ~92% on its own and only jumps to 100% once
    // fonts + the window load event actually confirm the page is ready.
    const tween = reducedMotion
      ? null
      : gsap.to(counter, {
          value: 92,
          duration: 2.4,
          ease: "power1.out",
          onUpdate: () => setProgress(counter.value),
        });

    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
    const windowLoaded =
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise<void>((resolve) => window.addEventListener("load", () => resolve(), { once: true }));
    const minDelay = new Promise<void>((resolve) => setTimeout(resolve, MIN_VISIBLE_MS));
    const ready = Promise.all([fontsReady, windowLoaded, minDelay]);
    const safety = new Promise<void>((resolve) => setTimeout(resolve, SAFETY_TIMEOUT_MS));

    let cancelled = false;
    Promise.race([ready, safety]).then(() => {
      if (cancelled) return;
      tween?.kill();
      setProgress(100);
      window.setTimeout(() => setExiting(true), reducedMotion ? 0 : 220);
    });

    return () => {
      cancelled = true;
      tween?.kill();
      body.style.overflow = prevOverflow;
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (!exiting) return;
    document.body.style.overflow = "";
    if (!rootRef.current || reducedMotion) {
      setRemoved(true);
      return;
    }
    gsap.to(rootRef.current, {
      opacity: 0,
      scale: 1.03,
      duration: 0.7,
      ease: "power2.inOut",
      onComplete: () => setRemoved(true),
    });
  }, [exiting, reducedMotion]);

  if (removed) return null;

  return (
    <div
      ref={rootRef}
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-bg"
      style={{ pointerEvents: exiting ? "none" : "auto" }}
    >
      <span className="font-display text-6xl font-bold tracking-tight text-text sm:text-7xl">
        {siteConfig.initial}
      </span>
      <div className="flex w-48 flex-col items-center gap-3 sm:w-56">
        <div className="h-px w-full overflow-hidden bg-border">
          <div ref={barRef} className="h-full w-0 bg-text" />
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.35em] text-text-dim">
          <span ref={countRef}>00</span>
          <span>%</span>
        </div>
      </div>
    </div>
  );
}
