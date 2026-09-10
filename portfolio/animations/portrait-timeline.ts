"use client";

import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useUIStore } from "@/lib/store";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// A staged walk-on choreography built from a single ~10s clip that already
// contains real walk-cycle footage (in place, fixed studio backdrop)
// bookending two arm-cross holds: one facing forward (toward the RAYAN
// wordmark), one turned back over the shoulder. That second hold is stretched
// across a long scroll span — he stays put, still turned back, while the
// About text and then the Skills text each reveal beside him on the right
// and read out in turn; only once both have shown does he uncross and walk
// off. Horizontal travel across the screen is simulated with slides + a
// subtle rotateY turn (the portrait container carries transformPerspective
// so this reads as a turn, not a flat skew), since the clip itself doesn't
// translate — but the leg motion inside each walk segment is real footage.
const BEAT = {
  enterEnd: 0.05, // walks in from off-screen right, arrives centered — video ~1.8s
  crossPeak: 0.09, // arms crossed, facing forward toward the name — video ~2.6s
  crossEnd: 0.18, // still held crossed through here — video ~4.2s
  walkEnd: 0.24, // uncrossed, walked a little further left — video ~5.8s
  lookBackPeak: 0.28, // re-crosses arms, turns to look back — video ~6.6s; About starts appearing
  turnStart: 0.8, // About + Skills have both been read; starts uncrossing — video ~7.9s
  turnEnd: 0.87, // uncrossed, turned to walk away — video ~8.4s
  exitEnd: 0.97, // walks off-screen left, fades out — video ~9.6s
};

// Scroll-progress breakpoints (0–1) shared with the navbar so "About" /
// "Skills" links can jump into the right moment of this same continuous
// scene. Both reveal beside him on the right while he stays put on the left,
// turned back "reading" them, one after the other — he only turns and walks
// off once both have been shown.
export const SCENES = {
  aboutStart: BEAT.lookBackPeak,
  aboutEnd: 0.46,
  skillsStart: 0.47,
  skillsEnd: BEAT.turnStart,
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

/** Smoothstep ease — used so each leg of the walk accelerates/decelerates
 * naturally instead of moving at a constant linear rate between anchors. */
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
  [BEAT.enterEnd, 1.8],
  [BEAT.crossPeak, 2.6],
  [BEAT.crossEnd, 4.2],
  [BEAT.walkEnd, 5.8],
  [BEAT.lookBackPeak, 6.6],
  [BEAT.turnStart, 7.9], // holds through the entire About + Skills read
  [BEAT.turnEnd, 8.4],
  [BEAT.exitEnd, 9.6],
  [1, 9.8],
];

// The clip itself frames him off-center within its own box, and — unlike the
// old footage — he's actually positioned differently between the two holds
// (measured by sampling the chroma-keyed canvas's opaque pixels): well
// right-of-center during the first cross, already left-of-center by the
// second. He should read as on the right for the first hold (his natural,
// unshifted framing already puts him there) and on the left for the second.
const CENTER_CROSS = 0; // right-of-center as filmed — no correction needed
const CENTER_HOLD = -12; // he's already mostly left-of-frame by the second hold
const PORTRAIT_X: [number, number][] = [
  [0, CENTER_CROSS + 130], // off-screen right
  [BEAT.enterEnd, CENTER_CROSS], // arrives, centered under the name
  [BEAT.crossEnd, CENTER_CROSS], // stays there through the "looking at name" hold
  [BEAT.walkEnd, CENTER_HOLD], // walks a little further left, still clearly on-screen
  [BEAT.turnEnd, CENTER_HOLD], // holds there through About, the gap, Skills, and the uncross
  [BEAT.exitEnd, CENTER_HOLD - 57], // then walks off-screen left
];

const PORTRAIT_ROTATE_Y: [number, number][] = [
  [0, -8], // walking in, angled
  [BEAT.enterEnd, 0],
  [BEAT.walkEnd, -6], // turning as he starts walking left
  [BEAT.lookBackPeak, -16],
  [BEAT.turnStart, -16], // holds the look-back turn through the whole read
  [BEAT.exitEnd, -26], // turned further away, walking off
];

const PORTRAIT_SCALE: [number, number][] = [
  [0, 0.92],
  [BEAT.enterEnd, 1],
  [BEAT.turnStart, 1],
  [BEAT.exitEnd, 0.86],
];

const PORTRAIT_OPACITY: [number, number][] = [
  [0, 0],
  [0.015, 1],
  [BEAT.exitEnd - 0.06, 1],
  [BEAT.exitEnd, 0],
];

const RAYAN_X: [number, number][] = [
  [BEAT.crossEnd, 0],
  [BEAT.walkEnd, 14], // drifts right as he starts walking left
];

const ANNOTATIONS_OPACITY: [number, number][] = [
  [0, 0],
  [BEAT.enterEnd, 0],
  [BEAT.crossPeak, 1], // up while he's facing the name
  [BEAT.crossEnd, 1],
  [BEAT.crossEnd + 0.04, 0],
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

        // --- Hero copy: visible through arrival, gone once the cross/turn starts.
        const heroOut = local(p, BEAT.enterEnd, BEAT.crossPeak);
        gsap.set(eyebrow, { opacity: 1 - heroOut, y: -heroOut * 20 });
        gsap.set(tagline, { opacity: 1 - heroOut, y: heroOut * 24 });
        gsap.set(scrollCue, { opacity: 1 - local(p, 0, 0.08) });

        // --- RAYAN typography: shrinks away as he starts walking left, clearing
        // the right side of the screen before the About text appears there.
        const rayanFade = clamp01(p / BEAT.walkEnd);
        const rayanScale = gsap.utils.interpolate(1, 0.55, rayanFade);
        const rayanY = gsap.utils.interpolate(0, -60, rayanFade);
        const rayanOpacity = 1 - local(p, BEAT.walkEnd, BEAT.lookBackPeak);
        gsap.set(rayan, {
          scale: rayanScale,
          y: rayanY,
          xPercent: anchored(p, RAYAN_X) * xScale,
          opacity: rayanOpacity,
        });

        // --- Portrait: walk-on / cross-and-look-at-name / walk / cross-and-look-back / walk-off.
        gsap.set(portrait, {
          xPercent: anchored(p, PORTRAIT_X) * xScale,
          rotateY: anchored(p, PORTRAIT_ROTATE_Y),
          transformPerspective: 1000,
          scale: anchored(p, PORTRAIT_SCALE),
          opacity: anchored(p, PORTRAIT_OPACITY),
        });

        // --- Annotations: up only while he's paused and "looking" at the name.
        gsap.set(annotations, { opacity: anchored(p, ANNOTATIONS_OPACITY) });

        // --- About panel: reveals on the right while he's turned back looking
        // at it from the left side of the screen — first of the two texts he
        // "reads" before walking off.
        const aboutIn = local(p, SCENES.aboutStart, SCENES.aboutStart + 0.05);
        const aboutOut = local(p, SCENES.aboutEnd - 0.04, SCENES.aboutEnd);
        gsap.set(aboutPanel, {
          opacity: aboutIn * (1 - aboutOut),
          y: gsap.utils.interpolate(16, 0, aboutIn),
          pointerEvents: aboutIn > 0.5 && aboutOut < 0.5 ? "auto" : "none",
        });

        // --- Skills panel: same right-side spot, right after About — he's
        // still standing in the same place, still turned back reading.
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
      // no easing lag chasing behind the scrollbar. Combined with the
      // all-keyframe video encode, the pose tracks scroll exactly instead of
      // catching up after you stop.
      scrub: true,
      onUpdate: (self) => applyProgress(self.progress),
    });

    // ScrollTrigger's onUpdate doesn't fire until the first scroll tick, so
    // without this the walk-on choreography's start state (off-screen,
    // invisible) never applies and he'd just appear centered on load.
    applyProgress(trigger.progress);

    return () => trigger.kill();
  }, [refs, enabled, isMobile]);
}
