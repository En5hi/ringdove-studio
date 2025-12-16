"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import type { SectionCopy } from "../../lib/i18n";

type AboutProps = {
  copy: SectionCopy;
  scrollYProgress?: MotionValue<number>;
};

function AnimatedWord({ word, index, totalWords, startProgress, endProgress, scrollYProgress, isLast }: { 
  word: string; 
  index: number; 
  totalWords: number; 
  startProgress: number; 
  endProgress: number; 
  scrollYProgress: MotionValue<number>;
  isLast: boolean;
}) {
  const wordProgress = index / totalWords;
  const wordStart = startProgress + wordProgress * (endProgress - startProgress);
  const wordEnd = startProgress + ((index + 1) / totalWords) * (endProgress - startProgress);
  
  const opacity = useTransform(
    scrollYProgress,
    [0, startProgress, wordStart, wordEnd, endProgress, 1],
    [0.3, 0.3, 0.3, 1, 1, 1]
  );
  
  return (
    <motion.span style={{ opacity }}>
      {word}{!isLast && " "}
    </motion.span>
  );
}

function AnimatedParagraph({ text, startProgress, endProgress, scrollYProgress }: { text: string; startProgress: number; endProgress: number; scrollYProgress: MotionValue<number> }) {
  if (!text) return null;
  const words = text.split(" ");
  const totalWords = words.length;
  
  return (
    <p>
      {words.map((word, index) => (
        <AnimatedWord
          key={index}
          word={word}
          index={index}
          totalWords={totalWords}
          startProgress={startProgress}
          endProgress={endProgress}
          scrollYProgress={scrollYProgress}
          isLast={index === words.length - 1}
        />
      ))}
    </p>
  );
}

export function About({ copy, scrollYProgress }: AboutProps) {
  // Split body text into paragraphs
  const paragraphs = copy.body.split('\n\n').filter(p => p.trim());
  const [paragraph1, paragraph2] = paragraphs;
  
  // If scrollYProgress is provided (from StickySection), use animated paragraphs
  // Otherwise render static text
  if (!scrollYProgress) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col items-start gap-6 text-left">
        <h2 className="font-display text-4xl uppercase tracking-[0.12em]">{copy.heading}</h2>
        <div className="space-y-4 text-2xl leading-relaxed text-white/85">
          {paragraphs.map((para, index) => (
            <p key={index}>{para}</p>
          ))}
        </div>
      </div>
    );
  }
  
  // Slowmo: ~14 scrollwheel clicks starting around 0.05
  // Text reveal: starts at 0.28 (between old 0.41 and new 0.15), completes with buffer before slowmo ends
  return (
    <div className="mx-auto flex max-w-4xl flex-col items-start gap-6 text-left">
      <h2 className="font-display text-4xl uppercase tracking-[0.12em]">{copy.heading}</h2>
      <div className="space-y-4 text-2xl leading-relaxed text-white/85">
        <AnimatedParagraph text={paragraph1} startProgress={0.28} endProgress={0.46} scrollYProgress={scrollYProgress} />
        <AnimatedParagraph text={paragraph2} startProgress={0.46} endProgress={0.65} scrollYProgress={scrollYProgress} />
      </div>
    </div>
  );
}
