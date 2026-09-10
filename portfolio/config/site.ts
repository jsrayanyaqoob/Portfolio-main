export const siteConfig = {
  name: "Rayan",
  initial: "R.",
  role: "Full Stack Engineer",
  title: "Rayan — Frontend Developer",
  description:
    "Rayan is a frontend developer building modern web applications, interactive experiences, and digital products with React, Next.js, JavaScript, and modern web technologies.",
  tagline: "I build digital experiences, not just websites.",
  subTagline:
    "Frontend Developer crafting modern web applications with clean code, thoughtful interaction, and polished UI.",
  url: "https://rayan.dev",
  email: "rayanyaqoob83@gmail.com",
  availability: true,
  availabilityLabel: "Available for projects",
  resumeUrl: "/resume.pdf",
  years: "1+",
  positioning:
    "Frontend Developer with 1+ year of experience building responsive web applications using React, Next.js, JavaScript, and Firebase.",
  portraitSrc: "/images/profile/rayan.png",
  portraitPlaceholder: "/images/profile/rayan-placeholder.svg",
  portraitVideoSrc: "/mainvideo-seekable.mp4",
  socials: {
    github: "",
    linkedin: "",
    instagram: "",
    youtube: "",
  },
} as const;

export type SiteConfig = typeof siteConfig;
