"use client";

import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useMotionTemplate, useAnimationFrame } from "framer-motion";
import { usePointerRef } from "@/hooks/use-pointer";
import { useIsTouchDevice } from "@/hooks/use-media-query";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useCursorHover } from "@/hooks/use-cursor";
import { siteConfig } from "@/config/site";

// Radius of the revealed circle, in viewport-height units so it scales with
// the portrait itself (which is sized in vh) instead of growing/shrinking
// with cursor position the way a percentage-based radial-gradient would.
const REVEAL_RADIUS_VH = 16;

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
  const springConfig = reducedMotion ? { stiffness: 1000, damping: 100 } : { stiffness: 220, damping: 26, mass: 0.4 };
  const springX = useSpring(revealX, springConfig);
  const springY = useSpring(revealY, springConfig);
  const revealOpacity = useMotionValue(0);
  const springOpacity = useSpring(revealOpacity, { stiffness: 260, damping: 30 });

  const maskImage = useMotionTemplate`radial-gradient(circle ${REVEAL_RADIUS_VH}vh at ${springX}% ${springY}%, black 0, black ${REVEAL_RADIUS_VH - 4}vh, transparent ${REVEAL_RADIUS_VH}vh)`;

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!enableReveal) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) return;
    revealX.set(((e.clientX - rect.left) / rect.width) * 100);
    revealY.set(((e.clientY - rect.top) / rect.height) * 100);
  }

  function handlePointerEnter() {
    if (enableReveal) revealOpacity.set(1);
  }

  function handlePointerLeave() {
    revealOpacity.set(0);
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
              style={{ opacity: springOpacity, maskImage, WebkitMaskImage: maskImage }}
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

            {/* Soft glow ring tracing the edge of the reveal circle. */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute rounded-full border border-text/70"
              style={{
                left: useMotionTemplate`${springX}%`,
                top: useMotionTemplate`${springY}%`,
                width: `${REVEAL_RADIUS_VH * 2}vh`,
                height: `${REVEAL_RADIUS_VH * 2}vh`,
                translateX: "-50%",
                translateY: "-50%",
                opacity: springOpacity,
                boxShadow: "0 0 24px 4px rgba(255,255,255,0.35)",
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
