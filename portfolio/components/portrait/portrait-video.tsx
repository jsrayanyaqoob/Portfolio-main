"use client";

import { useEffect, useRef, type RefObject } from "react";
import { motion, useMotionValue, useSpring, useAnimationFrame } from "framer-motion";
import { usePointerRef } from "@/hooks/use-pointer";
import { useIsTouchDevice } from "@/hooks/use-media-query";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useCursorHover } from "@/hooks/use-cursor";

const CANVAS_HEIGHT = 640;
// This footage is shot on a plain black backdrop. His suit is navy, dark
// enough on its shadowed side to land in the same luma range as the actual
// backdrop. A per-pixel color check (comparing R/G/B to catch the suit's
// faint blue cast vs. neutral black) seemed like the right discriminator,
// but H.264's 4:2:0 chroma subsampling stores color at a quarter the
// resolution of luma and re-derives it on decode — for pixels this close to
// black, the real R/G/B gaps are only a few units wide, well inside that
// subsampling's noise floor, so the color check flickered pixel-to-pixel
// and punched a speckled hole through the shadow instead of a clean one.
// Luma carries no such penalty (full resolution, no subsampling), so this
// keys on luma alone and instead relies on flood-filling inward from the
// canvas border to find the actual background: real background is one
// large region connected to every edge, while the suit's shadow — even
// where it's just as dark — is fully enclosed by lighter shirt/skin/hair
// and never reachable from the border. A stricter "strong" threshold (well
// under the suit's darkest measured pixels) drives the flood so it can't
// bridge across a soft anti-aliased edge into the subject; a wider "soft"
// ceiling only feathers pixels already reached, for a clean but anti-
// aliased cutout.
const STRONG_THRESHOLD = 16;
const SOFT_CEILING = 42;

function computeLuma(data: Uint8ClampedArray, n: number) {
  const luma = new Float32Array(n);
  for (let p = 0, i = 0; p < n; p++, i += 4) {
    luma[p] = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
  }
  return luma;
}

// A closure-based `tryPush` re-created per call, plus recovering (x, y) from
// a flat index via `%`/`/` on every pop, measured ~10x slower than this
// version — keeping x/y on their own stacks (no div/mod) and inlining the
// push check (no per-call closure) brought a 360x640 frame from ~80-100ms
// down to single-digit milliseconds.
function floodFillFromBorder(luma: Float32Array, width: number, height: number) {
  const n = width * height;
  const strong = new Uint8Array(n);
  for (let p = 0; p < n; p++) strong[p] = luma[p] < STRONG_THRESHOLD ? 1 : 0;

  const visited = new Uint8Array(n);
  const stackX = new Int32Array(n);
  const stackY = new Int32Array(n);
  let sp = 0;

  for (let x = 0; x < width; x++) {
    let p = x;
    if (strong[p] && !visited[p]) {
      visited[p] = 1;
      stackX[sp] = x;
      stackY[sp] = 0;
      sp++;
    }
    p = (height - 1) * width + x;
    if (strong[p] && !visited[p]) {
      visited[p] = 1;
      stackX[sp] = x;
      stackY[sp] = height - 1;
      sp++;
    }
  }
  for (let y = 0; y < height; y++) {
    let p = y * width;
    if (strong[p] && !visited[p]) {
      visited[p] = 1;
      stackX[sp] = 0;
      stackY[sp] = y;
      sp++;
    }
    p = y * width + width - 1;
    if (strong[p] && !visited[p]) {
      visited[p] = 1;
      stackX[sp] = width - 1;
      stackY[sp] = y;
      sp++;
    }
  }

  while (sp > 0) {
    sp--;
    const x = stackX[sp];
    const y = stackY[sp];
    const p = y * width + x;
    if (x > 0) {
      const q = p - 1;
      if (strong[q] && !visited[q]) {
        visited[q] = 1;
        stackX[sp] = x - 1;
        stackY[sp] = y;
        sp++;
      }
    }
    if (x < width - 1) {
      const q = p + 1;
      if (strong[q] && !visited[q]) {
        visited[q] = 1;
        stackX[sp] = x + 1;
        stackY[sp] = y;
        sp++;
      }
    }
    if (y > 0) {
      const q = p - width;
      if (strong[q] && !visited[q]) {
        visited[q] = 1;
        stackX[sp] = x;
        stackY[sp] = y - 1;
        sp++;
      }
    }
    if (y < height - 1) {
      const q = p + width;
      if (strong[q] && !visited[q]) {
        visited[q] = 1;
        stackX[sp] = x;
        stackY[sp] = y + 1;
        sp++;
      }
    }
  }
  return visited;
}

function chromaKeyBlack(imageData: ImageData) {
  const { data, width, height } = imageData;
  const n = width * height;
  const luma = computeLuma(data, n);
  const background = floodFillFromBorder(luma, width, height);

  const range = SOFT_CEILING - STRONG_THRESHOLD;
  for (let p = 0, i = 0; p < n; p++, i += 4) {
    if (!background[p]) continue;
    const l = luma[p];
    data[i + 3] = l <= STRONG_THRESHOLD ? 0 : Math.round(255 * Math.min(1, (l - STRONG_THRESHOLD) / range));
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

    let targetWidth = 0;
    let targetHeight = 0;
    function ensureSize() {
      if (!video) return false;
      if (video.videoWidth === 0) return false;
      if (targetHeight === CANVAS_HEIGHT) return true;
      targetHeight = CANVAS_HEIGHT;
      targetWidth = Math.round(CANVAS_HEIGHT * (video.videoWidth / video.videoHeight));
      return true;
    }

    let rafId = 0;

    // The keying pass is cheap now (a single luma+saturation pass plus a
    // small separable morphological close — single-digit milliseconds at
    // this canvas size, versus the ~100-200ms the old per-pixel IDW
    // reference model cost), so there's no need to move it off the main
    // thread to keep scroll-linked GSAP updates smooth.
    async function draw() {
      if (!video || !canvas || !ensureSize()) return;
      const c2d = canvas.getContext("2d", { willReadFrequently: true });
      if (!c2d) return;
      if (canvas.height !== targetHeight) {
        canvas.height = targetHeight;
        canvas.width = targetWidth;
      }
      // `ctx.drawImage(video, 0, 0, w, h)` downscaling a video frame
      // directly aliases the codec's own block noise into visible
      // checkerboard patches once thresholded — invisible on the raw frame,
      // but each ~8px block lands unevenly on one side of the keying
      // threshold after a naive resize. createImageBitmap's resize doesn't
      // have that problem, so it does the downscale and drawImage only
      // ever draws already-correctly-sized pixels.
      let bitmap: ImageBitmap;
      try {
        bitmap = await createImageBitmap(video, {
          resizeWidth: targetWidth,
          resizeHeight: targetHeight,
          resizeQuality: "low",
        });
      } catch {
        return;
      }
      c2d.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close();
      const frame = c2d.getImageData(0, 0, canvas.width, canvas.height);
      chromaKeyBlack(frame);
      c2d.putImageData(frame, 0, 0);
    }

    function scheduleDraw() {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        void draw();
      });
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

    video.addEventListener("seeked", scheduleDraw);
    video.addEventListener("loadeddata", prime);
    if (video.readyState >= 2) prime();
    // React dev-mode's double effect-invoke can mount/cleanup/remount this
    // effect synchronously, and `loadeddata` won't fire again for an
    // already-loaded video — re-check once more on the next tick in case the
    // synchronous readyState check above ran mid-transition.
    const fallbackTimer = window.setTimeout(() => {
      if (video.readyState >= 2) prime();
    }, 0);

    return () => {
      window.clearTimeout(fallbackTimer);
      if (rafId) cancelAnimationFrame(rafId);
      video.removeEventListener("seeked", scheduleDraw);
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
          className="relative h-[68vh] w-auto select-none object-contain drop-shadow-sm sm:h-[85vh] md:h-[100svh]"
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
