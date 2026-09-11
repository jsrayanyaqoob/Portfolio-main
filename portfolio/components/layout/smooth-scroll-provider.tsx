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

    // Longer duration + a slower-settling curve (tried right before this)
    // made scroll feel smoother in isolation but heavier and slower to
    // respond overall — that's the wrong trade. Shorter duration and an
    // ease-out that gets most of the way there quickly (then tapers, so it
    // still doesn't feel abrupt) keeps it responsive without going back to
    // feeling raw/unsmoothed.
    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => 1 - Math.pow(1 - t, 2),
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
