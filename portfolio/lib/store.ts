"use client";

import { create } from "zustand";

export type CursorVariant = "default" | "hover" | "view" | "explore" | "hidden";

interface UIState {
  isMobileMenuOpen: boolean;
  cursorVariant: CursorVariant;
  cursorText: string;
  activeSection: string;
  setMobileMenuOpen: (v: boolean) => void;
  setCursor: (variant: CursorVariant, text?: string) => void;
  setActiveSection: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  cursorVariant: "default",
  cursorText: "",
  activeSection: "home",
  setMobileMenuOpen: (v) => set({ isMobileMenuOpen: v }),
  setCursor: (variant, text = "") => set({ cursorVariant: variant, cursorText: text }),
  setActiveSection: (id) => set({ activeSection: id }),
}));
