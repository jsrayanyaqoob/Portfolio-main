import { featuredProjects, otherProjects } from "@/data/projects";
import { ProjectRow } from "@/components/projects/project-row";
import { MoreProjects } from "@/components/projects/more-projects";
import { Reveal } from "@/components/ui/reveal";

export function Projects() {
  return (
    <section id="projects" className="relative border-t border-border bg-bg py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <Reveal>
          <div className="flex items-baseline gap-4">
            <span className="font-display text-2xl font-semibold text-text-faint">02</span>
            <span className="font-mono text-xs uppercase tracking-[0.35em] text-text-dim">Selected Work</span>
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mt-4 max-w-2xl text-balance font-display text-4xl font-semibold leading-tight text-text sm:text-5xl">
            A selection of products I&apos;ve designed and built end to end.
          </h2>
        </Reveal>

        <div className="mt-16">
          {featuredProjects.map((project, i) => (
            <ProjectRow key={project.id} project={project} index={i} />
          ))}
        </div>

        <MoreProjects projects={otherProjects} />
      </div>
    </section>
  );
}
