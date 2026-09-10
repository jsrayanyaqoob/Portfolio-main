import { siteConfig } from "@/config/site";

export interface Social {
  platform: string;
  url: string;
  icon: "github" | "linkedin" | "instagram" | "youtube";
}

// Sourced from config/site.ts so URLs live in exactly one place.
// Entries with an empty url are filtered out wherever this is rendered.
export const socials: Social[] = [
  { platform: "GitHub", url: siteConfig.socials.github, icon: "github" },
  { platform: "LinkedIn", url: siteConfig.socials.linkedin, icon: "linkedin" },
  { platform: "Instagram", url: siteConfig.socials.instagram, icon: "instagram" },
  { platform: "YouTube", url: siteConfig.socials.youtube, icon: "youtube" },
];
