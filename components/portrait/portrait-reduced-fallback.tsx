import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { PortraitImage } from "@/components/portrait/portrait-image";
import { PortraitAnnotations } from "@/components/portrait/portrait-annotations";
import { AboutPanel } from "@/components/about/about-panel";
import { SkillsPanel } from "@/components/skills/skills-panel";
import { Reveal } from "@/components/ui/reveal";

/**
 * Non-pinned, non-parallax version of the portrait story for
 * prefers-reduced-motion. Same content, presented as plain stacked sections.
 */
export function PortraitReducedFallback({
  portraitSrc,
  portraitSize,
}: {
  portraitSrc: string;
  portraitSize: { width: number; height: number };
}) {
  return (
    <>
      <section id="home" className="relative flex min-h-[100svh] flex-col items-center justify-center gap-8 px-6 py-24">
        <span className="font-mono text-xs uppercase tracking-[0.4em] text-text-dim">{siteConfig.role}</span>
        <div className="relative flex w-full items-center justify-center">
          <div className="relative z-0">
            <PortraitImage src={portraitSrc} size={portraitSize} />
          </div>
          <h1
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10 flex select-none items-center justify-center text-center font-display font-bold leading-none tracking-tight text-text"
            style={{ fontSize: "clamp(4rem, 18vw, 14rem)" }}
          >
            RAYAN
          </h1>
          <div className="pointer-events-none absolute inset-0 z-20">
            <PortraitAnnotations />
          </div>
        </div>
        <p className="max-w-md text-balance text-center text-lg text-text-dim">{siteConfig.tagline}</p>
        <a
          href="#projects"
          className="group inline-flex items-center gap-2 rounded-full bg-text px-6 py-3 text-sm font-medium text-bg"
        >
          View My Work
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </a>
      </section>

      <section id="about" className="border-t border-border px-6 py-24">
        <Reveal className="mx-auto flex max-w-3xl justify-center">
          <AboutPanel />
        </Reveal>
      </section>

      <section id="skills" className="border-t border-border px-6 py-24">
        <Reveal className="mx-auto flex max-w-3xl justify-center">
          <SkillsPanel />
        </Reveal>
      </section>
    </>
  );
}
