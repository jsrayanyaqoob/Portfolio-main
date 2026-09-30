import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
import { Reveal } from "@/components/ui/reveal";
import { GithubIcon } from "@/components/ui/brand-icons";

export function MoreProjects({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  return (
    <div className="mt-24 border-t border-border pt-16">
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-text-dim">More Projects</p>
      </Reveal>
      <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <Reveal key={project.id} delay={(i % 3) * 0.06}>
            <div className="group">
              <div className="relative aspect-video w-full overflow-hidden rounded-sm border border-border bg-surface">
                {project.liveUrl ? (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </a>
                ) : (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                )}
              </div>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-text-faint">
                {project.category}
              </p>
              <h4 className="mt-1 font-display text-lg font-semibold text-text">{project.title}</h4>

              {(project.liveUrl || project.githubUrl) && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link inline-flex items-center gap-1.5 rounded-full bg-text px-4 py-2 text-xs font-medium text-bg transition-colors hover:opacity-85"
                    >
                      Live Demo
                      <ArrowUpRight size={13} className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-border-strong px-4 py-2 text-xs font-medium text-text-dim transition-colors hover:border-text hover:text-text"
                    >
                      <GithubIcon size={13} />
                      GitHub
                    </a>
                  )}
                </div>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
