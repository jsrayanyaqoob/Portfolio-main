"use client";

import { useEffect } from "react";
import { useUIStore } from "@/lib/store";

// "home" / "about" / "skills" are set from scroll progress inside the pinned
// portrait experience (see animations/portrait-timeline.ts). This only
// tracks the normal, non-pinned sections that follow it.
const SECTION_IDS = ["projects", "experience", "contact"];

export function SectionObserver() {
  const setActiveSection = useUIStore((s) => s.setActiveSection);

  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => !!el
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [setActiveSection]);

  return null;
}
