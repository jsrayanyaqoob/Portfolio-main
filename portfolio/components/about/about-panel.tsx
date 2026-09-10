import { siteConfig } from "@/config/site";

const FOCUS_AREAS = ["React", "Next.js", "JavaScript", "Modern Frontend Architecture", "UI/UX", "Full-Stack Web Apps"];

export function AboutPanel() {
  return (
    <div className="max-w-sm">
      <div className="flex items-baseline gap-4">
        <span className="font-display text-5xl font-semibold text-text-faint">01</span>
        <span className="font-mono text-xs uppercase tracking-[0.35em] text-text-dim">About</span>
      </div>
      <p className="mt-6 text-balance font-display text-2xl font-medium leading-snug text-text sm:text-3xl">
        I&apos;m {siteConfig.name}, a frontend developer focused on building modern, responsive, and interactive
        digital products.
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        {FOCUS_AREAS.map((item) => (
          <span
            key={item}
            className="rounded-full border border-border-strong px-3 py-1 text-xs text-text-dim"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
