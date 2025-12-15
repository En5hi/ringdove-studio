"use client";

import { motion, type MotionValue, useMotionValueEvent } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Locale, SiteContent } from "../../lib/i18n";
import { localeCookie } from "../../lib/geo";
import { localePaths } from "../../lib/i18n";
import { cn } from "../../lib/utils";
import { ReactiveGradientWebGL } from "./ReactiveGradientWebGL";
import { UnicornBackground } from "./UnicornBackground";

type HeroProps = {
  hero: SiteContent["hero"];
  opacity: MotionValue<number>;
  blur: MotionValue<string>;
  backgroundBlur: MotionValue<string>;
  parallaxY: MotionValue<string>;
  locale: Locale;
};

export function Hero({
  hero,
  opacity,
  blur,
  backgroundBlur,
  parallaxY,
  locale
}: HeroProps) {
  const router = useRouter();
  const [pointerEvents, setPointerEvents] = useState<"auto" | "none">("auto");
  const backgroundMode = process.env.NEXT_PUBLIC_BG_MODE ?? "webgl";
  const useUnicornBackground = backgroundMode === "unicorn";

  useMotionValueEvent(opacity, "change", (value) => {
    setPointerEvents(value > 0.05 ? "auto" : "none");
  });

  const switchLocale = (target: Locale) => {
    document.cookie = `${localeCookie}=${target};path=/;max-age=${60 * 60 * 24 * 180};samesite=lax`;
    router.push(localePaths[target]);
  };

  return (
    <section className="relative h-screen overflow-hidden">
      <motion.div style={{ filter: backgroundBlur }} className="fixed inset-0 z-0">
        {useUnicornBackground ? (
          <UnicornBackground />
        ) : (
          <ReactiveGradientWebGL className="absolute inset-0" interactive />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-background" />
      </motion.div>

      <motion.div
        style={{ opacity, filter: blur, pointerEvents, y: parallaxY }}
        className="fixed inset-0 z-10"
      >
        <div className="flex h-full w-full items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="text-balance font-display text-5xl font-semibold sm:text-6xl md:text-7xl lg:text-8xl">
              <span className="relative inline-block">
                <span className="absolute inset-0 blur-3xl opacity-40 saturate-150 mix-blend-screen text-[#342b73]">
                  {hero.logo}
                </span>
                <span className="absolute inset-0 blur-2xl opacity-40 saturate-150 mix-blend-screen text-[#7c3b2a]">
                  {hero.logo}
                </span>
                <span className="relative">{hero.logo}</span>
              </span>
            </h1>
          </div>
        </div>

        <div className="absolute top-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/15 bg-black/40 px-2 py-1 text-[11px] text-muted shadow-[0_10px_40px_rgba(0,0,0,0.4)] backdrop-blur">
          <button
            onClick={() => switchLocale("en")}
            className={cn(
              "rounded-full px-2 py-0.5 transition hover:text-white",
              locale === "en" && "bg-white text-black"
            )}
            aria-pressed={locale === "en"}
          >
            EN
          </button>
          <span className="text-white/30">/</span>
          <button
            onClick={() => switchLocale("pl")}
            className={cn(
              "rounded-full px-2 py-0.5 transition hover:text-white",
              locale === "pl" && "bg-white text-black"
            )}
            aria-pressed={locale === "pl"}
          >
            PL
          </button>
        </div>

        <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-10">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted">
            <span>Scroll</span>
            <svg
              aria-hidden
              className="h-4 w-4 animate-bounce-slow text-white/70"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M12 5v14m0 0-5-5m5 5 5-5" />
            </svg>
            <span className="h-px w-8 bg-white/30" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
