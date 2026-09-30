export interface ExperienceItem {
  id: string;
  organization: string;
  role: string;
  period: string;
  type: "Training" | "Internship";
  description: string;
  highlights: string[];
  technologies: string[];
}

export const experience: ExperienceItem[] = [
  {
    id: "saylani-internship",
    organization: "Saylani Mass IT Training",
    role: "Web Development Intern",
    period: "Present",
    type: "Internship",
    description:
      "Currently interning on the web development team, building production-facing React applications and collaborating with the broader engineering team on full-stack features.",
    highlights: [
      "Building responsive, production-facing React applications",
      "Collaborating with the team on full-stack features",
      "Applying full-stack fundamentals from training in a real production setting",
    ],
    technologies: ["React", "JavaScript", "Node.js", "Git"],
  },
  {
    id: "saylani",
    organization: "Saylani Mass IT Training",
    role: "Web & Mobile App Development",
    period: "Training Program",
    type: "Training",
    description:
      "Completed structured training in web and mobile application development, covering modern frontend engineering and full-stack fundamentals.",
    highlights: [
      "Built responsive web applications with React and JavaScript",
      "Learned full-stack development fundamentals",
      "Practiced Git-based collaborative workflows",
    ],
    technologies: ["React", "JavaScript", "HTML", "CSS", "Git"],
  },
];
