import Image from "next/image";
import type { Project } from "@/data/projects";
import { Reveal } from "@/components/ui/reveal";

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
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-surface">
                {project.liveUrl ? (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </a>
                ) : (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                )}
              </div>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-text-faint">
                {project.category}
              </p>
              <h4 className="mt-1 font-display text-lg font-semibold text-text">{project.title}</h4>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
