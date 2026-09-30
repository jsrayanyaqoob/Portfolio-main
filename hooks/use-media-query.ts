"use client";

import { useSyncExternalStore } from "react";

function subscribe(query: string) {
  return (callback: () => void) => {
    const mq = window.matchMedia(query);
    mq.addEventListener("change", callback);
    return () => mq.removeEventListener("change", callback);
  };
}

function getServerSnapshot() {
  return false;
}

export function useMediaQuery(query: string) {
  return useSyncExternalStore(subscribe(query), () => window.matchMedia(query).matches, getServerSnapshot);
}

export function useIsTouchDevice() {
  return useMediaQuery("(hover: none), (pointer: coarse)");
}
