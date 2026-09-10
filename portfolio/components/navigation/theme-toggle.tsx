"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="relative flex h-8 w-8 items-center justify-center rounded-full text-text-dim transition-colors hover:text-text"
    >
      <Sun
        size={16}
        className="absolute transition-all duration-300"
        style={{
          opacity: theme === "dark" ? 0 : 1,
          transform: theme === "dark" ? "rotate(-90deg) scale(0.5)" : "rotate(0deg) scale(1)",
        }}
      />
      <Moon
        size={16}
        className="absolute transition-all duration-300"
        style={{
          opacity: theme === "dark" ? 1 : 0,
          transform: theme === "dark" ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0.5)",
        }}
      />
    </button>
  );
}
