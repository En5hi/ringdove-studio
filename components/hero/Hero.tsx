"use client";

import { motion, type MotionValue, useMotionValueEvent } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Locale, SiteContent } from "../../lib/i18n";
import { localeCookie } from "../../lib/geo";
import { localePaths } from "../../lib/i18n";
import { cn } from "../../lib/utils";
import { ReactiveGradientWebGL } from "./ReactiveGradientWebGL";

type HeroProps = {
  hero: SiteContent["hero"];
  opacity: MotionValue<number>;
  blur: MotionValue<string>;
  locale: Locale;
};

export function Hero({ hero, opacity, blur, locale }: HeroProps) {
  const router = useRouter();
  const [pointerEvents, setPointerEvents] = useState<"auto" | "none">("auto");

  useMotionValueEvent(opacity, "change", (value) => {
    setPointerEvents(value > 0.05 ? "auto" : "none");
  });

  const switchLocale = (target: Locale) => {
    document.cookie = `${localeCookie}=${target};path=/;max-age=${60 * 60 * 24 * 180};samesite=lax`;
    router.push(localePaths[target]);
  };

  return (
    <section className="relative h-screen overflow-hidden">
      <div className="fixed inset-0 z-0">
        <ReactiveGradientWebGL className="absolute inset-0" interactive />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-background" />
      </div>

      <motion.div
        style={{ opacity, filter: blur, pointerEvents }}
        className="fixed inset-0 z-10"
      >
        <div className="flex h-full w-full items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="text-balance font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
              {hero.logo}
            </h1>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute bottom-10 right-10 hidden max-w-sm text-right text-sm text-muted sm:block">
            {hero.slogan}
          </div>
          <div className="absolute bottom-6 right-6 block w-full px-6 text-xs text-muted sm:hidden">
            {hero.slogan}
          </div>
        </div>

        <div className="absolute bottom-10 left-10 hidden items-center gap-2 text-sm text-muted sm:flex">
          <button
            onClick={() => switchLocale("en")}
            className={cn(
              "rounded-full border border-white/15 px-3 py-1 transition hover:border-white/40 hover:text-white",
              locale === "en" && "bg-white text-black"
            )}
            aria-pressed={locale === "en"}
          >
            EN
          </button>
          <button
            onClick={() => switchLocale("pl")}
            className={cn(
              "rounded-full border border-white/15 px-3 py-1 transition hover:border-white/40 hover:text-white",
              locale === "pl" && "bg-white text-black"
            )}
            aria-pressed={locale === "pl"}
          >
            PL
          </button>
        </div>
        <div className="absolute bottom-6 left-6 flex w-full items-center gap-2 px-6 text-xs text-muted sm:hidden">
          <button
            onClick={() => switchLocale("en")}
            className={cn(
              "rounded-full border border-white/15 px-3 py-1 transition hover:border-white/40 hover:text-white",
              locale === "en" && "bg-white text-black"
            )}
            aria-pressed={locale === "en"}
          >
            EN
          </button>
          <button
            onClick={() => switchLocale("pl")}
            className={cn(
              "rounded-full border border-white/15 px-3 py-1 transition hover:border-white/40 hover:text-white",
              locale === "pl" && "bg-white text-black"
            )}
            aria-pressed={locale === "pl"}
          >
            PL
          </button>
        </div>
      </motion.div>
    </section>
  );
}
