"use client";

import { Mail } from "lucide-react";
import type { ComponentType } from "react";
import { siteConfig } from "@/config/site";
import { socials } from "@/data/socials";
import { GithubIcon, LinkedinIcon, InstagramIcon, YoutubeIcon } from "@/components/ui/brand-icons";
import { scrollToId, scrollToProgress } from "@/lib/lenis-instance";
import { SCENES } from "@/animations/portrait-timeline";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const ICONS: Record<string, ComponentType<{ size?: number }>> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
  mail: Mail,
};

const LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About", progress: SCENES.aboutStart + 0.02 },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills", progress: SCENES.skillsStart + 0.02 },
  { id: "contact", label: "Contact" },
];

export function Footer() {
  const active = socials.filter((s) => s.url);
  const reducedMotion = useReducedMotion();

  function goTo(link: (typeof LINKS)[number]) {
    if (!reducedMotion && link.progress !== undefined) {
      scrollToProgress("home", link.progress);
    } else {
      scrollToId(link.id);
    }
  }

  return (
    <footer className="border-t border-border bg-bg py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-6 sm:px-10">
        <div className="flex flex-col items-center gap-1">
          <p className="font-display text-lg font-semibold tracking-wide text-text">{siteConfig.name}</p>
          <p className="font-mono text-xs uppercase tracking-widest text-text-faint">{siteConfig.role}</p>
        </div>

        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => {
                e.preventDefault();
                goTo(link);
              }}
              className="font-mono text-[11px] uppercase tracking-widest text-text-dim transition-colors hover:text-text"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href={`mailto:${siteConfig.email}`}
            aria-label="Email"
            className="text-text-dim transition-colors hover:text-text"
          >
            <Mail size={16} />
          </a>
          {active.map((s) => {
            const Icon = ICONS[s.icon] ?? Mail;
            return (
              <a
                key={s.platform}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.platform}
                className="text-text-dim transition-colors hover:text-text"
              >
                <Icon size={16} />
              </a>
            );
          })}
        </div>

        <p className="text-center font-mono text-[11px] text-text-faint">
          © {new Date().getFullYear()} {siteConfig.name}. Built with code, curiosity, and a lot of iteration.
        </p>
      </div>
    </footer>
  );
}
