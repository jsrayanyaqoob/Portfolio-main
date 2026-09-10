import { writeFileSync } from "node:fs";
import { join } from "node:path";

const projects = [
  { id: "cartify", label: "Cartify", c1: "#1a1a2e", c2: "#16213e", accent: "#6ee7b7" },
  { id: "rentanything", label: "RentAnything", c1: "#1e1b2e", c2: "#2d1b3d", accent: "#c4b5fd" },
  { id: "interview-arena", label: "Interview Arena", c1: "#12181f", c2: "#1c2b3a", accent: "#7dd3fc" },
  { id: "trading-platform", label: "Trading Platform", c1: "#141210", c2: "#241d14", accent: "#fbbf24" },
  { id: "chattrix", label: "Chattrix", c1: "#161421", c2: "#231a33", accent: "#f0abfc" },
  { id: "resume-analyzer", label: "AI Resume Analyzer", c1: "#0f1a17", c2: "#132620", accent: "#5eead4" },
  { id: "smartprice", label: "SmartPrice", c1: "#181416", c2: "#2a1a1d", accent: "#fca5a5" },
  { id: "wildrydez", label: "WildRydez", c1: "#151a12", c2: "#1f2b17", accent: "#a3e635" },
  { id: "pakrent", label: "PakRent", c1: "#141821", c2: "#1a2436", accent: "#93c5fd" },
  { id: "kitchenpartners", label: "KitchenPartners", c1: "#1b1512", c2: "#2b1f16", accent: "#fdba74" },
];

const outDir = join(process.cwd(), "public", "images", "projects");

function initials(label) {
  return label
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function svgFor(p) {
  const grad = `grad-${p.id}`;
  const glow = `glow-${p.id}`;
  const lines = Array.from({ length: 5 }, (_, i) => {
    const y = 60 + i * 26;
    const w = 60 + ((i * 37) % 140);
    return `<rect x="48" y="${y}" width="${w}" height="6" rx="3" fill="${p.accent}" opacity="${0.14 - i * 0.018}" />`;
  }).join("");

  return `<svg viewBox="0 0 640 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="${grad}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${p.c1}" />
      <stop offset="100%" stop-color="${p.c2}" />
    </linearGradient>
    <radialGradient id="${glow}" cx="50%" cy="0%" r="75%">
      <stop offset="0%" stop-color="${p.accent}" stop-opacity="0.25" />
      <stop offset="100%" stop-color="${p.accent}" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="640" height="400" fill="url(#${grad})" />
  <rect width="640" height="400" fill="url(#${glow})" />
  <g opacity="0.5">
    <circle cx="560" cy="70" r="120" fill="none" stroke="${p.accent}" stroke-opacity="0.15" stroke-width="1" />
    <circle cx="560" cy="70" r="170" fill="none" stroke="${p.accent}" stroke-opacity="0.08" stroke-width="1" />
  </g>
  <rect x="32" y="32" width="576" height="336" rx="18" fill="none" stroke="${p.accent}" stroke-opacity="0.18" stroke-width="1" />
  ${lines}
  <text x="48" y="330" font-family="Arial, sans-serif" font-size="15" letter-spacing="3" fill="${p.accent}" opacity="0.85">${initials(p.label)}</text>
  <text x="48" y="358" font-family="Arial, sans-serif" font-size="22" font-weight="600" fill="#f5f5f5" opacity="0.92">${p.label}</text>
</svg>`;
}

for (const p of projects) {
  writeFileSync(join(outDir, `${p.id}.svg`), svgFor(p), "utf8");
}

console.log(`Wrote ${projects.length} placeholder project images to ${outDir}`);
