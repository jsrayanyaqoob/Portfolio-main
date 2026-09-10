"use client";

import { useCallback, useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

function getSnapshot(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerSnapshot(): Theme {
  return "light";
}

export function useTheme() {
  // getServerSnapshot keeps the first client render matching the SSR markup;
  // React re-renders with the real (script-applied) class right after hydration.
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTheme = useCallback(() => {
    const next: Theme = document.documentElement.classList.contains("dark") ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    document.documentElement.style.colorScheme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // localStorage may be unavailable (private mode); theme still applies for this session.
    }
  }, []);

  return { theme, toggleTheme };
}
