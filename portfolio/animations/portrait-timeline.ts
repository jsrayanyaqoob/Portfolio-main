"use client";

import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useUIStore } from "@/lib/store";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// He's on screen from the very first paint — no walk-on, no off-screen start.
// Scroll instead drives which way he's looking, scrubbing through a single
// ~10s clip of head-turns: neutral -> looks left (giggles) -> looks right
// (About, then Skills, reveal beside him once his eyes actually land there,
// while he holds that turn) -> back to center -> looks down -> fades out as
// the hero section ends. RAYAN slides left as soon as he starts, then fades
// away entirely right after the giggle — it doesn't linger for the rest of
// the scene.
const BEAT = {
  rayanShiftEnd: 0.06, // RAYAN has slid left — video ~1.5s, still neutral
  lookLeftPeak: 0.14, // looks left — video ~3.0s
  giggleEnd: 0.2, // the giggle/smile settles — video ~4.25s
  rayanGone: 0.26, // RAYAN has fully faded out — video ~4.6s, he's blinking/neutral
  // Fully turned AND settled looking right — not mid-turn. The About/Skills
  // reveal is pinned to this same point, so it only appears once his eyes
  // have actually landed on that side, not while he's still turning.
  lookRightPeak: 0.34, // video ~6.0s
  aboutOutSkillsIn: 0.52, // About fades out, Skills fades in
  lookRightHoldEnd: 0.66, // still holding the look right — video ~6.5s, last clean frame
  backToCenter: 0.72, // turns back to center — video ~8.0s
  lookDownStart: 0.81, // starts looking down — video ~8.5s
  lookDownEnd: 0.92, // looking down — video ~9.7s
  fadeOutEnd: 1, // fully faded, hero section done
};

// Scroll-progress breakpoints (0–1) shared with the navbar so "About" /
// "Skills" links can jump into the right moment of this same continuous
// scene. Both reveal beside him on the right while he holds the look-right
// turn, one after the other.
export const SCENES = {
  aboutStart: BEAT.lookRightPeak,
  aboutEnd: BEAT.aboutOutSkillsIn,
  skillsStart: 0.54,
  skillsEnd: BEAT.lookRightHoldEnd,
};

export interface PortraitRefs {
  wrapper: RefObject<HTMLElement | null>;
  eyebrow: RefObject<HTMLElement | null>;
  rayan: RefObject<HTMLElement | null>;
  portrait: RefObject<HTMLElement | null>;
  annotations: RefObject<HTMLElement | null>;
  tagline: RefObject<HTMLElement | null>;
  scrollCue: RefObject<HTMLElement | null>;
  aboutPanel: RefObject<HTMLElement | null>;
  skillsPanel: RefObject<HTMLElement | null>;
  video: RefObject<HTMLVideoElement | null>;
}

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

/** Maps progress into a 0–1 value local to [start, end], clamped. */
function local(progress: number, start: number, end: number) {
  return clamp01((progress - start) / (end - start));
}

function seekVideo(el: HTMLVideoElement, time: number) {
  if (Math.abs(el.currentTime - time) > 0.008) {
    el.currentTime = time;
  }
}

/** Smoothstep ease — each beat settles in and out naturally instead of
 * moving at a constant linear rate between anchors. */
function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

/** Piecewise ease-in-out interpolation through a sorted list of [progress, value] anchors. */
function anchored(p: number, anchors: [number, number][]) {
  if (p <= anchors[0][0]) return anchors[0][1];
  for (let i = 0; i < anchors.length - 1; i++) {
    const [p0, v0] = anchors[i];
    const [p1, v1] = anchors[i + 1];
    if (p <= p1) return gsap.utils.interpolate(v0, v1, smoothstep(local(p, p0, p1)));
  }
  return anchors[anchors.length - 1][1];
}

// --- Choreography anchor tables -------------------------------------------

const VIDEO_TIME: [number, number][] = [
  [0, 0],
  [BEAT.rayanShiftEnd, 1.5],
  [BEAT.lookLeftPeak, 3.0],
  [BEAT.giggleEnd, 4.25],
  [BEAT.rayanGone, 4.6], // brief neutral moment (he blinks around here) as RAYAN finishes fading
  // He's not actually turned right until ~6.0s (confirmed by re-checking the
  // actual footage frame-by-frame — 5.0-5.75 is still neutral/blinking, not
  // a turn). Holds through the About + Skills read, capped at 6.5 rather
  // than the full ~7.25s he's turned — edge quality measured via the keyed
  // canvas's own alpha channel degrades sharply from 6.6s on (a real halo,
  // confirmed visually, not just noise) as he starts turning back.
  [BEAT.lookRightPeak, 6.0],
  [BEAT.lookRightHoldEnd, 6.5],
  [BEAT.backToCenter, 8.0],
  [BEAT.lookDownStart, 8.5],
  // The last clean frame — past 9.7s the keyed edge degrades sharply again
  // (likely the clip's own tail-end compression), so this holds here rather
  // than scrubbing into it. Doesn't cost anything visually since portrait
  // opacity is already fading to 0 by fadeOutEnd anyway.
  [BEAT.lookDownEnd, 9.7],
  [1, 9.7],
];

// xPercent shifts the h1 by a percentage of its OWN box, which spans the
// full sticky container (~1270px on a 1280px viewport) — not just the
// glyphs, which only run ~635px wide, centered inside it. -32% of the full
// box shifted the actual text partway off-screen on the left (measured: its
// left edge landed at -90px). -20% keeps a comfortable margin even accounting
// for the clamp()'d font size being relatively wider on narrower viewports.
const RAYAN_X: [number, number][] = [
  [0, 0], // centered, overlapping him, on first paint
  [BEAT.rayanShiftEnd, -20], // slides left to clear his face, fully on-screen
  [BEAT.fadeOutEnd, -20],
];

// RAYAN stays through the look-left + giggle beat, then fades away entirely
// right after — it doesn't linger off to the side for the rest of the scene.
const RAYAN_OPACITY: [number, number][] = [
  [0, 1],
  [BEAT.giggleEnd, 1],
  [BEAT.rayanGone, 0],
  [BEAT.fadeOutEnd, 0],
];

// He holds his ground the whole scene — no walking — but gets a couple of
// small nudges so he doesn't collide with text moving around him: right
// while RAYAN is off to the left during the look-left/giggle beat, and left
// while turned right so the About/Skills panels (right-aligned) clear him.
const PORTRAIT_X: [number, number][] = [
  [0, 0],
  [BEAT.rayanShiftEnd, 0],
  [BEAT.lookLeftPeak, 14],
  [BEAT.giggleEnd, 14],
  [BEAT.rayanGone, 0], // settles back to center as he turns to look right
  [BEAT.lookRightPeak, -18],
  [BEAT.lookRightHoldEnd, -18],
  [BEAT.backToCenter, 0],
  [BEAT.fadeOutEnd, 0],
];

const PORTRAIT_OPACITY: [number, number][] = [
  [0, 1], // visible immediately, no scroll required
  [BEAT.lookDownEnd, 1],
  [BEAT.fadeOutEnd, 0], // fades out once the hero section is done
];

const PORTRAIT_SCALE: [number, number][] = [
  [0, 1],
  [BEAT.lookDownEnd, 1.03], // the faintest creep-in over the whole scene
  [BEAT.fadeOutEnd, 1.05],
];

const ANNOTATIONS_OPACITY: [number, number][] = [
  [0, 0],
  [BEAT.rayanShiftEnd, 0],
  [BEAT.lookLeftPeak, 1], // up while he's turned, looking (and giggling)
  [BEAT.giggleEnd, 1],
  [BEAT.giggleEnd + 0.04, 0],
];

export function usePortraitTimeline(refs: PortraitRefs, enabled: boolean, isMobile: boolean) {
  useLayoutEffect(() => {
    if (!enabled) return;

    const wrapper = refs.wrapper.current;
    const eyebrow = refs.eyebrow.current;
    const rayan = refs.rayan.current;
    const portrait = refs.portrait.current;
    const annotations = refs.annotations.current;
    const tagline = refs.tagline.current;
    const scrollCue = refs.scrollCue.current;
    const aboutPanel = refs.aboutPanel.current;
    const skillsPanel = refs.skillsPanel.current;
    const video = refs.video.current;

    if (!wrapper || !eyebrow || !rayan || !portrait || !annotations || !tagline || !scrollCue || !aboutPanel || !skillsPanel) {
      return;
    }

    const xScale = isMobile ? 0.6 : 1;
    let lastSection = "home";

    function applyProgress(p: number) {
        const nextSection = p < SCENES.aboutStart ? "home" : p < SCENES.skillsStart ? "about" : "skills";
        if (nextSection !== lastSection) {
          lastSection = nextSection;
          useUIStore.getState().setActiveSection(nextSection);
        }

        // --- Hero copy: visible at rest, gone as soon as RAYAN starts moving.
        const heroOut = local(p, 0, BEAT.rayanShiftEnd);
        gsap.set(eyebrow, { opacity: 1 - heroOut, y: -heroOut * 20 });
        gsap.set(tagline, { opacity: 1 - heroOut, y: heroOut * 24 });
        gsap.set(scrollCue, { opacity: 1 - local(p, 0, 0.08) });

        // --- RAYAN typography: slides left early, then fades away entirely
        // once he's done looking left and giggling.
        gsap.set(rayan, {
          xPercent: anchored(p, RAYAN_X) * xScale,
          opacity: anchored(p, RAYAN_OPACITY),
        });

        // --- Portrait: always visible, mostly holds position — just a
        // small nudge left while turned right so the panels clear him — and
        // scrubs through the head-turn clip, fading out once the scene ends.
        gsap.set(portrait, {
          xPercent: anchored(p, PORTRAIT_X) * xScale,
          scale: anchored(p, PORTRAIT_SCALE),
          opacity: anchored(p, PORTRAIT_OPACITY),
        });

        // --- Annotations: up while he's looking left and giggling.
        gsap.set(annotations, { opacity: anchored(p, ANNOTATIONS_OPACITY) });

        // --- About panel: reveals on the right while he's turned, looking at it.
        const aboutIn = local(p, SCENES.aboutStart, SCENES.aboutStart + 0.05);
        const aboutOut = local(p, SCENES.aboutEnd - 0.04, SCENES.aboutEnd);
        gsap.set(aboutPanel, {
          opacity: aboutIn * (1 - aboutOut),
          y: gsap.utils.interpolate(16, 0, aboutIn),
          pointerEvents: aboutIn > 0.5 && aboutOut < 0.5 ? "auto" : "none",
        });

        // --- Skills panel: same spot, right after About, same held turn.
        const skillsIn = local(p, SCENES.skillsStart, SCENES.skillsStart + 0.04);
        const skillsOut = local(p, SCENES.skillsEnd - 0.05, SCENES.skillsEnd);
        gsap.set(skillsPanel, {
          opacity: skillsIn * (1 - skillsOut),
          y: gsap.utils.interpolate(16, 0, skillsIn),
          pointerEvents: skillsIn > 0.5 && skillsOut < 0.5 ? "auto" : "none",
        });

        // --- Scrub the clip itself through the same choreography.
        if (video && video.duration) {
          seekVideo(video, anchored(p, VIDEO_TIME));
        }
    }

    const trigger = ScrollTrigger.create({
      trigger: wrapper,
      start: "top top",
      end: "bottom bottom",
      // scrub: true (not a duration) ties progress 1:1 to scroll position —
      // no easing lag chasing behind the scrollbar.
      scrub: true,
      onUpdate: (self) => applyProgress(self.progress),
    });

    // ScrollTrigger's onUpdate doesn't fire until the first scroll tick, so
    // without this he wouldn't render in his correct at-rest state on load.
    applyProgress(trigger.progress);

    return () => trigger.kill();
  }, [refs, enabled, isMobile]);
}
