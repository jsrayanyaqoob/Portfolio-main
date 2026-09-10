"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/data/services";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

export function Services() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section className="relative border-t border-border bg-bg py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6 sm:px-10">
        <Reveal>
          <span className="font-mono text-xs uppercase tracking-[0.35em] text-text-dim">What I Do</span>
        </Reveal>

        <div className="mt-10 border-t border-border">
          {services.map((service, i) => {
            const isHovered = hovered === service.id;
            return (
              <Reveal key={service.id} delay={i * 0.04}>
                <div
                  onMouseEnter={() => setHovered(service.id)}
                  onMouseLeave={() => setHovered(null)}
                  className="group cursor-default border-b border-border py-6 transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-baseline gap-5 sm:gap-8">
                      <span className="font-mono text-xs text-text-faint">{String(i + 1).padStart(2, "0")}</span>
                      <h3
                        className={cn(
                          "font-display text-xl font-semibold uppercase tracking-tight text-text transition-transform duration-300 sm:text-2xl",
                          isHovered && "translate-x-2"
                        )}
                      >
                        {service.title}
                      </h3>
                    </div>
                    <ArrowUpRight
                      size={18}
                      className={cn(
                        "shrink-0 text-text-faint transition-all duration-300",
                        isHovered && "translate-x-1 -translate-y-1 text-text"
                      )}
                    />
                  </div>
                  <div
                    className={cn(
                      "grid transition-all duration-300 ease-out",
                      isHovered ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-lg pl-[3.1rem] text-sm leading-relaxed text-text-dim sm:pl-[4.6rem]">
                        {service.description}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2 pl-[3.1rem] sm:pl-[4.6rem]">
                        {service.capabilities.map((c) => (
                          <span key={c} className="font-mono text-[11px] text-text-faint">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
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
