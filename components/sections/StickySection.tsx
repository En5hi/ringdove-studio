"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { PropsWithChildren, useRef, cloneElement, isValidElement } from "react";
import { cn } from "../../lib/utils";

type StickySectionProps = PropsWithChildren<{
  id: string;
  className?: string;
}>;

export function StickySection({ id, className, children }: StickySectionProps) {
  const ref = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();
  const isFirstSection = id === "about";
  const isContactSection = id === "contact";

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // More overlap - sections appear earlier and stay visible longer
  // About section has extended slowmo period (0.05 to 0.7), then fast fade
  // Contact section stays fully visible (no fade) when footer appears
  // Projects/Experiments slowmo period: 0.3 to 0.7
  const opacity = useTransform(
    scrollYProgress,
    isFirstSection ? [0, 0.05, 0.7, 0.76] : isContactSection ? [0.2, 0.3, 0.4, 1] : [0.15, 0.2, 0.3, 0.7, 0.75, 0.85],
    isFirstSection ? [1, 1, 1, 0] : isContactSection ? [0, 0.5, 1, 1] : [0, 0.5, 1, 1, 0.5, 0]
  );
  
  const blur = useTransform(
    scrollYProgress,
    isFirstSection ? [0, 0.69, 0.72, 0.78] : [0.15, 0.2, 0.3, 0.7, 0.75, 0.85],
    reduceMotion
      ? ["blur(0px)", "blur(0px)", "blur(0px)", "blur(0px)", "blur(0px)", "blur(0px)"]
      : isFirstSection
        ? ["blur(0px)", "blur(0px)", "blur(6px)", "blur(24px)"]
        : isContactSection
          ? ["blur(20px)", "blur(4px)", "blur(0px)", "blur(0px)", "blur(0px)", "blur(0px)"]
          : ["blur(20px)", "blur(4px)", "blur(0px)", "blur(0px)", "blur(6px)", "blur(24px)"]
  );
  
  // Constant slow upward motion - no acceleration, sections slide up at steady pace
  // Contact section stays in place (no upward movement)
  const y = useTransform(
    scrollYProgress,
    isFirstSection ? [0, 0.05, 0.85, 0.92] : [0.15, 0.2, 0.3, 0.7, 0.75, 0.85],
    reduceMotion 
      ? [0, 0, 0, 0, 0, 0] 
      : isFirstSection 
        ? [0, 0, -30, -80] 
        : isContactSection
          ? [170, 80, 0, 0, 0, 0]
          : [170, 80, 0, -30, -80, -150]
  );

  // Clone children and pass scrollYProgress if this is the About section
  const childrenWithProps = isFirstSection && isValidElement(children)
    ? cloneElement(children, { scrollYProgress } as { scrollYProgress: typeof scrollYProgress })
    : children;

  return (
    <section
      id={id}
      ref={ref}
      className={cn(
        isFirstSection ? "relative min-h-[336vh] scroll-mt-24" : "relative min-h-[220vh] scroll-mt-24",
        className
      )}
    >
      <div className="sticky top-0 flex h-screen items-center justify-center">
        <motion.div
          style={{ opacity, filter: blur, y }}
          className="pointer-events-auto"
        >
          {childrenWithProps}
        </motion.div>
      </div>
    </section>
  );
}
