"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { setLenisInstance } from "@/lib/lenis-instance";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({
      duration: 1.3,
      // Quintic ease-out — a longer, smoother tail than the previous cubic
      // curve, so scroll settles more gradually instead of stopping short.
      easing: (t) => 1 - Math.pow(1 - t, 5),
      smoothWheel: true,
      syncTouch: true,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;
    setLenisInstance(lenis);

    // Standard Lenis <-> GSAP ScrollTrigger sync: drive both from one RAF
    // loop and let ScrollTrigger recompute on every Lenis tick, so the
    // scrubbed portrait timeline tracks the smoothed scroll pixel-for-pixel.
    lenis.on("scroll", ScrollTrigger.update);

    function onTick(time: number) {
      lenis.raf(time * 1000);
    }
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      lenisRef.current = null;
      setLenisInstance(null);
    };
  }, [reducedMotion]);

  return <>{children}</>;
}
