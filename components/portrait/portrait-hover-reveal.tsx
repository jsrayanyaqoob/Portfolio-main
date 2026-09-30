"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useAnimationFrame,
} from "framer-motion";
import { usePointerRef } from "@/hooks/use-pointer";
import { useIsTouchDevice } from "@/hooks/use-media-query";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useCursorHover } from "@/hooks/use-cursor";
import { siteConfig } from "@/config/site";

// Radius of the fully-open reveal circle, in viewport-height units so it
// scales with the portrait itself (which is sized in vh) instead of
// growing/shrinking with cursor position the way a percentage-based
// radial-gradient would.
const REVEAL_RADIUS_VH = 18;
const FEATHER_VH = 5;
const SCANNER_PAD_VH = 3;

export function PortraitHoverReveal({
  src,
  hoverSrc,
  size,
}: {
  src: string;
  hoverSrc: string;
  size: { width: number; height: number };
}) {
  const isTouch = useIsTouchDevice();
  const reducedMotion = useReducedMotion();
  const pointer = usePointerRef();
  const exploreCursor = useCursorHover("explore");
  const enableTilt = !isTouch && !reducedMotion;
  const enableReveal = !isTouch;

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 60, damping: 15, mass: 0.6 });
  const springRotateY = useSpring(rotateY, { stiffness: 60, damping: 15, mass: 0.6 });

  useAnimationFrame(() => {
    if (!enableTilt) return;
    const p = pointer.current;
    rotateY.set(p.x * 5);
    rotateX.set(-p.y * 3);
  });

  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const revealX = useMotionValue(50);
  const revealY = useMotionValue(50);
  // Snappier than the tilt spring — this is meant to feel like it's tracking
  // the cursor closely, just smoothed enough to not look like a hard cutout.
  const trackingSpring = reducedMotion ? { stiffness: 1000, damping: 100 } : { stiffness: 260, damping: 24, mass: 0.35 };
  const springX = useSpring(revealX, trackingSpring);
  const springY = useSpring(revealY, trackingSpring);

  // The reveal opens/closes like an iris rather than just fading in place —
  // radius springs from 0 to full on enter. A slightly underdamped spring
  // gives it a bit of overshoot ("pop") on open instead of easing in flatly.
  const radius = useMotionValue(0);
  const radiusSpring = reducedMotion ? { stiffness: 1000, damping: 100 } : { stiffness: 170, damping: 15, mass: 0.6 };
  const springRadius = useSpring(radius, radiusSpring);
  const springInnerRadius = useTransform(springRadius, (r) => Math.max(r - FEATHER_VH, 0));
  const ringDiameter = useTransform(springRadius, (r) => r * 2);
  const scannerDiameter = useTransform(ringDiameter, (d) => d + SCANNER_PAD_VH * 2);

  const maskImage = useMotionTemplate`radial-gradient(circle ${springRadius}vh at ${springX}% ${springY}%, black 0, black ${springInnerRadius}vh, transparent ${springRadius}vh)`;
  const ringOpacity = useTransform(springRadius, [0, 4], [0, 1]);

  // Pre-templated (hooks must run unconditionally, before any early return
  // or conditional JSX) so the conditionally-rendered scanner ring below can
  // just reference these instead of calling hooks inline.
  const ringLeft = useMotionTemplate`${springX}%`;
  const ringTop = useMotionTemplate`${springY}%`;
  const ringDiameterVh = useMotionTemplate`${ringDiameter}vh`;
  const scannerDiameterVh = useMotionTemplate`${scannerDiameter}vh`;

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!enableReveal) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) return;
    revealX.set(((e.clientX - rect.left) / rect.width) * 100);
    revealY.set(((e.clientY - rect.top) / rect.height) * 100);
  }

  function handlePointerEnter() {
    if (!enableReveal) return;
    radius.set(REVEAL_RADIUS_VH);
    setIsHovering(true);
  }

  function handlePointerLeave() {
    radius.set(0);
    setIsHovering(false);
  }

  return (
    <div style={{ perspective: 1400 }}>
      <motion.div
        {...exploreCursor}
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        style={{ rotateX: springRotateX, rotateY: springRotateY, transformStyle: "preserve-3d" }}
        className="relative"
      >
        <div
          aria-hidden
          className="absolute inset-x-[10%] bottom-[1%] h-[8%] rounded-[50%] bg-text/10 blur-2xl"
        />
        <Image
          src={src}
          alt={`${siteConfig.name} — ${siteConfig.role}`}
          width={size.width}
          height={size.height}
          priority
          sizes="(max-width: 640px) 70vw, (max-width: 768px) 50vw, 40vw"
          className="relative h-[68vh] w-auto select-none object-contain drop-shadow-sm sm:h-[85vh] md:h-[100svh]"
          draggable={false}
        />

        {enableReveal && (
          <>
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 overflow-hidden"
              style={{ maskImage, WebkitMaskImage: maskImage }}
            >
              {/* Slightly zoomed for a "lens" feel — revealing more than a
                  flat 1:1 crop would, so it reads as looking *through* the
                  cutout rather than just an image swap. */}
              <motion.div
                className="absolute inset-0"
                animate={isHovering ? { scale: 1.14 } : { scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <Image
                  src={hoverSrc}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 70vw, (max-width: 768px) 50vw, 40vw"
                  className="object-contain"
                  draggable={false}
                />
              </motion.div>
            </motion.div>

            {/* Soft glow ring tracing the edge of the reveal circle. */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute rounded-full border border-text/70"
              style={{
                left: ringLeft,
                top: ringTop,
                width: ringDiameterVh,
                height: ringDiameterVh,
                translateX: "-50%",
                translateY: "-50%",
                opacity: ringOpacity,
                boxShadow: "0 0 30px 6px rgba(255,255,255,0.4)",
              }}
            />

            {/* Rotating "scanner" ring — a conic gradient masked down to a
                thin band, spinning continuously while hovered, for the extra
                bit of energy around the reveal edge. */}
            {isHovering && (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute rounded-full"
                style={{
                  left: ringLeft,
                  top: ringTop,
                  width: scannerDiameterVh,
                  height: scannerDiameterVh,
                  translateX: "-50%",
                  translateY: "-50%",
                  opacity: ringOpacity,
                  background:
                    "conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.9) 12%, transparent 26%, transparent 50%, rgba(255,255,255,0.9) 62%, transparent 76%, transparent 100%)",
                  WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 3px), black calc(100% - 3px))",
                  mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), black calc(100% - 3px))",
                }}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2.4, ease: "linear" }}
              />
            )}
          </>
        )}

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay"
          style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.4), transparent 45%)" }}
        />
      </motion.div>
    </div>
  );
}
