"use client";

import { useEffect, useRef, type RefObject } from "react";
import { motion, useMotionValue, useSpring, useAnimationFrame } from "framer-motion";
import { usePointerRef } from "@/hooks/use-pointer";
import { useIsTouchDevice } from "@/hooks/use-media-query";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useCursorHover } from "@/hooks/use-cursor";

// Real green-screen keying: a pixel is background if it's meaningfully
// greener than it is red/blue ("excess green" = G - max(R,B)). Measured
// directly against the footage — the green screen sits at ~50-63 excess
// green (including in shadowed areas), while his navy suit is negative
// (blue-dominant) and his white shirt is ~1-5 — a wide, clean gap separates
// the two. Edges get a soft falloff instead of a hard cut, and any residual
// green tint on a partially-transparent edge pixel gets pulled back out
// (spill suppression) so hair/collar edges don't read with a green fringe.
const CANVAS_HEIGHT = 640;
const EXCESS_START = 15;
const EXCESS_FULL = 40;
const DESPILL_STRENGTH = 0.9;

function chromaKeyGreen(imageData: ImageData) {
  const { data } = imageData;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const maxRB = r > b ? r : b;
    const excess = g - maxRB;

    let alpha = 255;
    if (excess >= EXCESS_FULL) {
      alpha = 0;
    } else if (excess > EXCESS_START) {
      alpha = Math.round(255 * (1 - (excess - EXCESS_START) / (EXCESS_FULL - EXCESS_START)));
    }
    data[i + 3] = alpha;

    if (alpha > 0 && excess > 0) {
      data[i + 1] = Math.max(maxRB, g - excess * DESPILL_STRENGTH);
    }
  }
}

export function PortraitVideo({
  src,
  videoRef,
}: {
  src: string;
  videoRef: RefObject<HTMLVideoElement | null>;
}) {
  const isTouch = useIsTouchDevice();
  const reducedMotion = useReducedMotion();
  const pointer = usePointerRef();
  const exploreCursor = useCursorHover("explore");
  const enableTilt = !isTouch && !reducedMotion;

  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    function draw() {
      if (!video || !canvas) return;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx || video.videoWidth === 0) return;
      if (canvas.height !== CANVAS_HEIGHT) {
        canvas.height = CANVAS_HEIGHT;
        canvas.width = Math.round(CANVAS_HEIGHT * (video.videoWidth / video.videoHeight));
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
      chromaKeyGreen(frame);
      ctx.putImageData(frame, 0, 0);
    }

    let primed = false;
    function prime() {
      if (!video || primed) return;
      primed = true;
      video.currentTime = 0;
      // Some browsers won't decode a frame for drawImage until playback has
      // started at least once; play-then-immediately-pause unlocks seeking.
      video
        .play()
        .then(() => video.pause())
        .then(draw)
        .catch(() => {});
    }

    video.addEventListener("seeked", draw);
    video.addEventListener("loadeddata", prime);
    if (video.readyState >= 2) prime();
    // React dev-mode's double effect-invoke can mount/cleanup/remount this
    // effect synchronously, and `loadeddata` won't fire again for an
    // already-loaded video — re-check once more on the next tick in case the
    // synchronous readyState check above ran mid-transition.
    const fallback = window.setTimeout(() => {
      if (video.readyState >= 2) prime();
    }, 0);

    return () => {
      window.clearTimeout(fallback);
      video.removeEventListener("seeked", draw);
      video.removeEventListener("loadeddata", prime);
    };
  }, [videoRef]);

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
        <video
          ref={videoRef}
          src={src}
          muted
          playsInline
          preload="auto"
          aria-hidden
          className="absolute inset-0 h-full w-full object-contain opacity-0"
        />
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Rayan"
          className="relative h-[50vh] w-auto select-none object-contain drop-shadow-sm sm:h-[60vh] md:h-[72vh]"
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
