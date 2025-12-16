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

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.45, 0.65, 0.9, 1],
    [0, 1, 1, 0.97, 0.6, 0]
  );
  const blur = useTransform(
    scrollYProgress,
    [0, 0.15, 0.45, 0.65, 0.9, 1],
    reduceMotion
      ? ["blur(0px)", "blur(0px)", "blur(0px)", "blur(0px)", "blur(0px)", "blur(0px)"]
      : ["blur(20px)", "blur(10px)", "blur(0px)", "blur(0px)", "blur(14px)", "blur(26px)"]
  );
  const y = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.7, 1],
    reduceMotion ? [0, 0, 0, 0, 0] : [70, 20, 0, -10, -90]
  );

  return (
    <section
      id={id}
      ref={ref}
      className={cn(
        "relative min-h-[150vh] scroll-mt-24",
        "flex items-center justify-center",
        className
      )}
    >
      <motion.div
        style={{ opacity, filter: blur, y }}
        className="pointer-events-auto sticky top-1/2 -translate-y-1/2 transform"
      >
        {children}
      </motion.div>
    </section>
  );
}
