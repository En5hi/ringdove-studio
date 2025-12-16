"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { PropsWithChildren, useRef } from "react";
import { cn } from "../../lib/utils";

type StickySectionProps = PropsWithChildren<{
  id: string;
  className?: string;
}>;

export function StickySection({ id, className, children }: StickySectionProps) {
  const ref = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();
  const isFirstSection = id === "about";

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // More overlap - sections appear earlier and stay visible longer
  const opacity = useTransform(
    scrollYProgress,
    isFirstSection ? [0, 0.1, 0.65, 0.8] : [0.2, 0.3, 0.4, 0.6, 0.65, 0.75],
    isFirstSection ? [1, 1, 1, 0] : [0, 0.5, 1, 1, 0.5, 0]
  );
  
  const blur = useTransform(
    scrollYProgress,
    isFirstSection ? [0, 0.6, 0.65, 0.8] : [0.2, 0.3, 0.4, 0.6, 0.65, 0.75],
    reduceMotion
      ? ["blur(0px)", "blur(0px)", "blur(0px)", "blur(0px)", "blur(0px)", "blur(0px)"]
      : isFirstSection
        ? ["blur(0px)", "blur(0px)", "blur(6px)", "blur(24px)"]
        : ["blur(20px)", "blur(4px)", "blur(0px)", "blur(0px)", "blur(6px)", "blur(24px)"]
  );
  
  // Constant slow upward motion - no acceleration, sections slide up at steady pace
  const y = useTransform(
    scrollYProgress,
    isFirstSection ? [0, 0.1, 0.65, 0.8] : [0.2, 0.3, 0.4, 0.6, 0.65, 0.75],
    reduceMotion 
      ? [0, 0, 0, 0, 0, 0] 
      : isFirstSection 
        ? [0, 0, -30, -80] 
        : [170, 80, 0, -30, -80, -150]
  );

  return (
    <section
      id={id}
      ref={ref}
      className={cn(
        "relative min-h-[140vh] scroll-mt-24",
        className
      )}
    >
      <div className="sticky top-0 flex h-screen items-center justify-center">
        <motion.div
          style={{ opacity, filter: blur, y }}
          className="pointer-events-auto"
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}
