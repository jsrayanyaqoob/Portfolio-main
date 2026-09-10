"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useAnimationFrame } from "framer-motion";
import { usePointerRef } from "@/hooks/use-pointer";
import { useIsTouchDevice } from "@/hooks/use-media-query";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useCursorHover } from "@/hooks/use-cursor";
import { siteConfig } from "@/config/site";

export function PortraitImage({
  src,
  size,
}: {
  src: string;
  size: { width: number; height: number };
}) {
  const isTouch = useIsTouchDevice();
  const reducedMotion = useReducedMotion();
  const pointer = usePointerRef();
  const exploreCursor = useCursorHover("explore");
  const enableTilt = !isTouch && !reducedMotion;

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

  return (
    <div style={{ perspective: 1400 }}>
      <motion.div
        {...exploreCursor}
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
          className="relative h-[46vh] w-auto select-none object-contain drop-shadow-sm sm:h-[56vh] md:h-[68vh]"
          draggable={false}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay"
          style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.4), transparent 45%)" }}
        />
      </motion.div>
    </div>
  );
}
