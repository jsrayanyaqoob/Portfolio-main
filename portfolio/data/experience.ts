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
    id: "internee",
    organization: "Internee.pk",
    role: "Frontend Developer Intern",
    period: "Internship",
    type: "Internship",
    description:
      "Worked on AI-powered application interfaces, building resume analysis tooling and a conversational chatbot experience with React and third-party APIs.",
    highlights: [
      "Built an AI Resume Analyzer with resume parsing and AI-generated feedback",
      "Developed an AI-powered chatbot interface",
      "Integrated third-party APIs into React applications",
      "Collaborated on responsive, production-facing UI",
    ],
    technologies: ["React", "JavaScript", "REST APIs", "AI APIs"],
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
