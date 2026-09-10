import { existsSync } from "node:fs";
import { join } from "node:path";
import { Navbar } from "@/components/navigation/navbar";
import { SectionObserver } from "@/components/layout/section-observer";
import { PortraitExperience } from "@/components/portrait/portrait-experience";
import { Projects } from "@/components/projects/projects";
import { Experience } from "@/components/experience/experience";
import { Services } from "@/components/services/services";
import { Contact } from "@/components/contact/contact";
import { Footer } from "@/components/layout/footer";
import { siteConfig } from "@/config/site";
import { getImageSize } from "@/lib/image-size";

const PLACEHOLDER_SIZE = { width: 640, height: 860 };

export default function Home() {
  const realPortraitPath = join(process.cwd(), "public", "images", "profile", "rayan.png");
  const hasRealPortrait = existsSync(realPortraitPath);
  const portraitSrc = hasRealPortrait ? siteConfig.portraitSrc : siteConfig.portraitPlaceholder;
  const portraitSize = (hasRealPortrait && getImageSize(realPortraitPath)) || PLACEHOLDER_SIZE;

  const hasVideo = existsSync(join(process.cwd(), "public", "mainvideo-seekable.mp4"));
  const videoSrc = hasVideo ? siteConfig.portraitVideoSrc : null;

  return (
    <>
      <Navbar />
      <SectionObserver />
      <main id="main-content">
        <PortraitExperience portraitSrc={portraitSrc} portraitSize={portraitSize} videoSrc={videoSrc} />
        <Projects />
        <Experience />
        <Services />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
