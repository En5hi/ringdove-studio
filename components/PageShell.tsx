"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { Experiment, SiteContent } from "../lib/i18n";
import { Hero } from "./hero/Hero";
import { SlidingPanel } from "./panel/SlidingPanel";

type PageShellProps = {
  content: SiteContent;
  experiments: Experiment[];
};

export function PageShell({ content, experiments }: PageShellProps) {
  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const heroBlur = useTransform(scrollYProgress, [0, 0.65], ["blur(0px)", "blur(16px)"]);
  const heroParallax = useTransform(scrollYProgress, [0, 1], ["0vh", "-15vh"]);
  const heroBackgroundBlur = useTransform(
    scrollYProgress,
    [0, 0.7, 1],
    ["blur(0px)", "blur(12px)", "blur(12px)"]
  );
  const panelY = useTransform(scrollYProgress, [0, 1], ["50vh", "0vh"]);

  return (
    <main className="bg-background text-white">
      <section ref={heroRef}>
        <Hero
          hero={content.hero}
          opacity={heroOpacity}
          blur={heroBlur}
          backgroundBlur={heroBackgroundBlur}
          parallaxY={heroParallax}
          locale={content.locale}
        />
      </section>
      <motion.div style={{ y: panelY }} className="relative z-20 -mt-32">
        <SlidingPanel content={content} experiments={experiments} />
      </motion.div>
    </main>
  );
}
