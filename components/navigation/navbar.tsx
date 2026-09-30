"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useUIStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { scrollToId, scrollToProgress } from "@/lib/lenis-instance";
import { SCENES } from "@/animations/portrait-timeline";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { ThemeToggle } from "@/components/navigation/theme-toggle";

const LINKS = [
  { id: "about", label: "About", progress: SCENES.aboutStart + 0.02 },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills", progress: SCENES.skillsStart + 0.02 },
  { id: "tech-stack", label: "Stack" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { isMobileMenuOpen, setMobileMenuOpen, activeSection } = useUIStore();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  function goTo(link: (typeof LINKS)[number]) {
    setMobileMenuOpen(false);
    if (!reducedMotion && link.progress !== undefined) {
      scrollToProgress("home", link.progress);
    } else {
      scrollToId(link.id);
    }
  }

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled ? "border-b border-border bg-bg/80 py-3 backdrop-blur-md" : "bg-transparent py-6"
        )}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 sm:px-10">
          <button
            onClick={() => scrollToId("home")}
            className="font-display text-lg font-semibold tracking-tight text-text"
          >
            {siteConfig.initial}
          </button>

          <ul className="hidden items-center gap-8 md:flex">
            {LINKS.map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => goTo(link)}
                  className={cn(
                    "underline-reveal font-mono text-[11px] uppercase tracking-widest transition-colors hover:text-text",
                    activeSection === link.id ? "text-text" : "text-text-dim"
                  )}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            {siteConfig.availability && (
              <span className="hidden items-center gap-2 rounded-full border border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-text-dim md:flex">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-status" />
                </span>
                {siteConfig.availabilityLabel}
              </span>
            )}
            <ThemeToggle />
            <button onClick={() => setMobileMenuOpen(true)} className="text-text md:hidden" aria-label="Open menu">
              <Menu size={22} />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex flex-col bg-bg md:hidden"
          >
            <div className="flex items-center justify-between px-6 py-5">
              <span className="font-display text-lg font-semibold tracking-tight text-text">{siteConfig.initial}</span>
              <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu" className="text-text">
                <X size={24} />
              </button>
            </div>
            <nav className="flex flex-1 flex-col justify-center gap-2 px-8">
              {LINKS.map((link, i) => (
                <motion.button
                  key={link.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i, duration: 0.4 }}
                  onClick={() => goTo(link)}
                  className="py-3 text-left font-display text-4xl font-semibold text-text"
                >
                  {link.label}
                </motion.button>
              ))}
            </nav>
            {siteConfig.availability && (
              <div className="border-t border-border px-8 py-6 font-mono text-xs uppercase tracking-widest text-text-dim">
                {siteConfig.availabilityLabel}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
