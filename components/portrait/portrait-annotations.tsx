const ANNOTATIONS = [
  { label: "React", className: "left-[8%] top-[28%] sm:left-[16%] sm:top-[30%]", align: "left" as const },
  { label: "Next.js", className: "right-[8%] top-[24%] sm:right-[16%] sm:top-[26%]", align: "right" as const },
  { label: "TypeScript", className: "left-[6%] bottom-[26%] sm:left-[14%] sm:bottom-[24%]", align: "left" as const },
  { label: "Node.js", className: "right-[6%] bottom-[30%] sm:right-[14%] sm:bottom-[28%]", align: "right" as const },
];

export function PortraitAnnotations() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden sm:block">
      {ANNOTATIONS.map((a) => (
        <div
          key={a.label}
          className={`absolute flex items-center gap-2 ${a.className} ${
            a.align === "right" ? "flex-row-reverse" : ""
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full border border-text-faint" />
          <span className={`h-px w-8 bg-border-strong`} />
          <span className="font-mono text-[11px] uppercase tracking-widest text-text-dim">{a.label}</span>
        </div>
      ))}
    </div>
  );
}
