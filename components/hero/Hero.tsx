"use client";

import { motion, type MotionValue } from "framer-motion";
import { useRouter } from "next/navigation";
import type { Locale, SiteContent } from "../../lib/i18n";
import { localeCookie } from "../../lib/geo";
import { localePaths } from "../../lib/i18n";
import { cn } from "../../lib/utils";
import { ReactiveBackgroundCanvas } from "./ReactiveBackgroundCanvas";

type HeroProps = {
  hero: SiteContent["hero"];
  opacity: MotionValue<number>;
  locale: Locale;
};

export function Hero({ hero, opacity, locale }: HeroProps) {
  const router = useRouter();

  const switchLocale = (target: Locale) => {
    document.cookie = `${localeCookie}=${target};path=/;max-age=${60 * 60 * 24 * 180};samesite=lax`;
    router.push(localePaths[target]);
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="fixed inset-0 z-0">
        <ReactiveBackgroundCanvas />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-background" />
      </div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 flex flex-col items-center gap-4 text-center"
      >
        <h1 className="text-balance font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
          {hero.logo}
        </h1>
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="absolute bottom-10 right-10 z-10 hidden max-w-sm text-right text-sm text-muted sm:block"
      >
        {hero.slogan}
      </motion.div>
      <motion.div
        style={{ opacity }}
        className="absolute bottom-6 right-6 z-10 block w-full px-6 text-xs text-muted sm:hidden"
      >
        {hero.slogan}
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="absolute bottom-10 left-10 z-10 hidden items-center gap-2 text-sm text-muted sm:flex"
      >
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
      </motion.div>
      <motion.div
        style={{ opacity }}
        className="absolute bottom-6 left-6 z-10 flex w-full items-center gap-2 px-6 text-xs text-muted sm:hidden"
      >
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
      </motion.div>
    </section>
  );
}
