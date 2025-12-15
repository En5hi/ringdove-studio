"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { Experiment, SiteContent } from "../../lib/i18n";
import { About } from "../sections/About";
import { Contact } from "../sections/Contact";
import { Experiments } from "../sections/Experiments";
import { Projects } from "../sections/Projects";
import { LeftNav } from "../nav/LeftNav";

type SlidingPanelProps = {
  content: SiteContent;
  experiments: Experiment[];
};

const sectionIds = ["about", "projects", "experiments", "contact"];

export function SlidingPanel({ content, experiments }: SlidingPanelProps) {
  const [active, setActive] = useState<string>("about");
  const reduceMotion = useReducedMotion();

  const observerOptions = useMemo(
    () => ({
      root: null,
      rootMargin: "-40% 0px -40% 0px",
      threshold: 0.2
    }),
    []
  );

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    }, observerOptions);

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [observerOptions]);

  return (
    <motion.section
      className="relative z-20 rounded-t-[32px] border-t border-border bg-surface/90 backdrop-blur-3xl shadow-2xl shadow-black/40"
      initial={reduceMotion ? false : { opacity: 0, y: 120 }}
      animate={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-12 lg:flex-row lg:gap-12 lg:px-10 lg:py-16">
        <div className="lg:w-1/4">
          <LeftNav items={content.nav.items} activeId={active} />
        </div>
        <div className="flex-1 space-y-16 lg:space-y-20">
          <About copy={content.sections.about} />
          <Projects copy={content.sections.projects} />
          <Experiments copy={content.sections.experiments} experiments={experiments} />
          <Contact copy={content.sections.contact} />
        </div>
      </div>
    </motion.section>
  );
}
