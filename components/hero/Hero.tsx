"use client";

import { motion, type MotionValue } from "framer-motion";
import type { SiteContent } from "../../lib/i18n";
import { ReactiveBackgroundCanvas } from "./ReactiveBackgroundCanvas";

type HeroProps = {
  hero: SiteContent["hero"];
  opacity: MotionValue<number>;
};

export function Hero({ hero, opacity }: HeroProps) {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <ReactiveBackgroundCanvas />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-background" />
      </div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 flex flex-col items-center gap-4 text-center"
      >
        <div className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.4em] text-muted">
          {hero.logo}
        </div>
        <h1 className="max-w-3xl text-balance font-display text-4xl sm:text-5xl md:text-6xl">
          {hero.slogan}
        </h1>
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="absolute bottom-10 right-10 z-10 hidden max-w-xs text-right text-sm text-muted sm:block"
      >
        {hero.corner}
      </motion.div>
      <motion.div
        style={{ opacity }}
        className="absolute bottom-6 left-6 z-10 block w-full px-6 text-xs text-muted sm:hidden"
      >
        {hero.corner}
      </motion.div>
    </section>
  );
}
