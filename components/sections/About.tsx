"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import type { SectionCopy } from "../../lib/i18n";

type AboutProps = {
  copy: SectionCopy;
  scrollYProgress?: MotionValue<number>;
};

const paragraph1 = "We're a design-led digital studio that transforms bold ideas into exceptional experiences. Our designer-first approach pairs visual exploration with resilient engineering—shipping fast, iterating with intent, and obsessing over the details that make interfaces feel alive.";
const paragraph2 = "From interactive brand stories to audio software design, we specialize in work that doesn't just look brilliant, but works brilliantly.";

function AnimatedParagraph({ text, startProgress, endProgress, scrollYProgress }: { text: string; startProgress: number; endProgress: number; scrollYProgress: MotionValue<number> }) {
  const words = text.split(" ");
  const totalWords = words.length;
  
  return (
    <p>
      {words.map((word, index) => {
        // Calculate this word's position within the reveal range
        const wordProgress = index / totalWords;
        const wordStart = startProgress + wordProgress * (endProgress - startProgress);
        const wordEnd = startProgress + ((index + 1) / totalWords) * (endProgress - startProgress);
        
        const opacity = useTransform(
          scrollYProgress,
          [0, startProgress, wordStart, wordEnd, endProgress, 1],
          [0.3, 0.3, 0.3, 1, 1, 1]
        );
        
        return (
          <motion.span
            key={index}
            style={{ opacity }}
          >
            {word}{index < words.length - 1 && " "}
          </motion.span>
        );
      })}
    </p>
  );
}

export function About({ copy, scrollYProgress }: AboutProps) {
  // If scrollYProgress is provided (from StickySection), use animated paragraphs
  // Otherwise render static text
  if (!scrollYProgress) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col items-start gap-6 text-left">
        <h2 className="font-display text-4xl uppercase tracking-[0.12em]">{copy.heading}</h2>
        <div className="space-y-4 text-2xl leading-relaxed text-white/85">
          <p>{paragraph1}</p>
          <p>{paragraph2}</p>
        </div>
      </div>
    );
  }
  
  // Slowmo: ~14 scrollwheel clicks starting around 0.4
  // Text reveal: starts after 1 click (~0.41), completes with buffer before slowmo ends
  return (
    <div className="mx-auto flex max-w-4xl flex-col items-start gap-6 text-left">
      <h2 className="font-display text-4xl uppercase tracking-[0.12em]">{copy.heading}</h2>
      <div className="space-y-4 text-2xl leading-relaxed text-white/85">
        <AnimatedParagraph text={paragraph1} startProgress={0.41} endProgress={0.53} scrollYProgress={scrollYProgress} />
        <AnimatedParagraph text={paragraph2} startProgress={0.53} endProgress={0.65} scrollYProgress={scrollYProgress} />
      </div>
    </div>
  );
}
