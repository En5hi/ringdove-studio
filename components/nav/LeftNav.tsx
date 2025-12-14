"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { localePaths, NavItem, Locale } from "../../lib/i18n";
import { localeCookie } from "../../lib/geo";
import { cn } from "../../lib/utils";

type LeftNavProps = {
  items: NavItem[];
  activeId?: string;
  locale: Locale;
};

export function LeftNav({ items, activeId, locale }: LeftNavProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(false);
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  };

  const switchLocale = (target: Locale) => {
    document.cookie = `${localeCookie}=${target};path=/;max-age=${60 * 60 * 24 * 180};samesite=lax`;
    router.push(localePaths[target]);
  };

  return (
    <div className="sticky top-8 z-20">
      <div className="mb-6 flex items-center justify-between gap-4 lg:flex-col lg:items-start">
        <div className="text-xs uppercase tracking-[0.25em] text-muted">Menu</div>
        <div className="flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs">
          <button
            onClick={() => switchLocale("en")}
            className={cn(
              "rounded-full px-3 py-1 transition",
              locale === "en" ? "bg-white text-black" : "text-muted hover:text-white"
            )}
            aria-pressed={locale === "en"}
          >
            EN
          </button>
          <button
            onClick={() => switchLocale("pl")}
            className={cn(
              "rounded-full px-3 py-1 transition",
              locale === "pl" ? "bg-white text-black" : "text-muted hover:text-white"
            )}
            aria-pressed={locale === "pl"}
          >
            PL
          </button>
        </div>
        <button
          onClick={() => setOpen((o) => !o)}
          className="ml-auto inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-xs text-muted transition hover:border-white/30 hover:text-white lg:hidden"
          aria-expanded={open}
        >
          Menu
          <span className="text-[10px]">{open ? "−" : "+"}</span>
        </button>
      </div>

      <div className={cn("lg:block", open ? "block" : "hidden")}>
        <motion.ul
          layout
          className="grid grid-cols-2 gap-2 rounded-2xl border border-border bg-white/5 p-2 lg:grid-cols-1"
        >
          {items.map((item) => {
            const active = activeId === item.id;
            return (
              <motion.li key={item.id} layout>
                <button
                  onClick={() => scrollTo(item.id)}
                  className={cn(
                    "w-full rounded-xl px-4 py-3 text-left text-sm transition",
                    active
                      ? "bg-white text-black shadow-glow"
                      : "text-muted hover:text-white hover:bg-white/10"
                  )}
                  aria-current={active ? "true" : "false"}
                >
                  <div className="flex items-center justify-between">
                    <span>{item.label}</span>
                    {active && (
                      <motion.span
                        layoutId="nav-dot"
                        className="h-2 w-2 rounded-full bg-black lg:bg-accent"
                      />
                    )}
                  </div>
                </button>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </div>
  );
}
