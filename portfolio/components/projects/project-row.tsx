"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/data/projects";
import { Reveal } from "@/components/ui/reveal";
import { useCursorHover } from "@/hooks/use-cursor";
import { GithubIcon } from "@/components/ui/brand-icons";
import { cn } from "@/lib/utils";

export function ProjectRow({ project, index }: { project: Project; index: number }) {
  const reversed = index % 2 === 1;
  const viewCursor = useCursorHover("view", "VIEW PROJECT ↗");
  const number = String(index + 1).padStart(2, "0");

  return (
    <div className="grid grid-cols-1 gap-8 border-t border-border py-14 first:border-t-0 first:pt-0 md:grid-cols-12 md:gap-10 md:py-20">
      <div className={cn("md:col-span-7", reversed && "md:order-2")}>
        <Reveal>
          {project.liveUrl ? (
            <a
              {...viewCursor}
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/img block overflow-hidden rounded-sm"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover/img:scale-[1.04] group-hover/img:rotate-1"
                />
              </div>
            </a>
          ) : (
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-surface">
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
              />
            </div>
          )}
        </Reveal>
      </div>

      <div className={cn("md:col-span-5", reversed && "md:order-1")}>
        <Reveal delay={0.08} className="h-full">
          <div className="flex h-full flex-col justify-center">
            <span className="font-display text-5xl font-semibold text-text-faint">{number}</span>
            <span className="mt-4 font-mono text-[11px] uppercase tracking-widest text-text-dim">
              {project.category}
            </span>
            <h3 className="mt-2 font-display text-3xl font-semibold text-text sm:text-4xl">{project.title}</h3>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-text-dim">{project.shortDescription}</p>
            <p className="mt-4 font-mono text-xs text-text-faint">{project.technologies.join(" / ")}</p>

            <div className="mt-6 flex flex-wrap items-center gap-5">
              {project.liveUrl ? (
                <a
                  {...viewCursor}
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link inline-flex items-center gap-2 text-sm font-medium text-text underline-offset-4 hover:underline"
                >
                  View Project
                  <ArrowRight size={14} className="transition-transform group-hover/link:translate-x-1" />
                </a>
              ) : (
                <span className="text-sm text-text-faint">Link coming soon</span>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-text-dim transition-colors hover:text-text"
                >
                  <GithubIcon size={14} />
                  View Code
                </a>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
