import type { IconType } from "react-icons";
import {
  SiReact,
  SiNextdotjs,
  SiJavascript,
  SiTypescript,
  SiHtml5,
  SiCss,
  SiTailwindcss,
  SiShadcnui,
  SiNodedotjs,
  SiExpress,
  SiFirebase,
  SiJsonwebtokens,
  SiMongodb,
  SiMongoose,
  SiPostgresql,
  SiMysql,
  SiRedux,
  SiPrisma,
  SiVercel,
  SiGit,
  SiGithub,
} from "react-icons/si";
import { Cloud, Database, Layers, type LucideIcon } from "lucide-react";

// Not every tool has a Simple Icons brand mark (or one shipped in this
// react-icons version) — AWS, DynamoDB, and Zustand fall back to a generic
// lucide glyph rather than going without an icon entirely.
export const techIcons: Record<string, IconType | LucideIcon> = {
  React: SiReact,
  "Next.js": SiNextdotjs,
  JavaScript: SiJavascript,
  TypeScript: SiTypescript,
  HTML: SiHtml5,
  CSS: SiCss,
  "Tailwind CSS": SiTailwindcss,
  "ShadCN UI": SiShadcnui,
  "Node.js": SiNodedotjs,
  "Express.js": SiExpress,
  Firebase: SiFirebase,
  Firestore: SiFirebase,
  "REST APIs": Layers,
  JWT: SiJsonwebtokens,
  MongoDB: SiMongodb,
  Mongoose: SiMongoose,
  PostgreSQL: SiPostgresql,
  MySQL: SiMysql,
  DynamoDB: Database,
  "Redux Toolkit": SiRedux,
  Zustand: Layers,
  Prisma: SiPrisma,
  AWS: Cloud,
  Vercel: SiVercel,
  Git: SiGit,
  GitHub: SiGithub,
};

// Official brand color per tool, so each mark reads as that tool's real
// logo instead of a flattened gray icon. Anything not listed here (a mark
// whose real brand color is black/white, or a generic fallback glyph with
// no brand color of its own) instead follows the page's text color, since a
// solid black/white logo would otherwise vanish against a dark or light
// card.
export const techColors: Record<string, string> = {
  React: "#61DAFB",
  JavaScript: "#F7DF1E",
  TypeScript: "#3178C6",
  HTML: "#E34F26",
  CSS: "#1572B6",
  "Tailwind CSS": "#38BDF8",
  "Node.js": "#339933",
  Firebase: "#FFA000",
  Firestore: "#FFA000",
  JWT: "#FB015B",
  MongoDB: "#47A248",
  Mongoose: "#880000",
  PostgreSQL: "#336791",
  MySQL: "#4479A1",
  DynamoDB: "#4053D6",
  "Redux Toolkit": "#764ABC",
  AWS: "#FF9900",
  Git: "#F05032",
};
