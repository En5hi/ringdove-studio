"use client";

import {
  motion,
  type MotionValue,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent
} from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
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
  tintStrength?: MotionValue<number>;
  activeSection?: string;
};

export function Hero({
  hero,
  opacity,
  blur,
  backgroundBlur,
  parallaxY,
  locale,
  tintStrength,
  activeSection
}: HeroProps) {
  const router = useRouter();
  const [pointerEvents, setPointerEvents] = useState<"auto" | "none">("auto");
  const [mouseRatio, setMouseRatio] = useState(0.5);
  const [localTime, setLocalTime] = useState<string>("");
  const backgroundMode = process.env.NEXT_PUBLIC_BG_MODE ?? "webgl";
  const useUnicornBackground = backgroundMode === "unicorn";

  useMotionValueEvent(opacity, "change", (value) => {
    setPointerEvents(value > 0.05 ? "auto" : "none");
  });

  const switchLocale = (target: Locale) => {
    document.cookie = `${localeCookie}=${target};path=/;max-age=${60 * 60 * 24 * 180};samesite=lax`;
    router.push(localePaths[target]);
  };

  const overlayGradientClass = useUnicornBackground
    ? "bg-gradient-to-b from-black/40 via-black/25 to-background/40"
    : "bg-gradient-to-b from-black/80 via-black/50 to-background";

  const tint = useMemo(() => {
    switch (activeSection) {
      case "about":
        return "rgba(255,120,40,0.45)"; // More saturated orange
      case "projects":
        return "rgba(40,220,240,0.42)"; // More vivid teal
      case "experiments":
        return "rgba(255,60,80,0.42)"; // More saturated red
      case "contact":
        return "rgba(160,100,255,0.4)"; // More vivid purple
      default:
        return "rgba(255,120,40,0.45)";
    }
  }, [activeSection]);

  const leftOpacity = 0.2 + (1 - mouseRatio) * 0.6;
  const rightOpacity = 0.2 + mouseRatio * 0.6;
  const fallbackTint = useMotionValue(0);
  const safeTintStrength = tintStrength ?? fallbackTint;
  const tintOpacity = safeTintStrength;
  const backgroundFilter = useMotionTemplate`${backgroundBlur}`;

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Europe/Warsaw"
    });
    const update = () => setLocalTime(formatter.format(new Date()));
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      className="relative h-screen overflow-hidden"
      onMouseMove={(e) => {
        if (typeof window === "undefined") return;
        setMouseRatio(e.clientX / window.innerWidth);
      }}
    >
      <motion.div style={{ filter: backgroundFilter }} className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-[-8%]">
          <motion.div
            className="absolute inset-0 z-[1] pointer-events-none"
            animate={{ backgroundColor: tint }}
            style={{ opacity: tintOpacity, mixBlendMode: "overlay" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
          {useUnicornBackground ? (
            <UnicornBackground />
          ) : (
            <ReactiveGradientWebGL className="absolute inset-0" interactive />
          )}
          <div className={cn("absolute inset-0", overlayGradientClass)} />
        </div>
      </motion.div>

      <motion.div
        style={{ opacity, filter: blur, pointerEvents, y: parallaxY }}
        className="fixed inset-0 z-10"
      >
        <div className="absolute inset-x-0 top-0 z-30 flex items-start justify-between px-6 pt-6 text-xs uppercase tracking-[0.24em] text-white/60">
          <div className="flex items-center gap-3">
            <button
              onClick={() => switchLocale("en")}
              className={cn("transition hover:text-white/80", locale === "en" && "text-white")}
              aria-pressed={locale === "en"}
            >
              EN
            </button>
            <span className="text-white/40">/</span>
            <button
              onClick={() => switchLocale("pl")}
              className={cn("transition hover:text-white/80", locale === "pl" && "text-white")}
              aria-pressed={locale === "pl"}
            >
              PL
            </button>
          </div>
          <div className="pointer-events-none flex flex-1 items-center justify-center">
            <div className="h-9 w-9">
              <Image
                src="/logo-mark.svg"
                alt="Ringdove logo"
                width={36}
                height={36}
                className="h-full w-full object-contain opacity-80"
              />
            </div>
          </div>
          <div className="text-right text-xs uppercase tracking-[0.24em] text-white/60">
            {localTime}
          </div>
        </div>

        <div className="flex h-full w-full items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center">
            <h1
              className="text-balance font-medium text-6xl sm:text-7xl md:text-8xl lg:text-[7rem]"
              style={{ fontFamily: "var(--font-logo)", fontWeight: 500 }}
            >
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

        <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-8">
          <svg
            aria-hidden
            className="h-6 w-6 animate-bounce-slow text-white/70"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M12 5v14m0 0-5-5m5 5 5-5" />
          </svg>
        </div>

        <div className="pointer-events-none absolute inset-x-6 bottom-8 z-10 flex items-end justify-between gap-6 text-sm uppercase tracking-[0.24em] text-white/80">
          <motion.div
            className="whitespace-pre text-left"
            style={{
              opacity: leftOpacity,
              fontFamily: "var(--font-body)"
            }}
          >
            {"DESIGN\nLED\nDIGITAL\nSTUDIO"}
          </motion.div>
          <motion.div
            className="flex flex-col items-end gap-2 text-right"
            style={{
              opacity: rightOpacity,
              fontFamily: "var(--font-body)"
            }}
          >
            <div className="whitespace-pre">{"HATCHED\nIN POLAND"}</div>
            <div className="whitespace-pre">{"FLYING\nEVERYWHERE"}</div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
