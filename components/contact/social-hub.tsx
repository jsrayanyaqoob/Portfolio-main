"use client";

import { Mail } from "lucide-react";
import type { ComponentType } from "react";
import { socials } from "@/data/socials";
import { siteConfig } from "@/config/site";
import { useCursorHover } from "@/hooks/use-cursor";
import { GithubIcon, LinkedinIcon, InstagramIcon, YoutubeIcon } from "@/components/ui/brand-icons";

const ICONS: Record<string, ComponentType<{ size?: number }>> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
  mail: Mail,
};

export function SocialHub() {
  const openCursor = useCursorHover("hover");
  const active = socials.filter((s) => s.url);

  const nodes = [{ platform: "Email", url: `mailto:${siteConfig.email}`, icon: "mail" }, ...active];

  return (
    <div className="flex flex-col">
      {nodes.map((node) => {
        const Icon = ICONS[node.icon] ?? Mail;
        return (
          <a
            key={node.platform}
            {...openCursor}
            href={node.url}
            target={node.url.startsWith("mailto:") ? undefined : "_blank"}
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-4 border-b border-border py-4 text-text-dim transition-colors first:pt-0 hover:text-text"
          >
            <span className="flex items-center gap-3 text-sm">
              <Icon size={15} />
              {node.platform}
            </span>
            <span className="font-mono text-xs text-text-faint transition-transform group-hover:translate-x-1">
              ↗
            </span>
          </a>
        );
      })}
    </div>
  );
}
