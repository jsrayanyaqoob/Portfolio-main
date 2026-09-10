import { experience } from "@/data/experience";
import { Reveal } from "@/components/ui/reveal";

export function Experience() {
  return (
    <section id="experience" className="relative border-t border-border bg-bg py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6 sm:px-10">
        <Reveal>
          <div className="flex items-baseline gap-4">
            <span className="font-display text-2xl font-semibold text-text-faint">03</span>
            <span className="font-mono text-xs uppercase tracking-[0.35em] text-text-dim">Experience</span>
          </div>
        </Reveal>

        <div className="mt-14 flex flex-col">
          {experience.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.08}>
              <div className="grid grid-cols-1 gap-3 border-t border-border py-8 first:border-t-0 first:pt-0 sm:grid-cols-[140px_1fr] sm:gap-8">
                <span className="font-mono text-xs uppercase tracking-widest text-text-faint">{item.period}</span>
                <div>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-2xl font-semibold text-text">{item.organization}</h3>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-text-dim">
                      {item.type}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-text-dim">{item.role}</p>
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-dim">{item.description}</p>
                  <p className="mt-4 font-mono text-xs text-text-faint">{item.technologies.join(" / ")}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
