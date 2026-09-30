"use client";

import { skillCategories, skills } from "@/data/skills";
import { techIcons, techColors } from "@/data/tech-icons";
import { Reveal } from "@/components/ui/reveal";

export function TechStack() {
  return (
    <section id="tech-stack" className="relative border-t border-border bg-bg py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6 sm:px-10">
        <Reveal>
          <div className="flex items-baseline gap-4">
            <span className="font-display text-2xl font-semibold text-text-faint">03</span>
            <span className="font-mono text-xs uppercase tracking-[0.35em] text-text-dim">Tech Stack</span>
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mt-4 max-w-2xl text-balance font-display text-4xl font-semibold leading-tight text-text sm:text-5xl">
            Tools I reach for, from interface to infrastructure.
          </h2>
        </Reveal>

        <div className="mt-16 flex flex-col gap-12">
          {skillCategories.map((category, categoryIndex) => {
            const inCategory = skills.filter((s) => s.category === category);
            return (
              <Reveal key={category} delay={0.1 + categoryIndex * 0.05}>
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-text-faint">
                    {category}
                  </span>
                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {inCategory.map((skill) => {
                      const Icon = techIcons[skill.name];
                      if (!Icon) return null;
                      const color = techColors[skill.name];
                      return (
                        <div
                          key={skill.name}
                          title={skill.description}
                          className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-surface px-4 py-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-border-strong hover:bg-surface-2"
                        >
                          <Icon
                            size={28}
                            className={color ? undefined : "text-text-dim transition-colors duration-300 group-hover:text-text"}
                            style={color ? { color } : undefined}
                          />
                          <span className="font-mono text-[11px] uppercase tracking-wide text-text-dim transition-colors duration-300 group-hover:text-text">
                            {skill.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
