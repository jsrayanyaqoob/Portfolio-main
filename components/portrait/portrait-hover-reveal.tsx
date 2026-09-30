"use client";

import { useRef, type PointerEvent as ReactPointerEvent } from "react";
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

// The reveal is a wipe, not a spotlight: a circle grows from wherever the
// cursor enters until it's far larger than the portrait itself, so the
// second photo ends up covering the whole image rather than just a patch
// around the cursor. 150vh comfortably exceeds the diagonal of the
// portrait box at any breakpoint (it tops out around 100svh tall), so the
// circle is always fully past every edge by the time it finishes growing.
const EXPANDED_RADIUS_VH = 150;
const FEATHER_VH = 14;

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

  const containerRef = useRef<HTMLDivElement>(null);
  const revealX = useMotionValue(50);
  const revealY = useMotionValue(50);
  // Snappier than the tilt spring — this is meant to feel like it's tracking
  // the cursor closely, just smoothed enough to not look like a hard cutout.
  const trackingSpring = reducedMotion ? { stiffness: 1000, damping: 100 } : { stiffness: 260, damping: 24, mass: 0.35 };
  const springX = useSpring(revealX, trackingSpring);
  const springY = useSpring(revealY, trackingSpring);

  // The wipe grows from 0 to EXPANDED_RADIUS_VH on enter and back to 0 on
  // leave. Heavier/slower than the old spotlight's spring on purpose — this
  // distance is huge (0 to 150vh), so a snappy spring would cross it almost
  // instantly and read as a hard cut instead of a sweep. This settles in
  // ~0.5-0.6s, slow enough to actually see the front move across the image.
  const radius = useMotionValue(0);
  const radiusSpring = reducedMotion ? { stiffness: 1000, damping: 100 } : { stiffness: 55, damping: 16, mass: 1 };
  const springRadius = useSpring(radius, radiusSpring);
  const springInnerRadius = useTransform(springRadius, (r) => Math.max(r - FEATHER_VH, 0));
  const ringDiameter = useTransform(springRadius, (r) => r * 2);

  const maskImage = useMotionTemplate`radial-gradient(circle ${springRadius}vh at ${springX}% ${springY}%, black 0, black ${springInnerRadius}vh, transparent ${springRadius}vh)`;
  // Fades in fast at the very start of the grow so the wipe's leading edge
  // (the ring below) is visible from the first frame, not just once it's
  // partway open.
  const ringOpacity = useTransform(springRadius, [0, 8, EXPANDED_RADIUS_VH * 0.4, EXPANDED_RADIUS_VH * 0.7], [0, 1, 1, 0]);

  const ringLeft = useMotionTemplate`${springX}%`;
  const ringTop = useMotionTemplate`${springY}%`;
  const ringDiameterVh = useMotionTemplate`${ringDiameter}vh`;

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!enableReveal) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) return;
    revealX.set(((e.clientX - rect.left) / rect.width) * 100);
    revealY.set(((e.clientY - rect.top) / rect.height) * 100);
  }

  function handlePointerEnter() {
    if (!enableReveal) return;
    radius.set(EXPANDED_RADIUS_VH);
  }

  function handlePointerLeave() {
    radius.set(0);
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
              className="pointer-events-none absolute inset-0"
              style={{ maskImage, WebkitMaskImage: maskImage }}
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

            {/* The wipe's leading edge — a glow ring riding the growing
                circle's boundary, visible while it crosses the image and
                fading out once it's grown past the point of mattering. */}
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
