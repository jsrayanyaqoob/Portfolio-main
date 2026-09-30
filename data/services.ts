export interface Service {
  id: string;
  title: string;
  description: string;
  capabilities: string[];
}

export const services: Service[] = [
  {
    id: "frontend",
    title: "Frontend Development",
    description: "Fast, accessible, production-grade interfaces built with React and Next.js.",
    capabilities: ["React & Next.js apps", "Component architecture", "Performance optimization"],
  },
  {
    id: "fullstack",
    title: "Full-Stack Development",
    description: "End-to-end applications connecting frontend, backend, and database layers.",
    capabilities: ["Node.js & Express APIs", "MongoDB / PostgreSQL / MySQL", "Authentication & JWT"],
  },
  {
    id: "uiux",
    title: "UI/UX Implementation",
    description: "Turning designs into pixel-accurate, polished production interfaces.",
    capabilities: ["Design-to-code", "Design systems", "Motion & micro-interactions"],
  },
  {
    id: "webapps",
    title: "Web Applications",
    description: "Dashboards, SaaS products, marketplaces, and e-commerce platforms.",
    capabilities: ["SaaS dashboards", "Marketplaces", "E-commerce platforms"],
  },
  {
    id: "interactive",
    title: "Interactive Experiences",
    description: "Scroll-driven storytelling and motion design that goes beyond static pages.",
    capabilities: ["GSAP ScrollTrigger", "Framer Motion", "Cinematic interaction design"],
  },
  {
    id: "ai",
    title: "AI-Powered Applications",
    description: "Applications built around AI APIs and intelligent, conversational interfaces.",
    capabilities: ["AI API integration", "Chat & analysis tools", "Intelligent UI flows"],
  },
];
