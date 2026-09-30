export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  technologies: string[];
  image: string;
  gallery: string[];
  featured: boolean;
  liveUrl: string;
  githubUrl: string;
  year: string;
  status: string;
  highlights: string[];
}

// Live/code URLs are intentionally left empty until real links are provided.
// The UI disables the corresponding buttons rather than inventing a URL.
export const projects: Project[] = [
  {
    id: "cartify",
    title: "Cartify",
    shortDescription: "A modern e-commerce platform with full cart and catalog state.",
    description:
      "Cartify is an e-commerce platform focused on smooth product browsing, category filtering, and a persistent shopping cart experience, backed by a real database layer.",
    category: "E-Commerce",
    technologies: ["Next.js", "Tailwind CSS", "Zustand", "MongoDB", "DummyJSON"],
    image: "/images/projects/cartify.webp",
    gallery: ["/images/projects/cartify.webp"],
    featured: true,
    liveUrl: "https://cartify-green-mu.vercel.app",
    githubUrl: "https://github.com/jsrayanyaqoob/Cartify",
    year: "",
    status: "",
    highlights: [
      "Product browsing with category filtering",
      "Persistent shopping cart via Zustand",
      "Dark mode and fully responsive UI",
      "MongoDB-backed data layer",
    ],
  },
  {
    id: "rentanything",
    title: "RentAnything",
    shortDescription: "A large-scale rental marketplace built around access over ownership.",
    description:
      "A rental marketplace that goes far beyond property — houses, vehicles, equipment, and everyday tools — built on the idea that access matters more than ownership.",
    category: "Marketplace",
    technologies: ["Next.js", "React", "Node.js", "MongoDB", "Tailwind CSS"],
    image: "/images/projects/rentanything.webp",
    gallery: ["/images/projects/rentanything.webp"],
    featured: true,
    liveUrl: "https://rentaproperty-five.vercel.app",
    githubUrl: "https://github.com/jsrayanyaqoob/RentAnything",
    year: "",
    status: "",
    highlights: [
      "Cross-category rental marketplace: property, vehicles, tools, equipment",
      "Access-over-ownership product model",
      "Search, filtering, and listing management",
      "Scalable marketplace UI architecture",
    ],
  },
  {
    id: "interview-arena",
    title: "Interview Arena",
    shortDescription: "An interactive interview platform with candidate and recruiter experiences.",
    description:
      "A full-stack interview platform with a candidate experience, recruiter dashboard, live interview room, and analytics — architected for scale on AWS.",
    category: "Full-Stack Platform",
    technologies: ["React", "Node.js", "AWS Lambda", "MySQL / RDS", "DynamoDB", "S3", "CloudFront"],
    image: "/images/projects/interview-arena.png",
    gallery: ["/images/projects/interview-arena.png"],
    featured: true,
    liveUrl: "https://awsinterviewarena.vercel.app",
    githubUrl: "https://github.com/jsrayanyaqoob/Interview-Arena",
    year: "",
    status: "",
    highlights: [
      "Candidate experience and recruiter dashboard",
      "Live interview room with analytics",
      "Serverless architecture on AWS Lambda",
      "Data layer across MySQL/RDS and DynamoDB",
    ],
  },
  {
    id: "trading-platform",
    title: "Trading Platform",
    shortDescription: "A data-driven financial interface for market and company data.",
    description:
      "A financial/trading interface presenting stock pages, market data, company fundamentals, analyst estimates, and ownership data in a dense, highly technical UI.",
    category: "Financial / Data",
    technologies: ["React", "Next.js", "TypeScript", "REST APIs"],
    image: "/images/projects/trading-platform.png",
    gallery: ["/images/projects/trading-platform.png"],
    featured: true,
    liveUrl: "https://web-weld-six-40.vercel.app",
    githubUrl: "https://github.com/jsrayanyaqoob/Billionaires-Strategy",
    year: "",
    status: "",
    highlights: [
      "TradingView-style market data pages",
      "Company fundamentals and valuation views",
      "Analyst estimates and ownership data",
      "Dense, data-heavy dashboard UI",
    ],
  },
  {
    id: "chattrix",
    title: "Chattrix",
    shortDescription: "A real-time chat application with modern messaging UI.",
    description:
      "Chattrix is a real-time chat application with authentication and a modern messaging interface, built on Firebase and Firestore for live data sync.",
    category: "Real-Time App",
    technologies: ["React", "Firebase", "Firestore"],
    image: "/images/projects/chattrix.png",
    gallery: ["/images/projects/chattrix.png"],
    featured: true,
    liveUrl: "https://chattrix-gules.vercel.app",
    githubUrl: "https://github.com/jsrayanyaqoob/Chattrix-Frontend",
    year: "",
    status: "",
    highlights: [
      "Real-time messaging with Firestore",
      "Firebase authentication",
      "Modern, responsive chat interface",
    ],
  },
  {
    id: "resume-analyzer",
    title: "AI Resume Analyzer",
    shortDescription: "AI-powered resume analysis with feedback and chatbot support.",
    description:
      "An AI-powered application that analyzes resumes and generates actionable feedback, paired with a chatbot interface for interactive guidance.",
    category: "AI Application",
    technologies: ["React", "AI API Integration"],
    image: "/images/projects/resume-analyzer.png",
    gallery: ["/images/projects/resume-analyzer.png"],
    featured: false,
    liveUrl: "https://ai-resume-analyzer-opal-xi.vercel.app",
    githubUrl: "https://github.com/jsrayanyaqoob/ai-resume-analyzer",
    year: "",
    status: "",
    highlights: ["AI-generated resume feedback", "Interactive chatbot interface", "Clean, focused UI"],
  },
  {
    id: "smartprice",
    title: "SmartPrice",
    shortDescription: "A price-focused product experience with a modern data UI.",
    description:
      "SmartPrice presents pricing data through a clean, modern frontend — focused on clarity, responsiveness, and an approachable product experience.",
    category: "Web Application",
    technologies: ["React", "Next.js", "Tailwind CSS"],
    image: "/images/projects/smartprice.webp",
    gallery: ["/images/projects/smartprice.webp"],
    featured: false,
    liveUrl: "https://smartprice-five.vercel.app",
    githubUrl: "https://github.com/jsrayanyaqoob/SmartPrice",
    year: "",
    status: "",
    highlights: ["Modern pricing data UI", "Responsive frontend", "Clear product experience"],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const otherProjects = projects.filter((p) => !p.featured);
