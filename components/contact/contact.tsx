import { existsSync } from "node:fs";
import { join } from "node:path";
import { FileText } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/ui/reveal";
import { SocialHub } from "@/components/contact/social-hub";

export function Contact() {
  const hasResume = existsSync(join(process.cwd(), "public", "resume.pdf"));

  return (
    <section id="contact" className="relative border-t border-border bg-bg py-28 sm:py-40">
      <div className="mx-auto max-w-5xl px-6 sm:px-10">
        <Reveal>
          <span className="font-mono text-xs uppercase tracking-[0.35em] text-text-dim">04 — Contact</span>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mt-6 text-balance font-display text-6xl font-semibold uppercase leading-[0.95] tracking-tight text-text sm:text-8xl">
            Let&apos;s
            <br />
            Build
            <br />
            Something.
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-8 max-w-md text-lg leading-relaxed text-text-dim">
            Have a project, product, or idea? Let&apos;s turn it into something real.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-14 sm:grid-cols-2">
          <Reveal delay={0.18}>
            <a
              href={`mailto:${siteConfig.email}`}
              className="font-display text-2xl font-medium text-text underline decoration-border-strong underline-offset-8 transition-colors hover:decoration-text sm:text-3xl"
            >
              {siteConfig.email}
            </a>
            {hasResume && (
              <a
                href={siteConfig.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex w-fit items-center gap-2 text-sm text-text-dim transition-colors hover:text-text"
              >
                <FileText size={15} />
                View Resume
              </a>
            )}
          </Reveal>

          <Reveal delay={0.24}>
            <SocialHub />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
