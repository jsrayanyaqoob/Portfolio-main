"use client";

import { useMemo, useRef } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePortraitTimeline, SCENES, type PortraitRefs } from "@/animations/portrait-timeline";
import { scrollToId, scrollToProgress } from "@/lib/lenis-instance";
import { PortraitVideo } from "@/components/portrait/portrait-video";
import { PortraitImage } from "@/components/portrait/portrait-image";
import { PortraitAnnotations } from "@/components/portrait/portrait-annotations";
import { AboutPanel } from "@/components/about/about-panel";
import { SkillsPanel } from "@/components/skills/skills-panel";
import { PortraitReducedFallback } from "@/components/portrait/portrait-reduced-fallback";
import { MagneticButton } from "@/components/ui/magnetic-button";

export function PortraitExperience({
  portraitSrc,
  portraitSize,
  videoSrc,
}: {
  portraitSrc: string;
  portraitSize: { width: number; height: number };
  videoSrc: string | null;
}) {
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const wrapperRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const rayanRef = useRef<HTMLHeadingElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const annotationsRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const aboutPanelRef = useRef<HTMLDivElement>(null);
  const skillsPanelRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const refs: PortraitRefs = useMemo(
    () => ({
      wrapper: wrapperRef,
      eyebrow: eyebrowRef,
      rayan: rayanRef,
      portrait: portraitRef,
      annotations: annotationsRef,
      tagline: taglineRef,
      scrollCue: scrollCueRef,
      aboutPanel: aboutPanelRef,
      skillsPanel: skillsPanelRef,
      video: videoRef,
    }),
    []
  );

  usePortraitTimeline(refs, !reducedMotion, isMobile);

  if (reducedMotion) {
    return <PortraitReducedFallback portraitSrc={portraitSrc} portraitSize={portraitSize} />;
  }

  return (
    <section
      id="home"
      ref={wrapperRef}
      className="relative"
      style={{ height: isMobile ? "340vh" : "440vh" }}
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* Eyebrow */}
        <div
          ref={eyebrowRef}
          className="absolute inset-x-0 top-[13%] z-20 flex justify-center sm:top-[15%]"
        >
          <span className="font-mono text-xs uppercase tracking-[0.4em] text-text-dim">
            {siteConfig.role}
          </span>
        </div>

        {/* Portrait, behind the giant RAYAN typography, on screen from the
            first paint — centered since it's a bust crop, not a full body. */}
        <div ref={portraitRef} className="absolute inset-0 z-0 flex items-center justify-center">
          {videoSrc ? (
            <PortraitVideo src={videoSrc} videoRef={videoRef} />
          ) : (
            <PortraitImage src={portraitSrc} size={portraitSize} />
          )}
        </div>

        {/* Giant RAYAN typography, in front of the portrait */}
        <h1
          ref={rayanRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 flex select-none items-center justify-center text-center font-display font-bold leading-none tracking-tight text-text"
          style={{ fontSize: "clamp(4.5rem, 17vw, 15rem)" }}
        >
          RAYAN
        </h1>

        {/* Hero tech annotations */}
        <div ref={annotationsRef} className="pointer-events-none absolute inset-0 z-20">
          <PortraitAnnotations />
        </div>

        {/* Tagline + CTAs */}
        <div
          ref={taglineRef}
          className="absolute inset-x-0 bottom-[16%] z-20 flex flex-col items-center gap-6 px-6 text-center sm:bottom-[13%]"
        >
          <p
            className="max-w-md text-balance text-base text-text-dim sm:text-lg"
            style={{ textShadow: "0 0 14px var(--color-bg), 0 0 14px var(--color-bg), 0 0 6px var(--color-bg)" }}
          >
            {siteConfig.tagline}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <MagneticButton
              onClick={() => scrollToId("projects")}
              className="group inline-flex items-center gap-2 rounded-full bg-text px-6 py-3 text-sm font-medium text-bg transition-colors hover:opacity-85"
            >
              View My Work
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </MagneticButton>
            <button
              onClick={() => scrollToProgress("home", SCENES.aboutStart + 0.02)}
              className="text-sm font-medium text-text-dim underline-offset-4 transition-colors hover:text-text hover:underline"
              style={{ textShadow: "0 0 14px var(--color-bg), 0 0 14px var(--color-bg), 0 0 6px var(--color-bg)" }}
            >
              About Me
            </button>
          </div>
        </div>

        {/* About scene — reveals on the right, beside him, while he holds
            the look-right turn as if reading it. */}
        <div
          ref={aboutPanelRef}
          className="absolute inset-0 z-20 flex items-center justify-center px-6 opacity-0 sm:justify-end sm:pr-[7%] md:pr-[10%]"
        >
          <AboutPanel />
        </div>

        {/* Skills scene — same spot, right after About; he's still holding
            that same look-right turn, reading this one next. */}
        <div
          ref={skillsPanelRef}
          className="absolute inset-0 z-20 flex items-center justify-center px-6 opacity-0 sm:justify-end sm:pr-[7%] md:pr-[10%]"
        >
          <SkillsPanel />
        </div>

        {/* Scroll cue */}
        <div
          ref={scrollCueRef}
          className="absolute inset-x-0 bottom-6 z-20 flex flex-col items-center gap-2 text-text-faint"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.35em]">Scroll to Explore</span>
          <ArrowDown size={13} className="animate-bounce" />
        </div>
      </div>
    </section>
  );
}
