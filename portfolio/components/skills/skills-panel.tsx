"use client";

import { skillCategories, skills } from "@/data/skills";

export function SkillsPanel() {
  return (
    <div className="max-w-xs">
      <div className="flex items-center gap-4">
        <span className="font-display text-5xl font-semibold text-text-faint">02</span>
        <span className="font-mono text-xs uppercase tracking-[0.35em] text-text-dim">Skills</span>
      </div>
      <ul className="mt-6 flex flex-col">
        {skillCategories.map((category) => {
          const inCategory = skills.filter((s) => s.category === category);
          return (
            <li key={category} className="group border-b border-border py-3 first:pt-0 last:border-none">
              <p className="font-display text-base font-medium text-text-dim transition-colors group-hover:text-text">
                {category}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-text-faint transition-colors group-hover:text-text-dim">
                {inCategory.map((s) => s.name).join(" · ")}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
