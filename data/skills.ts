export type SkillCategory =
  | "Frontend"
  | "Backend"
  | "Database"
  | "State / Architecture"
  | "Cloud / Deployment";

export interface Skill {
  name: string;
  category: SkillCategory;
  description: string;
}

export const skills: Skill[] = [
  // Frontend
  { name: "React", category: "Frontend", description: "Component-driven UI for interactive interfaces." },
  { name: "Next.js", category: "Frontend", description: "Full-stack React framework for production apps." },
  { name: "JavaScript", category: "Frontend", description: "Core language for the web, used everywhere." },
  { name: "TypeScript", category: "Frontend", description: "Typed JavaScript for safer, scalable code." },
  { name: "HTML", category: "Frontend", description: "Semantic structure for every interface." },
  { name: "CSS", category: "Frontend", description: "Styling, layout, and motion on the web." },
  { name: "Tailwind CSS", category: "Frontend", description: "Utility-first styling for fast, consistent UI." },
  { name: "ShadCN UI", category: "Frontend", description: "Accessible component primitives for polished apps." },

  // Backend
  { name: "Node.js", category: "Backend", description: "JavaScript runtime for server-side logic." },
  { name: "Express.js", category: "Backend", description: "Minimal backend framework for REST APIs." },
  { name: "Firebase", category: "Backend", description: "Auth, hosting, and realtime backend services." },
  { name: "Firestore", category: "Backend", description: "Realtime NoSQL database for live data." },
  { name: "REST APIs", category: "Backend", description: "Designing and consuming structured APIs." },
  { name: "JWT", category: "Backend", description: "Token-based authentication for secure sessions." },

  // Database
  { name: "MongoDB", category: "Database", description: "Document database for flexible data models." },
  { name: "Mongoose", category: "Database", description: "Schema modeling for MongoDB in Node.js." },
  { name: "PostgreSQL", category: "Database", description: "Reliable relational database for structured data." },
  { name: "MySQL", category: "Database", description: "Widely-used relational database engine." },
  { name: "DynamoDB", category: "Database", description: "Serverless NoSQL database on AWS." },

  // State / Architecture
  { name: "Redux Toolkit", category: "State / Architecture", description: "Predictable state management at scale." },
  { name: "Zustand", category: "State / Architecture", description: "Lightweight state for React applications." },
  { name: "Prisma", category: "State / Architecture", description: "Type-safe ORM for relational databases." },

  // Cloud / Deployment
  { name: "AWS", category: "Cloud / Deployment", description: "Cloud infrastructure for scalable systems." },
  { name: "Vercel", category: "Cloud / Deployment", description: "Deployment platform for frontend applications." },
  { name: "Git", category: "Cloud / Deployment", description: "Version control for every project." },
  { name: "GitHub", category: "Cloud / Deployment", description: "Collaboration and hosting for source code." },
];

export const skillCategories: SkillCategory[] = [
  "Frontend",
  "Backend",
  "Database",
  "State / Architecture",
  "Cloud / Deployment",
];
