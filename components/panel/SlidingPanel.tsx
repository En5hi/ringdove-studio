"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Experiment, SiteContent } from "../../lib/i18n";
import { About } from "../sections/About";
import { Contact } from "../sections/Contact";
import { Experiments } from "../sections/Experiments";
import { Footer } from "../sections/Footer";
import { Projects } from "../sections/Projects";
import { StickySection } from "../sections/StickySection";
import { LeftNav } from "../nav/LeftNav";

type SlidingPanelProps = {
  content: SiteContent;
  experiments: Experiment[];
  onSectionChange?: (id: string) => void;
};

const sectionIds = ["about", "projects", "experiments", "contact"];

export function SlidingPanel({ content, experiments, onSectionChange }: SlidingPanelProps) {
  const [active, setActive] = useState<string>("about");
  const reduceMotion = useReducedMotion();
  const footerRef = useRef<HTMLDivElement | null>(null);

  const observerOptions = useMemo(
    () => ({
      root: null,
      rootMargin: "-30% 0px -30% 0px",
      threshold: [0, 0.25, 0.5, 0.75, 1]
    }),
    []
  );

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
          onSectionChange?.(entry.target.id);
        }
      });
    }, observerOptions);

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [observerOptions, onSectionChange]);

  return (
    <motion.section
      className="relative z-20 border-t border-white/10 bg-black/45 backdrop-blur-2xl"
      initial={reduceMotion ? false : { opacity: 0, y: 120 }}
      animate={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative mx-auto max-w-7xl px-5 py-12 lg:px-10 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[18%_1fr] lg:gap-24">
          <div className="lg:col-span-2">
            <div className="grid gap-12 lg:grid-cols-[18%_1fr] lg:gap-24">
              <div className="lg:sticky lg:top-0 lg:h-[100vh] lg:pr-6">
                <LeftNav items={content.nav.items} activeId={active} />
              </div>
              <div className="relative flex-1">
                <StickySection id="about">
                  <About copy={content.sections.about} />
                </StickySection>
                <StickySection id="projects">
                  <Projects copy={content.sections.projects} />
                </StickySection>
                <StickySection id="experiments">
                  <Experiments copy={content.sections.experiments} experiments={experiments} />
                </StickySection>
                <StickySection id="contact">
                  <Contact copy={content.sections.contact} />
                </StickySection>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div ref={footerRef} className="w-full">
        <Footer />
      </div>
    </motion.section>
  );
}
