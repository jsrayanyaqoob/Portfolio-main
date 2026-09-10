import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenisInstance(lenis: Lenis | null) {
  instance = lenis;
}

export function scrollToId(id: string) {
  const target = document.getElementById(id);
  if (!target) return;

  if (instance) {
    instance.scrollTo(target, { offset: 0 });
  } else {
    target.scrollIntoView({ behavior: "smooth" });
  }
}

/**
 * Scrolls into a specific moment (0–1) of a tall pinned section, e.g. the
 * "About" or "Skills" scene inside the continuous portrait experience.
 */
export function scrollToProgress(wrapperId: string, progress: number) {
  const wrapper = document.getElementById(wrapperId);
  if (!wrapper) return;
  const target = wrapper.offsetTop + wrapper.offsetHeight * progress;

  if (instance) {
    instance.scrollTo(target, { offset: 0 });
  } else {
    window.scrollTo({ top: target, behavior: "smooth" });
  }
}
